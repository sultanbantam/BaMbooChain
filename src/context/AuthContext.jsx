import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  increment,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { requestForToken } from "../utils/NotificationService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login'); // 'login' or 'signup'
  const [activeToast, setActiveToast] = useState(null);
  const [pendingValidations, setPendingValidations] = useState([]);
  const [partnerApps, setPartnerApps] = useState([]);
  const [locationProposals, setLocationProposals] = useState([]);
  const [articles, setArticles] = useState([]);

  // Firebase Auth Observer
  useEffect(() => {
    // CAPTURE REFERRAL CODE GLOBALLY
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('kodiba_referral_code', refCode);
    }

    let unsubUserDoc = null;
    console.log("🚀 Firebase Auth Initializing...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (firebaseUser) {
        console.log("✅ Firebase Auth detected user:", firebaseUser.uid);
        
        // Listen to active user document in real-time
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('yayasan_user', JSON.stringify(userData));
          }
        }, (err) => {
          console.error("Real-time User Profile sync error:", err);
        });

        // Fetch user data from Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("📦 Firestore data found for user:", userData.username);
          
          // --- AUTO CLAIM REFERRAL REWARDS (Hybrid System) ---
          try {
            let newClaimedIds = [];
            let totalBonus = 0;
            let newTxList = [];
            const claimedReferrals = userData.claimedReferrals || [];

            // 1. Try Firebase Query
            try {
              const usersRef = collection(db, "users");
              const qRef = query(usersRef, where("referredBy", "==", userData.username.toLowerCase()));
              const refSnap = await getDocs(qRef);
              refSnap.forEach(docSnap => {
                const referredUser = docSnap.data();
                if (!claimedReferrals.includes(referredUser.id)) {
                  newClaimedIds.push(referredUser.id);
                  totalBonus += 0.5;
                  newTxList.push({
                    id: 'tx_ref_' + Math.random().toString(36).substr(2, 9),
                    type: 'Earn',
                    amount: '+0.5',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Selesai',
                    description: `Bonus Referral (Mendaftar: ${referredUser.username})`
                  });
                }
              });
            } catch(fbErr) {
               console.warn("Firebase referral query blocked. Falling back to local demo storage.");
            }

            // 2. Try LocalStorage Fallback (For Demo Presentation)
            const demoPending = JSON.parse(localStorage.getItem('demo_pending_referrals') || '{}');
            const myDemoPending = demoPending[userData.username.toLowerCase()] || [];
            
            myDemoPending.forEach(refEvent => {
               const fakeId = "demo_" + refEvent.timestamp;
               if (!claimedReferrals.includes(fakeId) && !newClaimedIds.includes(fakeId)) {
                  newClaimedIds.push(fakeId);
                  totalBonus += 0.5;
                  newTxList.push({
                    id: 'tx_ref_' + Math.random().toString(36).substr(2, 9),
                    type: 'Earn',
                    amount: '+0.5',
                    date: new Date(refEvent.timestamp).toISOString().split('T')[0],
                    status: 'Selesai',
                    description: `Bonus Referral (Mendaftar: ${refEvent.username})`
                  });
               }
            });

            if (newClaimedIds.length > 0) {
              console.log(`🎁 Claiming ${totalBonus} BMC for ${newClaimedIds.length} new referrals!`);
              
              const updatedData = {
                ...userData,
                bmcBalance: (userData.bmcBalance || 0) + totalBonus,
                transactions: [...newTxList, ...(userData.transactions || [])],
                claimedReferrals: [...claimedReferrals, ...newClaimedIds]
              };
              
              await updateDoc(doc(db, "users", firebaseUser.uid), {
                bmcBalance: increment(totalBonus),
                transactions: arrayUnion(...newTxList),
                claimedReferrals: arrayUnion(...newClaimedIds)
              });
              
              Object.assign(userData, updatedData); 
              alert(`🎉 Selamat! Anda mendapatkan bonus Referral sebesar ${totalBonus} BMC dari teman yang mendaftar!`);
            }
          } catch (err) {
            console.error("Error auto-claiming referrals:", err);
          }
          // --- END AUTO CLAIM ---

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('yayasan_user', JSON.stringify(userData));
          
          // Request notification permission and save token
          requestForToken(firebaseUser.uid);
        } else {
          console.warn("⚠️ Auth exists but Firestore document is missing for UID:", firebaseUser.uid);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log("ℹ️ No user session in Firebase Auth.");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('yayasan_user');
      }
    });

    return () => {
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  // Firestore Sync: Global Data (Admins see all, Users see theirs)
  useEffect(() => {
    if (!db) return;

    // 1. Partner Applications Sync
    const partnerAppsRef = collection(db, "partner_applications");
    const qPartner = user?.username === 'admin_yayasan' 
      ? partnerAppsRef 
      : query(partnerAppsRef, where("userId", "==", user?.id || "guest"));

    const unsubscribePartners = onSnapshot(qPartner, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPartnerApps(apps);
    }, (err) => console.error("PartnerApps Sync Error:", err));

    // 2. Location Proposals Sync
    const locationPropsRef = collection(db, "location_proposals");
    const qLoc = user?.username === 'admin_yayasan'
      ? locationPropsRef
      : query(locationPropsRef, where("userId", "==", user?.id || "guest"));

    const unsubscribeLocs = onSnapshot(qLoc, (snapshot) => {
      const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocationProposals(locs);
    }, (err) => console.error("LocationProps Sync Error:", err));

    // 3. Pending Validations (Global for now)
    const validationsRef = collection(db, "validations");
    const unsubscribeValidations = onSnapshot(validationsRef, (snapshot) => {
      const vals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingValidations(vals);
    }, (err) => console.error("Validations Sync Error:", err));

    // 4. Articles Sync (Global)
    const articlesRef = collection(db, "articles");
    const unsubscribeArticles = onSnapshot(articlesRef, (snapshot) => {
      const arts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(arts);
    }, (err) => console.error("Articles Sync Error:", err));

    return () => {
      unsubscribePartners();
      unsubscribeLocs();
      unsubscribeValidations();
      unsubscribeArticles();
    };
  }, [user?.id, user?.username]);

  const addNotification = async (text, type = 'info', targetUser = user) => {
    if (!targetUser) return null;
    const newNotif = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      text,
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    
    // Update local state
    if (user && targetUser.id === user.id) {
      const updatedUser = {
        ...targetUser,
        notifications: [newNotif, ...(targetUser.notifications || [])]
      };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      setActiveToast(newNotif);
      setTimeout(() => setActiveToast(null), 4000);
      
      // Update Firestore
      try {
        await updateDoc(doc(db, "users", user.id), {
          notifications: arrayUnion(newNotif)
        });
      } catch (err) {
        console.error("Firestore Error:", err);
      }
    }
    
    return newNotif;
  };

  const markAsRead = async (id) => {
    if (!user) return;
    const updatedNotifs = (user.notifications || []).map(n => n.id === id ? { ...n, isRead: true } : n);
    const updatedUser = { ...user, notifications: updatedNotifs };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), { notifications: updatedNotifs });
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const updatedNotifs = (user.notifications || []).map(n => ({ ...n, isRead: true }));
    const updatedUser = { ...user, notifications: updatedNotifs };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), { notifications: updatedNotifs });
    } catch (err) { console.error(err); }
  };

  const clearNotifications = async () => {
    if (!user) return;
    const updatedUser = { ...user, notifications: [] };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), { notifications: [] });
    } catch (err) { console.error(err); }
  };

  const login = async (userData) => {
    try {
      let emailToUse = userData.email;

      // 1. If using username or phone, find the corresponding email in Firestore
      if (userData.method === 'username' || userData.method === 'phone') {
        const usersRef = collection(db, "users");
        const field = userData.method === 'username' ? "username" : "phone";
        const value = userData.method === 'username' ? userData.username : userData.phone;
        
        const q = query(usersRef, where(field, "==", value));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          alert(`❌ Akun dengan ${userData.method} tersebut tidak ditemukan.`);
          return false;
        }
        
        emailToUse = querySnapshot.docs[0].data().email;
      }

      console.log("🔑 Attempting Firebase Auth Sign In for:", emailToUse);
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, userData.password);
      const fbUser = userCredential.user;
      console.log("✅ Firebase Auth Sign In successful for UID:", fbUser.uid);
      
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      if (userDoc.exists()) {
        const fullData = userDoc.data();
        setUser(fullData);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        addNotification(`Selamat datang kembali, ${fullData.username}!`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/user-not-found') msg = "Akun tidak ditemukan. Silakan daftar.";
      if (err.code === 'auth/wrong-password') msg = "Kata sandi salah.";
      alert("❌ Gagal masuk: " + msg);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      // 1. Check if username exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", userData.username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("❌ Username sudah digunakan!");
        return false;
      }

      console.log("📝 Attempting Firebase Auth Sign Up for:", userData.email);
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const fbUser = userCredential.user;
      console.log("✅ Firebase Auth Sign Up successful for UID:", fbUser.uid);
      
      // 3. Create user profile in Firestore
      const mockAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const newUser = {
        id: fbUser.uid,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        joinedAt: new Date().toISOString(),
        walletAddress: mockAddress,
        bmcBalance: 0, 
        stakedBalance: 0,
        isValidator: false,
        kycStatus: 'unsubmitted',
        securitySettings: { pin: null, twoFactor: false, retina: false },
        transactions: [],
        checkinStreak: 0,
        lastCheckinDate: null,
        notifications: [],
        claimedReferrals: [],
        referredBy: null
      };

      console.log("💾 Saving user profile to Firestore...");
      
      // REFERRAL LOGIC
      try {
        const refCode = userData.referralCode || localStorage.getItem('kodiba_referral_code') || new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '').get('ref');
        
        if (refCode && refCode.startsWith('REF-')) {
          const refIdentifier = refCode.substring(4).toLowerCase();
          newUser.referredBy = refIdentifier; // Blindly track the referrer
          console.log(`✅ Referral code applied: ${refIdentifier}`);
          
          // LOCALSTORAGE FALLBACK FOR DEMO PRESENTATION
          const pending = JSON.parse(localStorage.getItem('demo_pending_referrals') || '{}');
          if (!pending[refIdentifier]) pending[refIdentifier] = [];
          pending[refIdentifier].push({
            username: userData.username,
            timestamp: Date.now()
          });
          localStorage.setItem('demo_pending_referrals', JSON.stringify(pending));
        }
        
        // Clear referral code after successful signup
        localStorage.removeItem('kodiba_referral_code');
      } catch (refError) {
        console.error("Error processing referral:", refError);
      }
      
      await setDoc(doc(db, "users", fbUser.uid), newUser);
      console.log("✅ Firestore Profile created!");
      
      setUser(newUser);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      addNotification(`Selamat bergabung di BaMbooChain! Akun Anda berhasil dibuat.`, 'success');
      return true;
    } catch (err) {
      alert("❌ Gagal daftar: " + err.message);
      return false;
    }
  };

  const updateKyc = async (kycData) => {
      if(!user) return false;
      
      try {
        const q = query(collection(db, "users"), where("kycData.nik", "==", kycData.nik));
        const snap = await getDocs(q);
        const duplicate = snap.docs.find(doc => doc.id !== user.id);
        if (duplicate) {
          alert(`❌ Pengajuan KYC Ditolak!\n\nNomor Identitas (${kycData.nik}) sudah terdaftar dan terverifikasi untuk pengguna lain di ekosistem BaMbooChain.`);
          return false;
        }
      } catch (err) {
        console.warn("Gagal mengecek duplikasi KYC:", err);
      }

      const updatedUser = { ...user, kycStatus: 'pending', kycData };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      
      try {
        await updateDoc(doc(db, "users", user.id), { kycStatus: 'pending', kycData });
      } catch (err) { console.error(err); }
      return true;
  };

  const updateSecurity = async (settings) => {
      if(!user) return;
      const updatedUser = { ...user, securitySettings: { ...user.securitySettings, ...settings } };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      
      try {
        await updateDoc(doc(db, "users", user.id), { securitySettings: updatedUser.securitySettings });
      } catch (err) { console.error(err); }
      return true;
  };

  const updateProfile = async (profileData) => {
      if (!user) return false;
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      
      try {
        await updateDoc(doc(db, "users", user.id), profileData);
      } catch (err) { console.error(err); }
      return true;
  };

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      if (!userDoc.exists()) {
        const mockAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const newUser = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          username: fbUser.email.split('@')[0],
          email: fbUser.email,
          phone: fbUser.phoneNumber || '',
          joinedAt: new Date().toISOString(),
          walletAddress: mockAddress,
          bmcBalance: 0,
          stakedBalance: 0,
          isValidator: false,
          kycStatus: 'unsubmitted',
          securitySettings: { pin: null, twoFactor: false, retina: false },
          transactions: [],
          checkinStreak: 0,
          lastCheckinDate: null,
          notifications: []
        };
        await setDoc(doc(db, "users", fbUser.uid), newUser);
        setUser(newUser);
      } else {
        setUser(userDoc.data());
      }
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      alert("❌ Google Auth Error: " + err.message);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('yayasan_user');
  };

  const openLoginModal = () => {
    setAuthModalInitialTab('login');
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalInitialTab('signup');
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  const addReward = async (amount, description, category = 'Earn') => {
    if (!user) return;
    const newTx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      type: category,
      amount: `+${amount}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description
    };
    const updatedUser = { 
      ...user, 
      bmcBalance: (user.bmcBalance || 0) + amount,
      transactions: [newTx, ...(user.transactions || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        bmcBalance: increment(amount),
        transactions: arrayUnion(newTx)
      });
    } catch (err) { console.error(err); }
    return newTx;
  };

  const calculateLockedBalance = (userData) => {
    if (!userData) return 0;
    
    const hasFiatDeposit = (userData.transactions || []).some(tx => tx.type === 'Fiat');
    const isUnlocked = userData.kycStatus === 'verified' && ((userData.stakedBalance || 0) >= 10 || hasFiatDeposit);
    
    if (isUnlocked) return 0;
    
    const earnedBalance = (userData.transactions || [])
      .filter(tx => tx.type === 'Earn')
      .reduce((sum, tx) => {
        const amt = parseFloat(tx.amount.replace('+', ''));
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);
      
    return Math.min(earnedBalance, userData.bmcBalance || 0);
  };

  const getAvailableBalance = () => {
    if (!user) return 0;
    return Math.max(0, (user.bmcBalance || 0) - calculateLockedBalance(user));
  };

  const spendBmc = async (amount, description, category = 'Spend') => {
    if (!user) return false;
    const availableBalance = getAvailableBalance();
    if (availableBalance < amount) {
      alert(`❌ Saldo tidak cukup. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC / Top-up via Fiat.`);
      return false;
    }
    const newTx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      type: category,
      amount: `-${amount}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description
    };
    const updatedUser = { 
      ...user, 
      bmcBalance: user.bmcBalance - amount,
      transactions: [newTx, ...(user.transactions || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        bmcBalance: increment(-amount),
        transactions: arrayUnion(newTx)
      });
    } catch (err) { console.error(err); }
    return true;
  };

  const transferBmc = async (amount, destinationAddress) => {
    if (!user) return false;
    const availableBalance = getAvailableBalance();
    if (availableBalance < amount) {
      alert(`❌ Transfer gagal. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC / Top-up via Fiat.`);
      return false;
    }

    try {
      // 1. Search for receiver user by walletAddress
      const q = query(collection(db, "users"), where("walletAddress", "==", destinationAddress));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("❌ Transfer gagal. Alamat dompet tujuan tidak terdaftar di ekosistem BaMbooChain!");
        return false;
      }
      
      const receiverDoc = querySnapshot.docs[0];
      const receiverId = receiverDoc.id;
      
      // Prevent transferring to self
      if (receiverId === user.id) {
        alert("❌ Transfer gagal. Anda tidak dapat mengirim token BMC ke alamat dompet Anda sendiri!");
        return false;
      }
      
      const shortAddr = destinationAddress.length > 10 ? `${destinationAddress.substring(0,6)}...${destinationAddress.substring(destinationAddress.length-4)}` : destinationAddress;
      const senderShort = user.walletAddress.length > 10 ? `${user.walletAddress.substring(0,6)}...${user.walletAddress.substring(user.walletAddress.length-4)}` : user.walletAddress;
      
      // 2. Prepare transactions
      const newTxSender = {
        id: 'tx_trf_' + Math.random().toString(36).substr(2, 9),
        type: 'Transfer',
        amount: `-${amount}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Selesai',
        description: `Transfer BMC ke ${shortAddr}`
      };
      
      const newTxReceiver = {
        id: 'tx_rcv_' + Math.random().toString(36).substr(2, 9),
        type: 'Receive',
        amount: `+${amount}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Selesai',
        description: `Menerima BMC dari ${senderShort}`
      };
      
      // 3. Update Sender local state (Receiver will be updated via real-time onSnapshot)
      const updatedUser = { 
        ...user, 
        bmcBalance: user.bmcBalance - amount,
        transactions: [newTxSender, ...(user.transactions || [])]
      };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      
      // 4. Update Sender in Firestore
      await updateDoc(doc(db, "users", user.id), {
        bmcBalance: increment(-amount),
        transactions: arrayUnion(newTxSender)
      });
      
      // 5. Update Receiver in Firestore
      await updateDoc(doc(db, "users", receiverId), {
        bmcBalance: increment(amount),
        transactions: arrayUnion(newTxReceiver)
      });
      
      return true;
    } catch (err) { 
      console.error(err); 
      alert("❌ Terjadi kesalahan saat memproses transfer: " + err.message);
      return false; 
    }
  };

  const stakeBmc = async (amount, role = 'Validator') => {
    if (!user || (user.bmcBalance || 0) < amount) return false;
    const newTx = {
      id: 'tx_stk_' + Math.random().toString(36).substr(2, 9),
      type: 'Stake',
      amount: `-${amount}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description: `Staking ${amount} BMC for ${role} Role`
    };
    const updatedUser = { 
      ...user, 
      bmcBalance: user.bmcBalance - amount,
      stakedBalance: (user.stakedBalance || 0) + amount,
      isValidator: role === 'Validator' ? true : user.isValidator,
      transactions: [newTx, ...(user.transactions || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        bmcBalance: increment(-amount),
        stakedBalance: increment(amount),
        isValidator: updatedUser.isValidator,
        transactions: arrayUnion(newTx)
      });
    } catch (err) { console.error(err); }
    return true;
  };

  const joinKodibaTier = async (tierName, amount) => {
    if (!user || (user.bmcBalance || 0) < amount) {
      alert(`❌ Saldo BMC Anda tidak mencukupi untuk bergabung sebagai ${tierName}. Saldo saat ini: ${user?.bmcBalance || 0} BMC.`);
      return false;
    }
    const newTx = {
      id: 'tx_kodiba_' + Math.random().toString(36).substr(2, 9),
      type: 'Stake',
      amount: `-${amount}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description: `Staking ${amount} BMC for ${tierName} KoDiBa`
    };
    const updatedUser = { 
      ...user, 
      bmcBalance: user.bmcBalance - amount,
      stakedBalance: (user.stakedBalance || 0) + amount,
      kodibaTier: tierName,
      transactions: [newTx, ...(user.transactions || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        bmcBalance: increment(-amount),
        stakedBalance: increment(amount),
        kodibaTier: tierName,
        transactions: arrayUnion(newTx)
      });
      addNotification(`Selamat! Anda telah resmi menjadi ${tierName} di KoDiBa.`, 'success');
    } catch (err) { 
      console.error(err);
      addNotification(`Terjadi kesalahan sistem saat mencoba bergabung.`, 'error');
      return false;
    }
    return true;
  };


  const addPendingValidation = async (data) => {
    const newItem = {
      ...data,
      userId: user?.id || 'guest',
      username: user?.username || 'Guest',
      date: new Date().toISOString()
    };
    
    try {
      await addDoc(collection(db, "validations"), newItem);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const approveValidation = async (validationId, submitterReward = 0, plantingId = null, submitterId = null) => {
    // First, let's check if the validation is a KYC task or an Article task, and update accordingly
    try {
      const valDoc = await getDoc(doc(db, "validations", validationId));
      if (valDoc.exists()) {
        const valData = valDoc.data();
        
        // Handle KYC task
        if (valData.isKyc && submitterId) {
          await updateDoc(doc(db, "users", submitterId), {
            kycStatus: 'verified'
          });
          console.log(`✅ User ${submitterId} KYC verified successfully!`);
        }
        
        // Handle Article validation task
        if (valData.tags?.includes('Artikel') && valData.details?.articleId) {
          const isApproved = submitterReward > 0;
          await updateDoc(doc(db, "articles", valData.details.articleId), {
            approved: isApproved ? true : 'rejected'
          });
          console.log(`✅ Article ${valData.details.articleId} consensus processed! Approved: ${isApproved}`);
          
          if (valData.userId) {
            addNotification(
              isApproved 
                ? `Selamat! Artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" telah disahkan oleh Validator dan dipublikasikan di Akademi BMC!`
                : `Maaf, artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" belum disetujui oleh Validator karena orisinalitas ilmiah.`,
              isApproved ? 'success' : 'info'
            );
          }
        }
      }
    } catch (err) {
      console.error("Error in validation consensus processing:", err);
    }

    if (submitterReward > 0 && submitterId) {
      try {
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          type: 'Earn',
          amount: `+${submitterReward}`,
          date: new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()),
          status: 'Selesai',
          description: `Reward Validasi (Data Disahkan)`
        };
        await updateDoc(doc(db, "users", submitterId), {
          bmcBalance: increment(submitterReward),
          transactions: arrayUnion(newTx)
        });
      } catch (err) {
        console.error("Gagal mengirim reward ke submitter:", err);
      }
    }

    if (plantingId) {
      // We will handle this in BambupediaContext later, 
      // but for now let's update Firestore if it exists
      try {
        await updateDoc(doc(db, "plantings", plantingId), { isVerified: true });
      } catch (err) { console.error("Update planting error:", err); }
    }

    try {
      await updateDoc(doc(db, "validations", validationId), { status: 'approved' });
    } catch (err) { console.error(err); }
  };

  // --- PARTNER & LOCATION MANAGEMENT ---
  const submitPartnerApp = async (data) => {
    const newApp = {
      ...data,
      userId: user?.id || 'guest',
      username: user?.username || 'Guest',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "partner_applications"), newApp);
      
      if (user) {
        await updateDoc(doc(db, "users", user.id), { farmerStatus: 'pending' });
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const approvePartnerApp = async (appId, applicantId) => {
    try {
      await updateDoc(doc(db, "partner_applications", appId), { status: 'verified' });
      if (applicantId) {
        await updateDoc(doc(db, "users", applicantId), { farmerStatus: 'verified' });
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const rejectPartnerApp = async (appId) => {
    try {
      await updateDoc(doc(db, "partner_applications", appId), { status: 'rejected' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const submitLocationProposal = async (data) => {
    const newLoc = {
      ...data,
      userId: user?.id || 'guest',
      username: user?.username || 'Guest',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "location_proposals"), newLoc);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const approveLocation = async (locId) => {
    try {
      await updateDoc(doc(db, "location_proposals", locId), { status: 'verified' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getJakartaCheckinDay = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const partMap = {};
    parts.forEach(p => { partMap[p.type] = p.value; });
    
    const year = parseInt(partMap.year);
    const month = parseInt(partMap.month);
    const day = parseInt(partMap.day);
    const hour = parseInt(partMap.hour);
    
    let checkinDate = new Date(year, month - 1, day);
    if (hour < 7) {
      checkinDate.setDate(checkinDate.getDate() - 1);
    }
    
    const y = checkinDate.getFullYear();
    const m = String(checkinDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkinDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const processCheckin = async () => {
    if (!user) return null;
    const currentWibDay = getJakartaCheckinDay();
    const prevStreak = user.checkinStreak || 0;
    const nextStreak = prevStreak === 7 ? 1 : prevStreak + 1;
    const rewardAmounts = { 1: 0.001, 2: 0.002, 3: 0.003, 4: 0.004, 5: 0.005, 6: 0.006, 7: 0.010 };
    const amount = rewardAmounts[nextStreak];

    const newTx = {
      id: 'tx_chk_' + Math.random().toString(36).substr(2, 9),
      type: 'Earn',
      amount: `+${amount}`,
      date: currentWibDay,
      status: 'Selesai',
      description: `Daily Check-in Reward (Day ${nextStreak})`
    };

    const updatedUser = { 
      ...user, 
      lastCheckinDate: currentWibDay,
      checkinStreak: nextStreak,
      bmcBalance: (user.bmcBalance || 0) + amount,
      transactions: [newTx, ...(user.transactions || [])]
    };
    
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        lastCheckinDate: currentWibDay,
        checkinStreak: nextStreak,
        bmcBalance: increment(amount),
        transactions: arrayUnion(newTx)
      });
    } catch (err) { console.error(err); }
    
    return { amount, nextStreak };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAuthModalOpen, 
      authModalInitialTab,
      pendingValidations,
      partnerApps,
      locationProposals,
      login, 
      signup, 
      loginWithGoogle,
      logout,
      openLoginModal,
      openSignupModal,
      closeModal,
      activeToast,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      addReward,
      spendBmc,
      transferBmc,
      stakeBmc,
      joinKodibaTier,
      updateKyc,
      updateSecurity,
      updateProfile,
      addPendingValidation,
      approveValidation,
      submitPartnerApp,
      approvePartnerApp,
      rejectPartnerApp,
      submitLocationProposal,
      approveLocation,
      processCheckin,
      getJakartaCheckinDay,
      calculateLockedBalance,
      getAvailableBalance,
      articles,
      submitArticle: async (articleData) => {
        try {
          const articleId = 'art_' + Date.now();
          const newArticle = {
            ...articleData,
            id: articleId,
            approved: false, // Default is pending approval
            userId: user?.id || 'guest',
            username: user?.username || 'Guest',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            timestamp: serverTimestamp()
          };
          
          // 1. Add to articles collection in Firestore
          await setDoc(doc(db, "articles", articleId), newArticle);
          
          // 2. Add as a pending validation task so it shows up in the Validator Dashboard!
          const validationItem = {
            id: 'val_' + Date.now(),
            title: `Verifikasi Artikel: ${articleData.title}`,
            tags: 'Artikel, Academy',
            gps: '-',
            date: new Date().toISOString(),
            status: 'pending',
            rewardAmount: 10.0, // Writer reward increased to 10.0 BMC to properly incentivize high-quality research/essays
            userId: user?.id || 'guest',
            plantingId: null,
            uploadedFiles: articleData.images && articleData.images.length > 0
              ? articleData.images.reduce((acc, img, idx) => { acc[`Foto Pendukung ${idx + 1}`] = img; return acc; }, {})
              : (articleData.image ? { 'Foto Cover': articleData.image } : {}),
            details: {
              name: user?.displayName || user?.email?.split('@')[0] || "Pegiat Bambu Hijau",
              articleId: articleId,
              pemilik: user?.displayName || user?.email?.split('@')[0] || "Pegiat Bambu Hijau"
            }
          };
          await setDoc(doc(db, "validations", validationItem.id), validationItem);
          
          addNotification("Artikel berhasil dikirim! Menunggu validasi dari validator.", "info");
          return true;
        } catch (err) {
          console.error("Error submitting article:", err);
          addNotification("Gagal mengirimkan artikel.", "error");
          return false;
        }
      },
      updateArticle: async (articleId, articleData) => {
        try {
          await updateDoc(doc(db, "articles", articleId), {
            ...articleData,
            timestamp: serverTimestamp()
          });

          try {
            const validationsRef = collection(db, "validations");
            const q = query(validationsRef, where("details.articleId", "==", articleId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (validationDoc) => {
              await updateDoc(doc(db, "validations", validationDoc.id), {
                title: `Verifikasi Artikel: ${articleData.title}`,
                content: articleData.content,
                uploadedFiles: articleData.images && articleData.images.length > 0
                  ? articleData.images.reduce((acc, img, idx) => { acc[`Foto Pendukung ${idx + 1}`] = img; return acc; }, {})
                  : (articleData.image ? { 'Foto Cover': articleData.image } : {}),
              });
            });
          } catch (valErr) {
            console.error("Error updating corresponding validation:", valErr);
          }

          addNotification("Artikel berhasil diperbarui!", "success");
          return true;
        } catch (err) {
          console.error("Error updating article:", err);
          addNotification("Gagal memperbarui artikel.", "error");
          return false;
        }
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};
