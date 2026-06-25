import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

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

// 2b. Hook for Verified Location Proposals (Publicly visible to all users for Plantation)
export function useVerifiedLocations() {
  return useQuery({
    queryKey: ['verifiedLocationProposals'],
    queryFn: async () => {
      const locationPropsRef = collection(db, 'location_proposals');
      const q = query(locationPropsRef, where('status', '==', 'Verified & Active'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
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

// 5. Hook for Plantation Donations
export function usePlantationDonations(userId, username) {
  return useQuery({
    queryKey: ['plantationDonations', userId, username],
    queryFn: async () => {
      const plantationsRef = collection(db, 'plantations');
      let q = plantationsRef;
      
      // If a userId is provided and it's not the admin, filter by userId.
      // If no userId is provided (e.g., public impact page), fetch all (or aggregate in future).
      if (userId && username !== 'admin_yayasan') {
        q = query(plantationsRef, where('userId', '==', userId));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 6. Hook for Global Environmental Settings
export function useGlobalSettings() {
  return useQuery({
    queryKey: ['globalSettings'],
    queryFn: async () => {
      const docRef = doc(db, 'settings', 'environmental_metrics');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Default fallbacks if document does not exist yet
        return {
          biomassPerClump: 0.8,
          co2PerClump: 0.5,
          waterPerClump: 100,
          landPerClump: 0.01,
          carbonSpotPrice: 54.27,
          oxygenPerClump: 1.2
        };
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 7. Hook for Event Registrations
export function useEventRegistrations() {
  return useQuery({
    queryKey: ['eventRegistrations'],
    queryFn: async () => {
      const registrationsRef = collection(db, 'event_registrations');
      const snapshot = await getDocs(registrationsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 8. Hook for Event Attendance
export function useEventAttendance() {
  return useQuery({
    queryKey: ['eventAttendance'],
    queryFn: async () => {
      const attendanceRef = collection(db, 'event_attendance');
      const snapshot = await getDocs(attendanceRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 9. Hook for Event Transactions
export function useEventTransactions() {
  return useQuery({
    queryKey: ['eventTransactions'],
    queryFn: async () => {
      const txRef = collection(db, 'event_transactions');
      const snapshot = await getDocs(txRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 10. Hook for Speaker Materials
export function useSpeakerMaterials(eventId) {
  return useQuery({
    queryKey: ['speakerMaterials', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const materialsRef = collection(db, 'speaker_materials');
      const q = query(materialsRef, where('eventId', '==', eventId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  });
}

// Helper to upload speaker material
export async function uploadSpeakerMaterial(file, eventId, speakerName, type) {
  if (!file) throw new Error("No file provided");
  
  // Create a unique filename
  const fileExt = file.name.split('.').pop();
  const safeSpeakerName = speakerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const uniqueName = `${eventId}_${safeSpeakerName}_${type}_${Date.now()}.${fileExt}`;
  
  // Upload to Storage
  const storageRef = ref(storage, `events/materials/${uniqueName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  // Save record to Firestore
  const materialsRef = collection(db, 'speaker_materials');
  const docRef = await addDoc(materialsRef, {
    eventId,
    speakerName,
    type, // 'cv' or 'material'
    fileName: file.name,
    fileUrl: downloadUrl,
    timestamp: serverTimestamp()
  });
  
  return { id: docRef.id, url: downloadUrl };
}
