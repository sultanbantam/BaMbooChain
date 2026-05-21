import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIQMO46OwZ-TzdK0QJx2Az3DMowIVYYcQ",
  authDomain: "bamboochain-official.firebaseapp.com",
  projectId: "bamboochain-official",
  storageBucket: "bamboochain-official.firebasestorage.app",
  messagingSenderId: "969704302314",
  appId: "1:969704302314:web:78083a2d6718c8aa23d993"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export default app;
