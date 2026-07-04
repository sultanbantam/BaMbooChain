import admin from 'firebase-admin';

export function getFirebaseAdmin() {
  if (admin.apps && admin.apps.length > 0) {
    return admin.app();
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      return admin.app();
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        })
      });
      return admin.app();
    } else {
      console.warn("Firebase Admin credentials not found in environment variables.");
      return null;
    }
  } catch (error) {
    console.warn("Firebase Admin failed to initialize:", error.message);
    return { error: error.message };
  }
}
