import { getFirebaseAdmin } from './api/utils/firebaseAdmin.js';
import bcrypt from 'bcryptjs';

async function run() {
  try {
    const app = getFirebaseAdmin();
    if (!app) {
      console.log("No Firebase Admin app available.");
      process.exit(1);
    }

    const db = app.firestore();
    const clientId = "client_4e0f61e19c1855c5";
    const clientSecret = "secret_087eaa28a0feef4be7fa236b38d383cb";
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);

    const clientDoc = {
      client_id: clientId,
      client_secret_hash: clientSecretHash,
      name: "Whale of Savu",
      redirect_uris: [
        "http://localhost:3000/api/auth/callback/bamboochain",
        "https://whaleofsavu.vercel.app/api/auth/callback/bamboochain",
        "https://whaleofsavu.org/api/auth/callback/bamboochain"
      ],
      created_at: new Date().toISOString()
    };

    // Check if exists
    const snap = await db.collection('oauth_clients').where('client_id', '==', clientId).get();
    if (snap.empty) {
      await db.collection('oauth_clients').add(clientDoc);
      console.log("Client created successfully.");
    } else {
      console.log("Client already exists.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
