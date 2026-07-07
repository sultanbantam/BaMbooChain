/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
import { auth, db, functions } from "../firebase/config";
import { requestForToken } from "../utils/NotificationService";
import { useAuthStore } from "../store/useAuthStore";
import { httpsCallable } from "firebase/functions";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    authModalInitialTab,
    activeToast,
    setUser,
    setIsAuthenticated,
    openLoginModal,
    openSignupModal,
    closeModal,
    setActiveToast
  } = useAuthStore();

  const pendingValidations = [];
  const partnerApps = [];
  const locationProposals = [];
  const articles = [];

  // Pi Network Auto-Login Observer (Exclusivity compliance)
  useEffect(() => {
    const isPiBrowser = window.Pi && (
      window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('bambu.pi') || 
      window.location.search.includes('sandbox=true')
    );

    if (isPiBrowser && !isAuthenticated && !user) {
      console.log("🕵️ Pi Browser detected. Auto-authenticating with Pi SDK...");
      const handlePiAutoLogin = async () => {
        try {
          const isSandbox = window.location.search.includes('sandbox=true') || window.location.hostname.includes('vercel.app');
          window.Pi.init({ version: "2.0", sandbox: isSandbox });
          
          const scopes = ['username'];
          const authResult = await window.Pi.authenticate(scopes, () => {});
          
          const piUid = authResult.user.uid;
          const piUsername = authResult.user.username;
          const piEmail = `${piUid}@bamboochain.pi`;
          const piPassword = `pi_${piUid}_secure`;

          console.log(`🔐 Pi user authenticated: ${piUsername}. Logging into Firebase...`);

          try {
            await signInWithEmailAndPassword(auth, piEmail, piPassword);
          } catch (loginErr) {
            if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential' || loginErr.code === 'auth/wrong-password') {
              console.log("🆕 Pi user not found in Firebase. Registering new profile...");
              const userCredential = await createUserWithEmailAndPassword(auth, piEmail, piPassword);
              const fbUser = userCredential.user;
              
              const mockAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
              const newUser = {
                id: fbUser.uid,
                name: piUsername,
                username: piUsername,
                email: piEmail,
                phone: '',
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
                bioText: '',
                statusText: ''
              };
              await setDoc(doc(db, "users", fbUser.uid), newUser);
              console.log("✅ New Pi user profile created in Firestore!");
            } else {
              console.error("Firebase Login Error for Pi User:", loginErr);
            }
          }
        } catch (err) {
          console.error("Pi SDK auto-login failed:", err);
        }
      };
      
      handlePiAutoLogin();
    }
  }, [isAuthenticated, user]);

  // Firebase Auth Observer
  useEffect(() => {
    // CAPTURE REFERRAL CODE GLOBALLY
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('kodiba_referral_code', refCode);
    }

    let unsubUserDoc = null;
    // Handle Redirect Result for Mobile/Safari browsers
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("✅ Google Redirect Auth Success:", result.user.uid);
          const fbUser = result.user;
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);
          
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
              notifications: [],
              bioText: '',
              statusText: ''
            };
            await setDoc(userDocRef, newUser);
          }
        }
      } catch (err) {
        console.error("Redirect Auth Error:", err);
      }
    };
    handleRedirectResult();

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
            setUser({ id: docSnap.id, ...userData });
            setIsAuthenticated(true);
            localStorage.setItem('yayasan_user', JSON.stringify({ id: docSnap.id, ...userData }));
          }
        }, (err) => {
          console.error("Real-time User Profile sync error:", err);
        });

        // Fetch user data from Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() };
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
            } catch {
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



  // Sync older knowledge items that don't have validation entries
  useEffect(() => {
    if (!db || !user) return;
    
    const syncPendingKnowledgeItems = async () => {
      try {
        const knowledgeRef = collection(db, "knowledge_items");
        const qKnowledge = query(knowledgeRef, where("status", "==", "pending"));
        const knowledgeSnap = await getDocs(qKnowledge);
        
        if (knowledgeSnap.empty) return;

        const validationsRef = collection(db, "validations");
        const validationsSnap = await getDocs(validationsRef);
        const existingKnowledgeIds = new Set(
          validationsSnap.docs
            .map(d => d.data().details?.knowledgeId)
            .filter(Boolean)
        );

        for (const itemDoc of knowledgeSnap.docs) {
          const itemData = itemDoc.data();
          const itemId = itemDoc.id;

          if (!existingKnowledgeIds.has(itemId)) {
            const validationId = 'val_k_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const validationItem = {
              id: validationId,
              title: `Verifikasi Knowledge: ${itemData.title || 'Tanpa Judul'}`,
              tags: `Knowledge, ${itemData.type || 'Lainnya'}`,
              gps: itemData.location || 'Online',
              date: itemData.createdAt ? (itemData.createdAt.toDate ? itemData.createdAt.toDate().toISOString() : new Date().toISOString()) : new Date().toISOString(),
              status: 'pending',
              rewardAmount: 25.0,
              userId: itemData.createdBy || 'guest',
              plantingId: null,
              uploadedFiles: itemData.fileUrl ? { [itemData.fileName || 'Berkas']: itemData.fileUrl } : {},
              details: {
                name: itemData.createdByName || 'Kontributor',
                knowledgeId: itemId,
                pemilik: itemData.createdByName || 'Kontributor'
              }
            };
            await setDoc(doc(db, "validations", validationId), validationItem);
            console.log(`Synced validation for older knowledge item: ${itemId}`);
          }
        }
      } catch (err) {
        console.error("Error syncing pending knowledge items:", err);
      }
    };

    syncPendingKnowledgeItems();
  }, [db, user]);

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
        const fullData = { id: userDoc.id, ...userDoc.data() };
        setUser(fullData);
        setIsAuthenticated(true);
        closeModal();
        addNotification(`Selamat datang kembali, ${fullData.username}!`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/user-not-found') msg = "Akun tidak ditemukan. Silakan daftar.";
      if (err.code === 'auth/wrong-password') msg = "Kata sandi salah.";
      if (err.code === 'auth/invalid-credential') msg = "Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali atau daftar jika belum memiliki akun.";
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
        referredBy: null,
        bioText: '',
        statusText: ''
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
      closeModal();
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
        return true;
      } catch (err) { 
        console.error("Firestore updateProfile error:", err); 
        alert("Gagal memperbarui profil di database: " + err.message);
        // Revert local state on failure
        setUser(user);
        localStorage.setItem('yayasan_user', JSON.stringify(user));
        return false;
      }
  };

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      // Use Redirect for mobile compatibility and to prevent popup hanging
      const isMobileOrSafari = /iPhone|iPad|iPod|Android|Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
      
      if (isMobileOrSafari || window.innerWidth < 768) {
        await signInWithRedirect(auth, googleProvider);
        return true; // Execution stops here as page redirects
      }

      // Fallback to popup for desktop Chrome
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
          notifications: [],
          bioText: '',
          statusText: ''
        };
        await setDoc(doc(db, "users", fbUser.uid), newUser);
        setUser(newUser);
      } else {
        setUser({ id: userDoc.id, ...userDoc.data() });
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
    
    const isPiBrowser = window.Pi && (
      window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('bambu.pi') || 
      window.location.search.includes('sandbox=true')
    );
    const hasFiatDeposit = !isPiBrowser && (userData.transactions || []).some(tx => tx.type === 'Fiat');
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
    
    const isPiBrowser = window.Pi && (
      window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('bambu.pi') || 
      window.location.search.includes('sandbox=true')
    );
    if (availableBalance < amount) {
      alert(
        isPiBrowser
          ? `❌ Saldo tidak cukup. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC.`
          : `❌ Saldo tidak cukup. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC / Top-up via Fiat.`
      );
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
    
    const isPiBrowser = window.Pi && (
      window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('bambu.pi') || 
      window.location.search.includes('sandbox=true')
    );
    if (availableBalance < amount) {
      alert(
        isPiBrowser
          ? `❌ Transfer gagal. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC.`
          : `❌ Transfer gagal. Saldo Airdrop/Earned Anda saat ini TERKUNCI.\n\nSyarat Unlock:\n1. KYC Terverifikasi\n2. Staking min. 10 BMC / Top-up via Fiat.`
      );
      return false;
    }

    try {
      const transferBmcFn = httpsCallable(functions, 'transferBmcSecure');
      const response = await transferBmcFn({ amount, destinationAddress });
      return response.data.success;
    } catch (err) {
      console.error("Error in server-side P2P transfer:", err);
      alert("❌ Transfer gagal: " + err.message);
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
      status: 'pending',
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
    const isApproved = submitterReward > 0;
    try {
      const approveValFn = httpsCallable(functions, 'approveValidationSecure');
      await approveValFn({ validationId, submitterReward, plantingId, submitterId, isApproved });
      return true;
    } catch (err) {
      console.error("Error in server-side validation approval, running client-side fallback:", err);

      try {
        const validationRef = doc(db, "validations", validationId);
        const validationDoc = await getDoc(validationRef);
        if (!validationDoc.exists()) {
          alert("❌ Tugas tidak ditemukan.");
          return false;
        }

        const valData = validationDoc.data();
        if (valData.status !== 'pending') {
          alert("❌ Tugas ini sudah diproses.");
          return false;
        }

        const targetUserId = submitterId || valData.userId;
        const rewardAmount = isApproved ? parseFloat(submitterReward || valData.rewardAmount || 0) : 0;
        const validatorUsername = user?.username || 'validator';

        // 1. Update validation document status
        await updateDoc(validationRef, {
          status: isApproved ? 'approved' : 'rejected',
          approvedBy: validatorUsername,
          approvedAt: new Date().toISOString()
        });

        // 2. Client-side fallback for Article rejection/approval if applicable
        if (valData.tags?.includes('Artikel') && valData.details?.articleId) {
          const articleRef = doc(db, "articles", valData.details.articleId);
          await updateDoc(articleRef, {
            approved: isApproved ? true : 'rejected',
            approvedAt: new Date().toISOString()
          });

          // Add notification to writer
          if (targetUserId && targetUserId !== 'guest') {
            const writerRef = doc(db, "users", targetUserId);
            const newNotif = {
              id: 'notif_' + Math.random().toString(36).substr(2, 9),
              text: isApproved 
                ? `Selamat! Artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" telah disahkan oleh Validator dan dipublikasikan di Akademi BMC!`
                : `Maaf, artikel Anda "${valData.title.replace('Verifikasi Artikel: ', '')}" belum disetujui oleh Validator karena orisinalitas ilmiah.`,
              type: isApproved ? 'success' : 'info',
              isRead: false,
              timestamp: new Date().toISOString()
            };
            await updateDoc(writerRef, {
              notifications: arrayUnion(newNotif)
            });
          }
        }

        // 3. Client-side fallback for Knowledge rejection/approval if applicable
        if (valData.tags?.includes('Knowledge') && valData.details?.knowledgeId) {
          const knowledgeRef = doc(db, "knowledge_items", valData.details.knowledgeId);
          const status = isApproved ? 'approved' : 'rejected';
          const statusFields = isApproved
            ? {
                approvedAt: new Date().toISOString(),
                approvedBy: validatorUsername,
                sourceTrust: 'verified'
              }
            : {
                rejectedAt: new Date().toISOString(),
                rejectedBy: validatorUsername,
                sourceTrust: 'rejected'
              };
          
          await updateDoc(knowledgeRef, {
            status,
            updatedAt: new Date().toISOString(),
            ...statusFields
          });

          // Add notification to contributor
          if (targetUserId && targetUserId !== 'guest') {
            const contributorRef = doc(db, "users", targetUserId);
            const newNotif = {
              id: 'notif_' + Math.random().toString(36).substr(2, 9),
              text: isApproved 
                ? `Selamat! Kontribusi sumber pengetahuan Anda "${valData.title.replace('Verifikasi Knowledge: ', '')}" telah disahkan oleh Validator dan mendapatkan 25.0 BMC!`
                : `Maaf, kontribusi sumber pengetahuan Anda "${valData.title.replace('Verifikasi Knowledge: ', '')}" ditolak oleh Validator.`,
              type: isApproved ? 'success' : 'info',
              isRead: false,
              timestamp: new Date().toISOString()
            };
            await updateDoc(contributorRef, {
              notifications: arrayUnion(newNotif)
            });
          }
        }

        // 4. Client-side fallback for KYC rejection/approval if applicable
        if (valData.isKyc && targetUserId && targetUserId !== 'guest') {
          const submitterRef = doc(db, "users", targetUserId);
          await updateDoc(submitterRef, {
            kycStatus: isApproved ? 'verified' : 'rejected'
          });
        }

        // 5. Client-side fallback for Planting lifecycle rejection/approval if applicable
        if (plantingId) {
          const plantingRef = doc(db, "plantings", plantingId);
          await updateDoc(plantingRef, {
            verified: isApproved,
            isVerified: isApproved,
            verifiedAt: isApproved ? new Date().toISOString() : null
          });
        }

        // 6. Submitter Reward Payout (if approved and target user is not guest)
        if (isApproved && rewardAmount > 0 && targetUserId && targetUserId !== 'guest') {
          const submitterRef = doc(db, "users", targetUserId);
          const newTxSubmitter = {
            id: 'tx_sec_rwd_' + Math.random().toString(36).substr(2, 9),
            type: 'Earn',
            amount: `+${rewardAmount}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Selesai',
            description: `Imbalan Validasi Data Laporan: ${valData.title || 'Observasi'}`
          };
          await updateDoc(submitterRef, {
            bmcBalance: increment(rewardAmount),
            transactions: arrayUnion(newTxSubmitter)
          });
        }

        // 7. Validator Commission (+0.05 BMC if approved)
        if (isApproved && user?.id) {
          const validatorRef = doc(db, "users", user.id);
          const newTxValidator = {
            id: 'tx_sec_com_' + Math.random().toString(36).substr(2, 9),
            type: 'Earn',
            amount: `+0.05`,
            date: new Date().toISOString().split('T')[0],
            status: 'Selesai',
            description: `Komisi Verifikasi Laporan (${validationId})`
          };
          await updateDoc(validatorRef, {
            bmcBalance: increment(0.05),
            transactions: arrayUnion(newTxValidator)
          });
        }

        return true;
      } catch (clientErr) {
        console.error("Client-side fallback also failed:", clientErr);
        alert("❌ Gagal memproses validasi: " + clientErr.message);
        return false;
      }
    }
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
      const response = await fetch('/api/v1/agri/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          size: data.size,
          type: data.type,
          vision: data.vision,
          coordinates: data.coordinates,
          owner: data.owner
        })
      });

      if (response.ok) {
        console.log('[AuthContext] Location proposal saved via microservice API.');
        try {
          await addDoc(collection(db, "location_proposals"), newLoc);
        } catch (dbErr) {
          console.warn('[AuthContext] Failed to write fallback doc to Firestore:', dbErr);
        }
        return true;
      }
      throw new Error('Microservice returned non-OK status');
    } catch (err) {
      console.warn('[AuthContext] Microservice offline or error. Falling back to direct Firestore write:', err);
      try {
        await addDoc(collection(db, "location_proposals"), newLoc);
        return true;
      } catch (firestoreErr) {
        console.error('[AuthContext] Direct Firestore fallback write failed:', firestoreErr);
        return false;
      }
    }
  };

  const approveLocation = async (locId) => {
    try {
      const response = await fetch(`/api/v1/agri/proposals/${locId}/verify`, {
        method: 'PUT'
      });

      if (response.ok) {
        console.log('[AuthContext] Location proposal verified via microservice API.');
        try {
          await updateDoc(doc(db, "location_proposals", locId), { status: 'verified' });
        } catch (dbErr) {
          console.warn('[AuthContext] Failed to update status in Firestore fallback:', dbErr);
        }
        return true;
      }
      throw new Error('Microservice returned non-OK status');
    } catch (err) {
      console.warn('[AuthContext] Microservice offline or error. Falling back to direct Firestore update:', err);
      try {
        await updateDoc(doc(db, "location_proposals", locId), { status: 'verified' });
        return true;
      } catch (firestoreErr) {
        console.error('[AuthContext] Direct Firestore fallback update failed:', firestoreErr);
        return false;
      }
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

  const isConsecutiveDay = (lastDateStr, currentDateStr) => {
    if (!lastDateStr || !currentDateStr) return false;
    const lastParts = lastDateStr.split('-');
    const currentParts = currentDateStr.split('-');
    if (lastParts.length !== 3 || currentParts.length !== 3) return false;
    
    const lastDate = Date.UTC(parseInt(lastParts[0]), parseInt(lastParts[1]) - 1, parseInt(lastParts[2]));
    const currentDate = Date.UTC(parseInt(currentParts[0]), parseInt(currentParts[1]) - 1, parseInt(currentParts[2]));
    
    const diffTime = currentDate - lastDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const getActiveStreak = () => {
    if (!user) return 0;
    const currentWibDay = getJakartaCheckinDay();
    const lastCheckin = user.lastCheckinDate || null;
    const isToday = lastCheckin === currentWibDay;
    const isYesterday = isConsecutiveDay(lastCheckin, currentWibDay);
    return (isToday || isYesterday) ? (user.checkinStreak || 0) : 0;
  };

  const submitPlantationDonation = async (donationData) => {
    if (!user) return false;
    
    const defaultMilestones = {
      bibit: { id: 'bibit', name: 'Pemilik Bibit', percent: 16, released: false },
      tanam: { id: 'tanam', name: 'Penanam', percent: 4, released: false },
      rawat: { id: 'rawat', name: 'Perawatan', percent: 10.67, released: false },
      risiko: { id: 'risiko', name: 'Cadangan Risiko', percent: 13.33, released: false },
      lahan: { id: 'lahan', name: 'Pemilik Lahan', percent: 2.67, released: false },
      royalti: { id: 'royalti', name: 'Royalti Sistem', percent: 6.67, released: false },
      pengelola: { id: 'pengelola', name: 'Sabumi (Manajemen)', percent: 46.66, released: false },
    };

    const newDonation = {
      ...donationData,
      userId: user.id,
      username: user.username,
      name: user.name || user.username,
      status: 'pending',
      milestones: defaultMilestones,
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    };

    try {
      // 1. Save to plantations collection
      const docRef = await addDoc(collection(db, "plantations"), newDonation);
      
      // 2. Add transaction to user profile
      const newTx = {
        id: 'tx_plt_' + Math.random().toString(36).substr(2, 9),
        type: 'Spend',
        amount: `-${donationData.amount}`,
        date: newDonation.date,
        status: 'Selesai',
        description: `Dukungan Penanaman di ${donationData.location?.name || 'Lokasi'}`
      };

      const updatedUser = { 
        ...user, 
        transactions: [newTx, ...(user.transactions || [])]
      };
      
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      
      await updateDoc(doc(db, "users", user.id), {
        transactions: arrayUnion(newTx)
      });
      
      return true;
    } catch (err) {
      console.error("Error submitting plantation donation:", err);
      return false;
    }
  };

  const approvePlantationDonation = async (donationId) => {
    try {
      await updateDoc(doc(db, "plantations", donationId), { status: 'verified' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const releaseMilestone = async (donationId, milestoneKey) => {
    try {
      // Create a field path for nested update
      const milestoneField = `milestones.${milestoneKey}.released`;
      await updateDoc(doc(db, "plantations", donationId), {
        [milestoneField]: true
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const processCheckin = async () => {
    if (!user) return null;
    try {
      const claimCheckinFn = httpsCallable(functions, 'claimDailyCheckin');
      const response = await claimCheckinFn();
      const { amount, nextStreak } = response.data;
      return { amount, nextStreak };
    } catch (err) {
      console.warn("Server-side check-in failed, falling back to client-side write:", err);
      
      try {
        const currentWibDay = getJakartaCheckinDay();
        const prevCheckin = user.lastCheckinDate || null;
        
        // Guard: Prevent checking in twice in the same day
        if (prevCheckin === currentWibDay) {
          alert("⚠️ Anda sudah melakukan Check-in hari ini!");
          return null;
        }
        
        const isYesterday = isConsecutiveDay(prevCheckin, currentWibDay);
        const prevStreak = isYesterday ? (user.checkinStreak || 0) : 0;
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
        
        await updateDoc(doc(db, "users", user.id), {
          lastCheckinDate: currentWibDay,
          checkinStreak: nextStreak,
          bmcBalance: increment(amount),
          transactions: arrayUnion(newTx)
        });
        
        return { amount, nextStreak };
      } catch (fallbackErr) {
        console.error("Client-side fallback check-in failed:", fallbackErr);
        alert("❌ Gagal check-in: " + fallbackErr.message);
        return null;
      }
    }
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
      submitPlantationDonation,
      approvePlantationDonation,
      releaseMilestone,
      processCheckin,
      getActiveStreak,
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
      },
      giftBmc: async (targetUserId, targetUserName, amount, description, statusId = null) => {
        if (!user) {
          alert("⚠️ Harap login terlebih dahulu untuk mengirimkan Gift!");
          return false;
        }
        const bmcVal = parseFloat(amount);
        if (isNaN(bmcVal) || bmcVal <= 0) {
          alert("⚠️ Jumlah gift tidak valid!");
          return false;
        }
        if ((user.bmcBalance || 0) < bmcVal) {
          alert(`⚠️ Saldo BMC Anda tidak mencukupi! (Saldo: ${user.bmcBalance || 0} BMC)`);
          return false;
        }
        if (user.id === targetUserId) {
          alert("⚠️ Anda tidak bisa mengirimkan Gift ke diri sendiri!");
          return false;
        }

        try {
          // 1. Decrement sender's balance
          const senderTx = {
            id: 'tx_gift_send_' + Date.now(),
            type: 'Send',
            amount: `-${bmcVal}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Selesai',
            description: `Mengirim Gift ke @${targetUserName}: ${description}`
          };
          await updateDoc(doc(db, "users", user.id), {
            bmcBalance: increment(-bmcVal),
            transactions: arrayUnion(senderTx)
          });

          // 2. Increment receiver's balance
          const receiverTx = {
            id: 'tx_gift_recv_' + Date.now(),
            type: 'Receive',
            amount: `+${bmcVal}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Selesai',
            description: `Menerima Gift dari @${user.username}: ${description}`
          };
          
          // Fetch receiver doc to add notification
          const receiverDocRef = doc(db, "users", targetUserId);
          const receiverSnap = await getDoc(receiverDocRef);
          if (receiverSnap.exists()) {
            const newNotif = {
              id: 'notif_gift_' + Date.now(),
              type: 'success',
              text: `🎉 Anda menerima Gift sebesar ${bmcVal} BMC dari @${user.username}!`,
              timestamp: Date.now(),
              isRead: false
            };
            await updateDoc(receiverDocRef, {
              bmcBalance: increment(bmcVal),
              transactions: arrayUnion(receiverTx),
              notifications: arrayUnion(newNotif)
            });
          }

          // 3. Log the gift in status document or status_interactions
          const giftItem = {
            id: 'gift_' + Date.now(),
            senderId: user.id,
            senderName: user.name || user.username,
            senderUsername: user.username,
            amount: bmcVal,
            timestamp: Date.now()
          };

          if (statusId) {
            const statusDocRef = doc(db, "statuses", statusId);
            await updateDoc(statusDocRef, {
              gifts: arrayUnion(giftItem)
            });
          } else {
            const interactionRef = doc(db, "status_interactions", targetUserId);
            const interactionSnap = await getDoc(interactionRef);
            if (interactionSnap.exists()) {
              await updateDoc(interactionRef, {
                gifts: arrayUnion(giftItem)
              });
            } else {
              await setDoc(interactionRef, {
                likes: [],
                shares: 0,
                comments: [],
                gifts: [giftItem]
              });
            }
          }

          addNotification(`Berhasil mengirimkan Gift sebesar ${bmcVal} BMC ke @${targetUserName}!`, "success");
          return true;
        } catch (err) {
          console.error("Error sending gift:", err);
          alert("❌ Gagal mengirimkan Gift.");
          return false;
        }
      },

      // ============================================================
      // DAO FUNCTIONS
      // ============================================================

      voteOnProposal: async (proposalId, vote) => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        try {
          const propRef = doc(db, 'dao_proposals', proposalId);
          const field = vote === 'yes' ? 'yesVotes' : 'noVotes';
          await updateDoc(propRef, {
            [field]: increment(1),
            [`voters.${user.id}`]: vote
          });
          addNotification(`✅ Vote "${vote}" Anda berhasil direkam!`, 'success');
          return true;
        } catch (err) {
          console.error('voteOnProposal error:', err);
          alert('❌ Gagal vote: ' + err.message);
          return false;
        }
      },

      createProposal: async (data) => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        if ((user.stakedBalance || 0) < 100) {
          alert('❌ Anda harus memiliki minimal 100 BMC yang di-stake untuk membuat proposal.');
          return false;
        }
        try {
          const { addDoc: aDoc, collection: col, serverTimestamp: sts } = await import('firebase/firestore');
          const docRef = await aDoc(col(db, 'dao_proposals'), {
            title: data.title,
            description: data.description,
            author: user.username || user.name,
            authorId: user.id,
            status: 'active',
            endTime: new Date(Date.now() + (data.durationDays || 7) * 24 * 60 * 60 * 1000),
            yesVotes: 0,
            noVotes: 0,
            voters: {},
            minBmcRequired: data.minBmcRequired || 0,
            createdAt: sts()
          });
          addNotification(`🗳️ Proposal "${data.title}" berhasil dibuat!`, 'success');
          return docRef.id;
        } catch (err) {
          console.error('createProposal error:', err);
          alert('❌ Gagal membuat proposal: ' + err.message);
          return false;
        }
      },

      supportFunding: async (campaignId, amount, currency = 'BMC') => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        try {
          if (currency === 'BMC') {
            if ((user.bmcBalance || 0) < amount) { alert('❌ Saldo BMC tidak mencukupi.'); return false; }
            const newTx = {
              id: 'tx_fund_' + Math.random().toString(36).substr(2, 9),
              type: 'Spend',
              amount: `-${amount}`,
              date: new Date().toISOString().split('T')[0],
              status: 'Selesai',
              description: `Community Funding Contribution`
            };
            const updatedUser = { ...user, bmcBalance: user.bmcBalance - amount, transactions: [newTx, ...(user.transactions || [])] };
            setUser(updatedUser);
            localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
            await updateDoc(doc(db, 'users', user.id), { bmcBalance: increment(-amount), transactions: arrayUnion(newTx) });
          }
          const supporter = { userId: user.id, username: user.username || user.name, amount, currency, date: new Date().toISOString() };
          await updateDoc(doc(db, 'dao_funding', campaignId), {
            raisedAmount: increment(amount),
            supporters: arrayUnion(supporter)
          });
          addNotification(`🌿 Kontribusi ${amount} ${currency} berhasil disalurkan!`, 'success');
          return true;
        } catch (err) {
          console.error('supportFunding error:', err);
          alert('❌ Gagal berkontribusi: ' + err.message);
          return false;
        }
      },

      openNftPack: async () => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        const cost = 50;
        if ((user.bmcBalance || 0) < cost) {
          alert(`❌ Membuka Pack NFT memerlukan saldo ${cost} BMC. Saldo Anda: ${user.bmcBalance || 0} BMC.`);
          return false;
        }
        try {
          const currentUnlocked = user.unlockedGuardians || [];
          const allIds = Array.from({ length: 36 }, (_, i) => String(i + 1).padStart(2, '0'));
          const remaining = allIds.filter(id => !currentUnlocked.includes(id));
          if (remaining.length === 0) { alert('🎉 Anda sudah membuka semua 36 Bamboo Guardians!'); return false; }
          const newId = remaining[Math.floor(Math.random() * remaining.length)];
          const newTx = {
            id: 'tx_nft_' + Math.random().toString(36).substr(2, 9),
            type: 'Spend', amount: `-${cost}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Selesai', description: `Membuka Pack NFT: Guardian #${newId}`
          };
          const updatedUser = {
            ...user, bmcBalance: user.bmcBalance - cost,
            unlockedGuardians: [...currentUnlocked, newId],
            transactions: [newTx, ...(user.transactions || [])]
          };
          setUser(updatedUser);
          localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
          await updateDoc(doc(db, 'users', user.id), {
            bmcBalance: increment(-cost),
            unlockedGuardians: arrayUnion(newId),
            transactions: arrayUnion(newTx)
          });
          addNotification(`🎴 Guardian #${newId} berhasil dibuka!`, 'success');
          return newId;
        } catch (err) {
          console.error('openNftPack error:', err);
          alert('❌ Gagal membuka pack: ' + err.message);
          return false;
        }
      },

      completeDailyMission: async (missionId, rewardBmc) => {
        if (!user) return false;
        const today = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
        const completedMissions = user.dao_missions_completed || {};
        const todayMissions = completedMissions[today] || [];
        if (todayMissions.includes(missionId)) return false;
        try {
          const newTx = {
            id: 'tx_mission_' + Math.random().toString(36).substr(2, 9),
            type: 'Earn', amount: `+${rewardBmc}`,
            date: today, status: 'Selesai',
            description: `Misi Harian: ${missionId}`
          };
          const updatedMissions = { ...completedMissions, [today]: [...todayMissions, missionId] };
          const updatedUser = {
            ...user, bmcBalance: (user.bmcBalance || 0) + rewardBmc,
            dao_missions_completed: updatedMissions,
            transactions: [newTx, ...(user.transactions || [])]
          };
          setUser(updatedUser);
          localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
          await updateDoc(doc(db, 'users', user.id), {
            bmcBalance: increment(rewardBmc),
            [`dao_missions_completed.${today}`]: arrayUnion(missionId),
            transactions: arrayUnion(newTx)
          });
          addNotification(`✅ Misi selesai! +${rewardBmc} BMC ditambahkan.`, 'success');
          return true;
        } catch (err) {
          console.error('completeDailyMission error:', err);
          return false;
        }
      },

      postForumTopic: async (topic, content, tags = []) => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        try {
          const { addDoc: aDoc, collection: col, serverTimestamp: sts } = await import('firebase/firestore');
          const docRef = await aDoc(col(db, 'dao_forum'), {
            topic, content,
            author: user.username || user.name,
            authorId: user.id,
            likes: [], replyCount: 0, tags,
            createdAt: sts()
          });
          addNotification(`💬 Topik forum berhasil diposting!`, 'success');
          return docRef.id;
        } catch (err) {
          console.error('postForumTopic error:', err);
          alert('❌ Gagal posting topik: ' + err.message);
          return false;
        }
      },

      likeForumTopic: async (topicId, currentLikes) => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        try {
          const topicRef = doc(db, 'dao_forum', topicId);
          const alreadyLiked = (currentLikes || []).includes(user.id);
          if (alreadyLiked) {
            await updateDoc(topicRef, { likes: arrayRemove(user.id) });
          } else {
            await updateDoc(topicRef, { likes: arrayUnion(user.id) });
          }
          return !alreadyLiked;
        } catch (err) {
          console.error('likeForumTopic error:', err);
          return false;
        }
      },

      bookVisit: async (siteName, visitDate, notes = '') => {
        if (!user) { alert("❌ Silakan login terlebih dahulu!"); return false; }
        try {
          const { addDoc: aDoc, collection: col, serverTimestamp: sts } = await import('firebase/firestore');
          await aDoc(col(db, 'dao_bookings'), {
            siteName, visitDate, notes,
            userId: user.id,
            username: user.username || user.name,
            email: user.email,
            status: 'pending',
            createdAt: sts()
          });
          addNotification(`📅 Booking kunjungan ke "${siteName}" berhasil! Tim kami akan menghubungi Anda.`, 'success');
          return true;
        } catch (err) {
          console.error('bookVisit error:', err);
          alert('❌ Gagal booking: ' + err.message);
          return false;
        }
      },

    }}>
      {children}
    </AuthContext.Provider>
  );
};
