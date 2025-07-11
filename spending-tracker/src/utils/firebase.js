// src/firebase.js

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- Firebase config using Vite env variables ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Helper: get month doc ref ---
export function getMonthDocRef(userId, year, month) {
  return doc(
    db,
    'users',
    userId,
    'months',
    `${year}-${String(month).padStart(2, '0')}`
  );
}

// --- Fetch monthly spending data ---
export async function fetchMonthlySpending(userId, year, month) {
  const ref = getMonthDocRef(userId, year, month);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// --- Add or update monthly spending data ---
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

// --- Update only specific fields in monthly spending doc ---
export async function updateMonthlySpending(userId, year, month, fields) {
  const ref = getMonthDocRef(userId, year, month);
  await updateDoc(ref, {
    ...fields,
    updatedAt: Timestamp.now(),
  });
}

// --- Create a shared dashboard link ---
export async function createSharedLink(userId, year, month, data) {
  const shareData = {
    userId,
    year,
    month,
    data,
    createdAt: Timestamp.now(),
    // Expires in 30 days
    expiresAt: Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ),
  };
  const docRef = await addDoc(collection(db, 'sharedDashboards'), shareData);
  return docRef.id;
}

// --- Fetch shared dashboard data ---
export async function fetchSharedDashboard(shareId) {
  const ref = doc(db, 'sharedDashboards', shareId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  // Check if link has expired
  if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
    // Optionally, delete the expired doc:
    // await deleteDoc(ref);
    return null;
  }
  return data;
}

// --- Get all shared links for a user ---
export async function getUserSharedLinks(userId) {
  const q = query(
    collection(db, 'sharedDashboards'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// --- Delete a shared link (hard delete) ---
export async function deleteSharedLink(shareId) {
  const ref = doc(db, 'sharedDashboards', shareId);
  await deleteDoc(ref);
  // If you prefer soft-delete, use:
  // await updateDoc(ref, { deleted: true });
}
