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
  apiKey: 'AIzaSyCo2OQV4lj26EtzNVlDt10jix4kHHh63aE',
  authDomain: 'spending-tracker-d8609.firebaseapp.com',
  projectId: 'spending-tracker-d8609',
  storageBucket: 'spending-tracker-d8609.firebasestorage.app',
  messagingSenderId: '283032348162',
  appId: '1:283032348162:web:0ab0f54ced7584f68ce91b',
  measurementId: 'G-5QBXH1XF3G',
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
