import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// This is a placeholder configuration. 
// You will need to replace these values with your actual Firebase project configuration
// from the Firebase Console (Project Settings > General > Your apps).
const firebaseConfig = {
  apiKey: "AIzaSyD4n-cDBoXXw1jB_q8wNSj58znHAK1Z6QE",
  authDomain: "dr-a-dental-clinic.firebaseapp.com",
  projectId: "dr-a-dental-clinic",
  storageBucket: "dr-a-dental-clinic.firebasestorage.app",
  messagingSenderId: "935417414406",
  appId: "1:935417414406:web:1cb13e394a091ecdc79487",
  measurementId: "G-QBQBDLZ85S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
