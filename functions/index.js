/* global require, exports */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// 1. SECURE DAILY CHECK-IN FUNCTION
exports.claimDailyCheckin = functions.https.onCall(async (data, context) => {
  // Verify auth
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found.');
    }

    const userData = userDoc.data();
    
    // Get current date in Jakarta (WIB) timezone
    const currentWibDay = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    const lastCheckin = userData.lastCheckinDate || null;

    if (lastCheckin === currentWibDay) {
      throw new functions.https.HttpsError('already-exists', 'Anda sudah melakukan Check-in hari ini!');
    }

    // Calculate next streak
    const lastCheckinTime = lastCheckin ? new Date(lastCheckin).getTime() : 0;
    const currentTime = new Date(currentWibDay).getTime();
    const diffDays = Math.floor((currentTime - lastCheckinTime) / (1000 * 60 * 60 * 24));

    let nextStreak = 1;
    if (diffDays === 1) {
      // Consecutive check-in
      nextStreak = (userData.checkinStreak || 0) + 1;
      if (nextStreak > 7) nextStreak = 1; // Cycle weekly
    }

    // Determine reward amount
    const rewards = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.010];
    const amount = rewards[nextStreak - 1] || 0.001;

    const newTx = {
      id: 'tx_chk_' + Math.random().toString(36).substr(2, 9),
      type: 'Earn',
      amount: `+${amount}`,
      date: currentWibDay,
      status: 'Selesai',
      description: `Daily Check-in Reward (Day ${nextStreak})`
    };

    transaction.update(userRef, {
      lastCheckinDate: currentWibDay,
      checkinStreak: nextStreak,
      bmcBalance: admin.firestore.FieldValue.increment(amount),
      transactions: admin.firestore.FieldValue.arrayUnion(newTx)
    });

    return { success: true, amount, nextStreak };
  });
});

// 2. SECURE P2P BMC TOKEN TRANSFER FUNCTION
exports.transferBmcSecure = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const senderId = context.auth.uid;
  const { amount, destinationAddress } = data;

  const bmcVal = parseFloat(amount);
  if (isNaN(bmcVal) || bmcVal <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Jumlah transfer tidak valid.');
  }

  const senderRef = db.collection('users').doc(senderId);

  return db.runTransaction(async (transaction) => {
    const senderDoc = await transaction.get(senderRef);
    if (!senderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Profil pengirim tidak ditemukan.');
    }

    const senderData = senderDoc.data();

    // Balance check
    if ((senderData.bmcBalance || 0) < bmcVal) {
      throw new functions.https.HttpsError('failed-precondition', 'Saldo BMC Anda tidak mencukupi.');
    }

    // Find receiver by walletAddress
    const receiversQuery = db.collection('users').where('walletAddress', '==', destinationAddress);
    const receiversSnap = await transaction.get(receiversQuery);

    if (receiversSnap.empty) {
      throw new functions.https.HttpsError('not-found', 'Alamat dompet tujuan tidak terdaftar.');
    }

    const receiverDoc = receiversSnap.docs[0];
    const receiverId = receiverDoc.id;

    if (receiverId === senderId) {
      throw new functions.https.HttpsError('invalid-argument', 'Anda tidak dapat mengirim token ke diri sendiri.');
    }

    const shortAddr = destinationAddress.length > 10 
      ? `${destinationAddress.substring(0,6)}...${destinationAddress.substring(destinationAddress.length-4)}` 
      : destinationAddress;
      
    const senderShort = senderData.walletAddress.length > 10 
      ? `${senderData.walletAddress.substring(0,6)}...${senderData.walletAddress.substring(senderData.walletAddress.length-4)}` 
      : senderData.walletAddress;

    // Prepare tx logs
    const newTxSender = {
      id: 'tx_trf_' + Math.random().toString(36).substr(2, 9),
      type: 'Transfer',
      amount: `-${bmcVal}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description: `Transfer BMC ke ${shortAddr}`
    };

    const newTxReceiver = {
      id: 'tx_rcv_' + Math.random().toString(36).substr(2, 9),
      type: 'Receive',
      amount: `+${bmcVal}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description: `Menerima BMC dari ${senderShort}`
    };

    // Atomic Updates
    transaction.update(senderRef, {
      bmcBalance: admin.firestore.FieldValue.increment(-bmcVal),
      transactions: admin.firestore.FieldValue.arrayUnion(newTxSender)
    });

    transaction.update(receiverDoc.ref, {
      bmcBalance: admin.firestore.FieldValue.increment(bmcVal),
      transactions: admin.firestore.FieldValue.arrayUnion(newTxReceiver)
    });

    return { success: true, amount: bmcVal };
  });
});

