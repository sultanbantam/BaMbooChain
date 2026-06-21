import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getFirebaseAdmin } from '../utils/firebaseAdmin.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, uid, redirectUris } = req.body || {};

    if (!name || !uid) {
      return res.status(400).json({ success: false, message: 'Missing name or uid' });
    }

    // Default to empty array if not provided
    const validRedirectUris = Array.isArray(redirectUris) ? redirectUris : [];

    const app = getFirebaseAdmin();
    if (!app) {
      // Return a simulated success response if admin SDK is not configured yet for testing
      // This allows the frontend to still work before backend is fully provisioned
      console.warn("Firebase Admin not configured. Returning mock credentials.");
      const mockClientId = `client_${crypto.randomBytes(8).toString('hex')}`;
      const mockClientSecret = `secret_${crypto.randomBytes(16).toString('hex')}`;
      
      return res.status(200).json({
        success: true,
        message: 'Firebase Admin not configured yet. Returning MOCK credentials. Please configure FIREBASE_SERVICE_ACCOUNT in your environment.',
        app: {
          id: Date.now().toString(),
          name,
          owner_uid: uid,
          clientId: mockClientId,
          clientSecret: mockClientSecret, // Only returned once
          redirectUris: validRedirectUris,
          createdAt: new Date().toISOString()
        }
      });
    }

    const db = app.firestore();
    
    // Generate secure keys
    const clientId = `client_${crypto.randomBytes(8).toString('hex')}`;
    const clientSecret = `secret_${crypto.randomBytes(16).toString('hex')}`;
    
    // Hash the secret
    const salt = await bcrypt.genSalt(10);
    const clientSecretHash = await bcrypt.hash(clientSecret, salt);

    const newAppDoc = {
      name,
      owner_uid: uid,
      client_id: clientId,
      client_secret_hash: clientSecretHash,
      redirect_uris: validRedirectUris,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    // Save to Firestore
    const docRef = await db.collection('oauth_clients').add(newAppDoc);

    // Return the plain secret ONLY once
    return res.status(200).json({
      success: true,
      app: {
        id: docRef.id,
        name,
        owner_uid: uid,
        clientId,
        clientSecret, // PLAIN TEXT - only shown once!
        redirectUris: validRedirectUris,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Register OAuth Client Error:", error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
}
