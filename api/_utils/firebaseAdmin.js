import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';

export function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      return initializeApp({
        credential: cert(serviceAccount)
      });
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        })
      });
    } else {
      console.warn("Firebase Admin credentials not found in environment variables.");
      return null;
    }
  } catch (error) {
    console.warn("Firebase Admin failed to initialize:", error.message);
    return { error: error.message };
  }
}
