import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyA3wYIssCq1i78p9NN7xedAn9w-h0Qgz0E",
  authDomain: "authentication-afcf8.firebaseapp.com",
  projectId: "authentication-afcf8",
  storageBucket: "authentication-afcf8.firebasestorage.app",
  messagingSenderId: "601857162083",
  appId: "1:601857162083:web:7fec8c400a37a0f6baf156"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);