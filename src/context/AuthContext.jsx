import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load from local storage
  useEffect(() => {
    // Initialize Seed Users if DB is empty
    const currentDB = localStorage.getItem('yayasan_all_users');
    if (!currentDB || JSON.parse(currentDB).length === 0) {
      const seedUsers = [
        {
          id: 'seed1', name: 'Ahmad Subagja', username: 'ahmad_bamboo', email: 'ahmad@example.com', phone: '081234567890', 
          password: 'Password123!', walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', bmcBalance: 1250, 
          kycStatus: 'verified', isValidator: true, securitySettings: { pin: '123456', twoFactor: true, retina: false },
          joinedAt: '2025-01-01T00:00:00Z', transactions: []
        },
        {
          id: 'seed2', name: 'Siti Aminah', username: 'siti_green', email: 'siti@example.com', phone: '081234567891', 
          password: 'Password123!', walletAddress: '0x321d35Cc6634C0532925a3b844Bc454e4438f43d', bmcBalance: 450, 
          kycStatus: 'verified', isValidator: false, securitySettings: { pin: '654321', twoFactor: false, retina: true },
          joinedAt: '2025-02-15T00:00:00Z', transactions: []
        },
        {
          id: 'seed3', name: 'Budi Santoso', username: 'budi_petani', email: 'budi@example.com', phone: '081234567892', 
          password: 'Password123!', walletAddress: '0x999d35Cc6634C0532925a3b844Bc454e4438f99a', bmcBalance: 15.5, 
          kycStatus: 'unsubmitted', isValidator: false, securitySettings: { pin: null, twoFactor: false, retina: false },
          joinedAt: '2026-03-20T00:00:00Z', transactions: []
        },
        {
          id: 'admin1', name: 'Admin Yayasan', username: 'admin_yayasan', email: 'admin@yayasan.org', phone: '081122334455', 
          password: 'AdminYayasan123!', walletAddress: '0x111d35Cc6634C0532925a3b844Bc454e4438f11a', bmcBalance: 1000000, 
          kycStatus: 'verified', isValidator: true, securitySettings: { pin: '999999', twoFactor: true, retina: true },
          joinedAt: '2024-01-01T00:00:00Z', transactions: []
        }
      ];
      localStorage.setItem('yayasan_all_users', JSON.stringify(seedUsers));
    }

    const savedUser = localStorage.getItem('yayasan_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Migration / Retroactive fields
      if(!parsed.walletAddress) parsed.walletAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      if(parsed.stakedBalance === undefined) parsed.stakedBalance = 0;
      if(parsed.isValidator === undefined) parsed.isValidator = false;
      if(!parsed.username) parsed.username = parsed.email ? parsed.email.split('@')[0] : 'user_' + parsed.id;
      if(!parsed.kycStatus) parsed.kycStatus = 'unsubmitted'; // unsubmitted, pending, verified
      if(!parsed.securitySettings) parsed.securitySettings = { pin: null, twoFactor: false, retina: false };
      
      localStorage.setItem('yayasan_user', JSON.stringify(parsed));
      setUser(parsed);
      setIsAuthenticated(true);
    }
    const savedValidations = localStorage.getItem('yayasan_validations');
    if (savedValidations) {
      setPendingValidations(JSON.parse(savedValidations));
    }

    const savedPartnerApps = localStorage.getItem('yayasan_partner_apps');
    if (savedPartnerApps) setPartnerApps(JSON.parse(savedPartnerApps));

    const savedLocationProposals = localStorage.getItem('yayasan_location_proposals');
    if (savedLocationProposals) setLocationProposals(JSON.parse(savedLocationProposals));
  }, []);

  const getMockDB = () => JSON.parse(localStorage.getItem('yayasan_all_users') || '[]');
  const saveToMockDB = (newUser) => {
      const db = getMockDB();
      localStorage.setItem('yayasan_all_users', JSON.stringify([...db, newUser]));
  };

  const addNotification = (text, type = 'info', targetUser = user) => {
    if (!targetUser) return targetUser;
    const newNotif = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      text,
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    const updatedUser = {
      ...targetUser,
      notifications: [newNotif, ...(targetUser.notifications || [])]
    };
    
    // Only update active state if the notification is for the current logged in user
    if (user && targetUser.id === user.id) {
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      setActiveToast(newNotif);
      setTimeout(() => setActiveToast(null), 4000);
    }
    
    return updatedUser;
  };

  const markAsRead = (id) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      notifications: (user.notifications || []).map(n => n.id === id ? { ...n, isRead: true } : n)
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
  };

  const markAllAsRead = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      notifications: (user.notifications || []).map(n => ({ ...n, isRead: true }))
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
  };

  const clearNotifications = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      notifications: []
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
  };

  const login = (userData) => {
    const db = getMockDB();
    const existing = db.find(u => 
        (userData.email && u.email === userData.email) || 
        (userData.phone && u.phone === userData.phone) ||
        (userData.username && u.username === userData.username)
    );

    if (existing) {
        if (userData.password && existing.password !== userData.password) {
            alert("❌ Kata sandi salah!");
            return false;
        }
        
        // Tambahkan notifikasi selamat datang kembali
        const userWithNotif = addNotification(`Selamat datang kembali, ${existing.username}!`, 'success', existing);
        
        setUser(userWithNotif);
        localStorage.setItem('yayasan_user', JSON.stringify(userWithNotif));
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        return true;
    } else {
        alert("❌ Akun tidak ditemukan. Silakan daftar.");
        return false;
    }
  };

  const signup = (userData) => {
    const db = getMockDB();
    
    // Uniqueness Checks
    if (userData.username && db.some(u => u.username === userData.username)) { alert("❌ Username sudah digunakan!"); return false; }
    if (userData.email && db.some(u => u.email === userData.email)) { alert("❌ Email sudah terdaftar!"); return false; }
    if (userData.phone && db.some(u => u.phone === userData.phone)) { alert("❌ Nomor HP sudah terdaftar!"); return false; }

    const mockAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'BaMboo Member',
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      method: userData.method,
      joinedAt: new Date().toISOString(),
      walletAddress: mockAddress,
      bmcBalance: 0,
      stakedBalance: 0,
      isValidator: false,
      kycStatus: 'unsubmitted',
      kycData: null,
      securitySettings: { pin: null, twoFactor: false, retina: false },
      transactions: [],
      checkinStreak: 0,
      lastCheckinDate: null,
      // Farmer Ecosystem fields
      missions: [],
      pendingPayouts: 0,
      farmerStatus: 'none', // none, pending, verified
      assignedLocation: null,
      notifications: []
    };
    
    // Tambahkan notifikasi perdana
    const userWithNotif = addNotification(`Selamat bergabung di BaMbooChain! Akun Anda berhasil dibuat.`, 'success', newUser);
    
    saveToMockDB(userWithNotif);
    setUser(userWithNotif);
    localStorage.setItem('yayasan_user', JSON.stringify(userWithNotif));
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const updateKyc = (kycData) => {
      if(!user) return;
      const updatedUser = { ...user, kycStatus: 'pending', kycData };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      // Update global DB mock
      const db = getMockDB().map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('yayasan_all_users', JSON.stringify(db));
      return true;
  };

  const updateSecurity = (settings) => {
      if(!user) return;
      const updatedUser = { ...user, securitySettings: { ...user.securitySettings, ...settings } };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      const db = getMockDB().map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('yayasan_all_users', JSON.stringify(db));
      return true;
  };

  const updateProfile = (profileData) => {
      if (!user) return false;
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      const db = getMockDB().map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('yayasan_all_users', JSON.stringify(db));
      return true;
  };

  const logout = () => {
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

  const addReward = (amount, description, category = 'Earn') => {
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
    return newTx;
  };

  const spendBmc = (amount, description, category = 'Spend') => {
    if (!user || (user.bmcBalance || 0) < amount) return false;
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
    return true;
  };

  const transferBmc = (amount, destinationAddress) => {
    if (!user || (user.bmcBalance || 0) < amount) return false;
    const shortAddr = destinationAddress.length > 10 ? `${destinationAddress.substring(0,6)}...${destinationAddress.substring(destinationAddress.length-4)}` : destinationAddress;
    const newTx = {
      id: 'tx_trf_' + Math.random().toString(36).substr(2, 9),
      type: 'Transfer',
      amount: `-${amount}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai',
      description: `Transfer BMC ke ${shortAddr}`
    };
    const updatedUser = { 
      ...user, 
      bmcBalance: user.bmcBalance - amount,
      transactions: [newTx, ...(user.transactions || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
    return true;
  };

  const stakeBmc = (amount, role = 'Validator') => {
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
    return true;
  };

  const addPendingValidation = (data) => {
    const newItem = {
      ...data,
      id: 'val_' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      date: new Date().toISOString()
    };
    const updatedValidations = [newItem, ...pendingValidations];
    setPendingValidations(updatedValidations);
    localStorage.setItem('yayasan_validations', JSON.stringify(updatedValidations));
    return newItem;
  };

  const approveValidation = (validationId, submitterReward = 0, plantingId = null) => {
    addReward(0.05, 'Komisi Validator', 'Earn');
    
    if (submitterReward > 0) {
      addReward(submitterReward, 'Reward Input Data Tracker', 'Earn');
    }

    if (plantingId) {
      const stored = localStorage.getItem('bambupedia_plantings');
      if (stored) {
        let plantings = JSON.parse(stored);
        plantings = plantings.map(p => p.id === plantingId ? { ...p, isVerified: true } : p);
        localStorage.setItem('bambupedia_plantings', JSON.stringify(plantings));
      }
    }

    const updatedValidations = pendingValidations.filter(v => v.id !== validationId);
    setPendingValidations(updatedValidations);
    localStorage.setItem('yayasan_validations', JSON.stringify(updatedValidations));
  };

  // --- PARTNER & LOCATION MANAGEMENT ---
  const submitPartnerApp = (data) => {
    const newApp = {
      ...data,
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    const updatedApps = [newApp, ...partnerApps];
    setPartnerApps(updatedApps);
    localStorage.setItem('yayasan_partner_apps', JSON.stringify(updatedApps));
    
    // Update local user status if logged in
    if (user) {
      const updatedUser = { ...user, farmerStatus: 'pending' };
      setUser(updatedUser);
      localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
      const db = getMockDB().map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('yayasan_all_users', JSON.stringify(db));
    }
    return newApp;
  };

  const approvePartnerApp = (appId) => {
    const updatedApps = partnerApps.map(app => {
      if (app.id === appId) {
        // Find the user and update their status in "Global Mock DB"
        const db = getMockDB();
        const updatedDb = db.map(u => {
          if (u.id === app.userId) {
            return { ...u, farmerStatus: 'verified' };
          }
          return u;
        });
        localStorage.setItem('yayasan_all_users', JSON.stringify(updatedDb));
        
        // If the approved user is the CURRENT logged in user, update their state
        if (user && user.id === app.userId) {
          const updatedUser = { ...user, farmerStatus: 'verified' };
          setUser(updatedUser);
          localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
        }

        return { ...app, status: 'verified' };
      }
      return app;
    });
    setPartnerApps(updatedApps);
    localStorage.setItem('yayasan_partner_apps', JSON.stringify(updatedApps));
  };

  const rejectPartnerApp = (appId) => {
    const updatedApps = partnerApps.map(app => app.id === appId ? { ...app, status: 'rejected' } : app);
    setPartnerApps(updatedApps);
    localStorage.setItem('yayasan_partner_apps', JSON.stringify(updatedApps));
  };

  const submitLocationProposal = (data) => {
    const newLoc = {
      ...data,
      id: 'loc_' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    const updatedLocs = [newLoc, ...locationProposals];
    setLocationProposals(updatedLocs);
    localStorage.setItem('yayasan_location_proposals', JSON.stringify(updatedLocs));
    return newLoc;
  };

  const approveLocation = (locId) => {
    const updatedLocs = locationProposals.map(loc => loc.id === locId ? { ...loc, status: 'verified' } : loc);
    setLocationProposals(updatedLocs);
    localStorage.setItem('yayasan_location_proposals', JSON.stringify(updatedLocs));
  };

  const processCheckin = () => {
    if (!user) return null;
    const currentUTC = new Date().toISOString().split('T')[0];
    const prevStreak = user.checkinStreak || 0;
    const nextStreak = prevStreak === 7 ? 1 : prevStreak + 1;
    const rewardAmounts = { 1: 0.001, 2: 0.002, 3: 0.003, 4: 0.004, 5: 0.005, 6: 0.006, 7: 0.010 };
    const amount = rewardAmounts[nextStreak];

    const updatedUser = { 
      ...user, 
      lastCheckinDate: currentUTC,
      checkinStreak: nextStreak,
      bmcBalance: (user.bmcBalance || 0) + amount,
      transactions: [{
        id: 'tx_chk_' + Math.random().toString(36).substr(2, 9),
        type: 'Earn',
        amount: `+${amount}`,
        date: currentUTC,
        status: 'Selesai',
        description: `Daily Check-in Reward (Day ${nextStreak})`
      }, ...(user.transactions || [])]
    };
    
    setUser(updatedUser);
    localStorage.setItem('yayasan_user', JSON.stringify(updatedUser));
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
      updateKyc,
      updateSecurity,
      updateProfile,
      getMockDB,
      addPendingValidation,
      approveValidation,
      submitPartnerApp,
      approvePartnerApp,
      rejectPartnerApp,
      submitLocationProposal,
      approveLocation,
      processCheckin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
