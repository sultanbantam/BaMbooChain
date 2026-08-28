import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// 1. Hook for Partner Applications (User specific or Admin)
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

// 1b. Hook for All Verified Partners (Public Directory)
export function useVerifiedPartners() {
  return useQuery({
    queryKey: ['verifiedPartners'],
    queryFn: async () => {
      const partnerAppsRef = collection(db, 'partner_applications');
      const q = query(partnerAppsRef, where('status', '==', 'verified'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
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
  
  const cloudName = "dsieguutz";
  const uploadPreset = "bamboochain_upload";
  
  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary belum diatur.");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // Gunakan 'auto' agar Cloudinary otomatis mengenali PDF sebagai dokumen/gambar yang diizinkan untuk unsigned upload
  const resourceType = 'auto';
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || 'Gagal mengunggah ke Cloudinary');
  }
  
  const data = await response.json();
  const downloadUrl = data.secure_url;
  
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
  
  if (type === 'material') {
    const cleanText = (text = '') => String(text).replace(/<\/?[^>]+(>|$)/g, '').trim();
    const knowledgeRef = collection(db, 'knowledge_items');
    await addDoc(knowledgeRef, {
      title: `Materi Narasumber: ${speakerName}`,
      summary: `Materi presentasi yang dibawakan oleh ${speakerName} pada sesi acara.`,
      extractedText: `Materi presentasi yang dibawakan oleh ${speakerName}. File Name: ${file.name}`,
      tags: `Event, Narasumber, ${speakerName}`,
      type: 'Materi Narasumber',
      status: 'approved',
      sourceTrust: 'verified',
      fileUrl: downloadUrl,
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      createdBy: 'system',
      createdByName: speakerName,
      searchText: cleanText(`Materi presentasi ${speakerName} acara ${file.name}`).toLowerCase(),
      createdAt: serverTimestamp()
    });
  }
  
  return { id: docRef.id, url: downloadUrl };
}

// 11. Hook for Community Events
export function useCommunityEvents(userId, isAdmin) {
  return useQuery({
    queryKey: ['communityEvents', userId, isAdmin],
    queryFn: async () => {
      if (!userId) return [];
      const eventsRef = collection(db, 'community_events');
      let q = eventsRef;
      if (!isAdmin) {
        q = query(eventsRef, where('organizerId', '==', userId));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// 12. Hook for Public Approved Community Events
export function useApprovedCommunityEvents() {
  return useQuery({
    queryKey: ['approvedCommunityEvents'],
    queryFn: async () => {
      const eventsRef = collection(db, 'community_events');
      const q = query(eventsRef, where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 13. Create Community Event
export async function createCommunityEvent(eventData) {
  const eventsRef = collection(db, 'community_events');
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    status: 'pending',
    timestamp: serverTimestamp()
  });
  
  const cleanText = (text = '') => String(text).replace(/<\/?[^>]+(>|$)/g, '').trim();
  const knowledgeRef = collection(db, 'knowledge_items');
  await addDoc(knowledgeRef, {
    title: `Acara Komunitas: ${eventData.title}`,
    summary: cleanText(eventData.description),
    extractedText: cleanText(`Acara: ${eventData.title}. Lokasi: ${eventData.location}. Kategori: ${eventData.category}. ${eventData.description}`),
    tags: `Event, ${eventData.category}, ${eventData.location}`,
    type: 'Event',
    status: 'approved',
    sourceTrust: 'verified',
    fileUrl: eventData.image || '',
    fileName: '',
    createdBy: 'system_event',
    createdByName: 'Panitia Acara',
    searchText: cleanText(`${eventData.title} ${eventData.description} ${eventData.location} ${eventData.category}`).toLowerCase(),
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
}

// 14. Update Community Event Status (Approve/Reject)
export async function updateCommunityEventStatus(eventId, newStatus) {
  const eventRef = doc(db, 'community_events', eventId);
  await updateDoc(eventRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
}

// 15. Hook for User Events (Roles: Penggagas, Peserta, Narasumber, Pendukung, Panitia)
export function useUserEvents(userId, userName) {
  return useQuery({
    queryKey: ['userEvents', userId, userName],
    queryFn: async () => {
      if (!userId) return [];
      
      const userEventsList = [];
      const eventMap = new Map(); // to prevent duplicates if user has multiple roles in the same event

      const addEvent = (event, role) => {
        if (!eventMap.has(event.id)) {
          eventMap.set(event.id, { ...event, userRoles: [role] });
        } else {
          const existing = eventMap.get(event.id);
          if (!existing.userRoles.includes(role)) {
            existing.userRoles.push(role);
          }
        }
      };

      try {
        // 1. Fetch Registrations (Peserta)
        const regRef = collection(db, 'event_registrations');
        const qReg = query(regRef, where('userId', '==', userId));
        const regSnap = await getDocs(qReg);
        
        regSnap.forEach(docSnap => {
          const data = docSnap.data();
          addEvent({
            id: data.eventId || docSnap.id,
            title: data.eventTitle || 'Event Terdaftar',
            timestamp: data.timestamp,
            status: data.status
          }, 'Peserta');
        });

        // 2. Fetch Community Events (Penggagas, Panitia, Narasumber, Pendukung)
        const commRef = collection(db, 'community_events');
        // Fetch all community events, or we could just fetch by organizerId first. 
        // For broad roles (arrays), we fetch all and filter in memory to avoid complex queries limitations.
        const commSnap = await getDocs(commRef);
        
        commSnap.forEach(docSnap => {
          const data = docSnap.data();
          const evData = { id: docSnap.id, ...data };
          
          // Penggagas
          if (data.organizerId === userId) {
            addEvent(evData, 'Penggagas');
          }
          // Panitia
          if (data.committeeIds && Array.isArray(data.committeeIds) && data.committeeIds.includes(userId)) {
            addEvent(evData, 'Panitia');
          }
          // Pendukung
          if (data.supporterIds && Array.isArray(data.supporterIds) && data.supporterIds.includes(userId)) {
            addEvent(evData, 'Pendukung');
          }
          // Narasumber (by ID or Name)
          if (data.speakerIds && Array.isArray(data.speakerIds) && data.speakerIds.includes(userId)) {
            addEvent(evData, 'Narasumber');
          } else if (data.speakers && Array.isArray(data.speakers) && userName) {
             const isSpeakerByName = data.speakers.some(s => s.name?.toLowerCase() === userName.toLowerCase() || userName.toLowerCase().includes(s.name?.toLowerCase()));
             if (isSpeakerByName) {
               addEvent(evData, 'Narasumber');
             }
          }
        });

        // 3. (Optional) Check Hardcoded Events from eventsData.js if needed
        // Since hooks are pure async fetchers, we can leave hardcoded checks to the component or import eventsData here if needed.
        
      } catch (err) {
        console.error("Error fetching user events:", err);
      }

      // Hardcode rule for Mukoddas Syuhada
      if (userName && userName.toLowerCase() === 'mukoddas syuhada') {
        eventMap.forEach((ev) => {
          if (!ev.userRoles.includes('Penggagas')) ev.userRoles.push('Penggagas');
          if (!ev.userRoles.includes('Narasumber')) ev.userRoles.push('Narasumber');
        });
      }

      return Array.from(eventMap.values());
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// 16. Hook for Career Job Posts
export function useCareerJobPosts(statusFilter = null) {
  return useQuery({
    queryKey: ['careerJobPosts', statusFilter],
    queryFn: async () => {
      const postsRef = collection(db, 'career_job_posts');
      let q = postsRef;
      if (statusFilter) {
        q = query(postsRef, where('status', '==', statusFilter));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 17. Hook for Career Demand Posts
export function useCareerDemandPosts(statusFilter = null) {
  return useQuery({
    queryKey: ['careerDemandPosts', statusFilter],
    queryFn: async () => {
      const postsRef = collection(db, 'career_demand_posts');
      let q = postsRef;
      if (statusFilter) {
        q = query(postsRef, where('status', '==', statusFilter));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 18. Hook for Data Tools
export function useDataTools() {
  return useQuery({
    queryKey: ['dataTools'],
    queryFn: async () => {
      const toolsRef = collection(db, 'data_tools');
      const snapshot = await getDocs(toolsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
