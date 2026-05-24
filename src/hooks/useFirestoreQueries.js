import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// 1. Hook for Partner Applications
export function usePartnerApplications(userId, username) {
  return useQuery({
    queryKey: ['partnerApplications', userId, username],
    queryFn: async () => {
      if (!userId) return [];
      const partnerAppsRef = collection(db, 'partner_applications');
      const q = username === 'admin_yayasan'
        ? partnerAppsRef
        : query(partnerAppsRef, where('userId', '==', userId));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 2. Hook for Location Proposals
export function useLocationProposals(userId, username) {
  return useQuery({
    queryKey: ['locationProposals', userId, username],
    queryFn: async () => {
      if (!userId) return [];
      const locationPropsRef = collection(db, 'location_proposals');
      const q = username === 'admin_yayasan'
        ? locationPropsRef
        : query(locationPropsRef, where('userId', '==', userId));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 3. Hook for Validations (Admins see all validations, users can filter locally or on-demand)
export function useValidations(userId) {
  return useQuery({
    queryKey: ['validations', userId],
    queryFn: async () => {
      const validationsRef = collection(db, 'validations');
      const snapshot = await getDocs(validationsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 4. Hook for Articles
export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const articlesRef = collection(db, 'articles');
      const snapshot = await getDocs(articlesRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
