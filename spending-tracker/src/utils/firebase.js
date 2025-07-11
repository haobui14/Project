// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to get month doc ref
export function getMonthDocRef(userId, year, month) {
  return doc(
    db,
    'users',
    userId,
    'months',
    `${year}-${String(month).padStart(2, '0')}`
  );
}

// Fetch monthly spending data
export async function fetchMonthlySpending(userId, year, month) {
  const ref = getMonthDocRef(userId, year, month);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// Add or update monthly spending data
export async function setMonthlySpending(userId, year, month, data) {
  const ref = getMonthDocRef(userId, year, month);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: Timestamp.now(),
      createdAt: data?.createdAt || Timestamp.now(),
    },
    { merge: true }
  );
}

// Update only specific fields
export async function updateMonthlySpending(userId, year, month, fields) {
  const ref = getMonthDocRef(userId, year, month);
  await updateDoc(ref, {
    ...fields,
    updatedAt: Timestamp.now(),
  });
}
