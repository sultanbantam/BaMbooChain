import { create } from 'zustand';

// Safely hydrate user from localStorage on initial script execution (0ms delay)
const initialUser = (() => {
  try {
    const saved = localStorage.getItem('yayasan_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  isAuthReady: !!initialUser, // If user is cached locally, ready instantly!
  isAuthModalOpen: false,
  authModalInitialTab: 'login', // 'login' or 'signup'
  activeToast: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  setIsAuthReady: (isAuthReady) => set({ isAuthReady }),
  
  openLoginModal: () => set({ 
    isAuthModalOpen: true, 
    authModalInitialTab: 'login' 
  }),
  
  openSignupModal: () => set({ 
    isAuthModalOpen: true, 
    authModalInitialTab: 'signup' 
  }),
  
  closeModal: () => set({ isAuthModalOpen: false }),
  
  setActiveToast: (toast) => set({ activeToast: toast }),
  
  clearToast: () => set({ activeToast: null }),
}));
