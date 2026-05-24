import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  authModalInitialTab: 'login', // 'login' or 'signup'
  activeToast: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
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
