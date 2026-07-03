import { messaging, db } from '../firebase/config';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

export const requestForToken = async (userId) => {
  try {
    // Explicitly register the service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    const currentToken = await getToken(messaging, { 
      vapidKey: 'BObppk1UYb40PiAnYk92Fm8I7Lw49F-n0EcvhFeo2hptMSsUQGaASwSZqzuN1ZVxdD9deKOG6OUvXF_uCJXF1Fg',
      serviceWorkerRegistration: registration
    });
    
    if (currentToken) {
      console.log('✅ FCM Token received:', currentToken);
      // Save to Firestore
      if (userId) {
        await updateDoc(doc(db, "users", userId), {
          fcmToken: currentToken
        });
      }
      return currentToken;
    } else {
      console.warn('⚠️ No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('❌ An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground message received:', payload);
      resolve(payload);
    });
  });
