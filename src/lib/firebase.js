import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOAczxsY0pTurgOj0q1dYd1aVhjZIHIUs",
  authDomain: "sd-little-champs.firebaseapp.com",
  projectId: "sd-little-champs",
  storageBucket: "sd-little-champs.firebasestorage.app",
  messagingSenderId: "767081158030",
  appId: "1:767081158030:web:43c94810e77ebd0dedc0df",
  measurementId: "G-LP06SRGHSQ"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// For secondary auth operations (like owner creating teacher accounts without logging out)
export const secondaryApp = !getApps().some(a => a.name === 'Secondary')
  ? initializeApp(firebaseConfig, 'Secondary')
  : getApp('Secondary');

export const secondaryAuth = getAuth(secondaryApp);
