import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAukFqDdRnDcMt0XJ6YzAB74CUlN4H810",
  authDomain: "the-online-driving-instructor.firebaseapp.com",
  projectId: "the-online-driving-instructor",
  storageBucket: "the-online-driving-instructor.firebasestorage.app",
  messagingSenderId: "758973359641",
  appId: "1:758973359641:web:189d23b189bc2f1d566c88",
  measurementId: "G-SMBZCJPDN9",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getDb(): Firestore {
  if (db) return db;
  const a = getFirebaseApp();
  try {
    db = initializeFirestore(a, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    db = getFirestore(a);
  }
  return db;
}

export {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
};