// 3. SECURE VALIDATOR TASK APPROVAL FUNCTION
exports.approveValidationSecure = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const validatorId = context.auth.uid;
  const { validationId, submitterReward, plantingId, submitterId, isApproved } = data;

  const validatorRef = db.collection('users').doc(validatorId);
  const validationRef = db.collection('validations').doc(validationId);

  return db.runTransaction(async (transaction) => {
    // 1. Confirm Validator identity
    const validatorDoc = await transaction.get(validatorRef);
    if (!validatorDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Validator profile not found.');
    }

    const validatorData = validatorDoc.data();
    const isAdmin = validatorData.username === 'admin_yayasan';
    const isStakedValidator = validatorData.isValidator && (validatorData.stakedBalance || 0) >= 10;

    if (!isAdmin && !isStakedValidator) {
      throw new functions.https.HttpsError('permission-denied', 'Hanya Validator ter-stake resmi yang dapat mengesahkan data.');
    }

    // 2. Fetch Validation Task
    const validationDoc = await transaction.get(validationRef);
    if (!validationDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Tugas validasi tidak ditemukan.');
    }

    const valData = validationDoc.data();
    if (valData.status !== 'pending') {
      throw new functions.https.HttpsError('failed-precondition', 'Tugas ini sudah diproses.');
    }

    const targetUserId = submitterId || valData.userId;
    // Determine approved status: use isApproved if provided, otherwise assume true if submitterReward > 0
    const approved = isApproved !== undefined ? !!isApproved : (parseFloat(submitterReward) > 0);
    const rewardAmount = approved ? parseFloat(submitterReward || valData.rewardAmount || 0) : 0;

    // 3. Apply changes atomic
    transaction.update(validationRef, {
      status: approved ? 'approved' : 'rejected',
      approvedBy: validatorData.username,
      approvedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    let submitterUpdates = {};
    let notificationText = '';
    let notificationType = 'info';

    // Handle KYC task
    if (valData.isKyc && targetUserId && targetUserId !== 'guest') {
      submitterUpdates.kycStatus = approved ? 'verified' : 'rejected';
      console.log(`✅ User ${targetUserId} KYC processed! Approved: ${approved}`);
    }

    // Handle Article validation task
    if (valData.tags?.includes('Artikel') && valData.details?.articleId) {
      const articleRef = db.collection('articles').doc(valData.details.articleId);
      transaction.update(articleRef, {
        approved: approved ? true : 'rejected',
        approvedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Article ${valData.details.articleId} consensus processed! Approved: ${approved}`);

      if (targetUserId) {
        notificationText = approved 
          ? `Selamat! Artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" telah disahkan oleh Validator dan dipublikasikan di Akademi BMC!`
          : `Maaf, artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" belum disetujui oleh Validator karena orisinalitas ilmiah.`;
        notificationType = approved ? 'success' : 'info';
      }
    }

    // Handle Knowledge validation task
    if (valData.tags?.includes('Knowledge') && valData.details?.knowledgeId) {
      const knowledgeRef = db.collection('knowledge_items').doc(valData.details.knowledgeId);
      const status = approved ? 'approved' : 'rejected';
      const statusFields = approved
        ? {
            approvedAt: admin.firestore.FieldValue.serverTimestamp(),
            approvedBy: validatorData.username || 'validator',
            sourceTrust: 'verified'
          }
        : {
            rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
            rejectedBy: validatorData.username || 'validator',
            sourceTrust: 'rejected'
          };
      
      transaction.update(knowledgeRef, {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...statusFields
      });
      console.log(`✅ Knowledge ${valData.details.knowledgeId} consensus processed! Approved: ${approved}`);

      if (targetUserId) {
        notificationText = approved 
          ? `Selamat! Kontribusi sumber pengetahuan Anda "${valData.title.replace('Verifikasi Knowledge: ', '')}" telah disahkan oleh Validator dan mendapatkan 25.0 BMC!`
          : `Maaf, kontribusi sumber pengetahuan Anda "${valData.title.replace('Verifikasi Knowledge: ', '')}" ditolak oleh Validator.`;
        notificationType = approved ? 'success' : 'info';
      }
    }

    // If there is a reward to pay out to the submitter
    if (approved && rewardAmount > 0 && targetUserId && targetUserId !== 'guest') {
      const newTxSubmitter = {
        id: 'tx_sec_rwd_' + Math.random().toString(36).substr(2, 9),
        type: 'Earn',
        amount: `+${rewardAmount}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Selesai',
        description: `Imbalan Validasi Data Laporan: ${valData.title || 'Observasi'}`
      };

      submitterUpdates.bmcBalance = admin.firestore.FieldValue.increment(rewardAmount);
      submitterUpdates.transactions = admin.firestore.FieldValue.arrayUnion(newTxSubmitter);
    }

    // Add notification to submitter if generated
    if (notificationText && targetUserId && targetUserId !== 'guest') {
      const newNotif = {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        text: notificationText,
        type: notificationType,
        isRead: false,
        timestamp: new Date().toISOString()
      };
      submitterUpdates.notifications = admin.firestore.FieldValue.arrayUnion(newNotif);
    }

    // Apply submitter updates if any
    if (Object.keys(submitterUpdates).length > 0 && targetUserId && targetUserId !== 'guest') {
      const submitterRef = db.collection('users').doc(targetUserId);
      transaction.update(submitterRef, submitterUpdates);
    }

    // Validator gets commission (only on approval to align with TokenWalletPage UI alert context)
    let commission = 0;
    if (approved) {
      commission = 0.05;
      const newTxValidator = {
        id: 'tx_sec_com_' + Math.random().toString(36).substr(2, 9),
        type: 'Earn',
        amount: `+${commission}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Selesai',
        description: `Komisi Verifikasi Laporan (${validationId})`
      };

      transaction.update(validatorRef, {
        bmcBalance: admin.firestore.FieldValue.increment(commission),
        transactions: admin.firestore.FieldValue.arrayUnion(newTxValidator)
      });
    }

    // If linked to a planting lifecycle event, update it
    if (plantingId) {
      const plantingRef = db.collection('plantings').doc(plantingId);
      transaction.update(plantingRef, {
        verified: approved,
        isVerified: approved,
        verifiedAt: approved ? admin.firestore.FieldValue.serverTimestamp() : null
      });
    }

    return { success: true, approved, commission };
  });
});
