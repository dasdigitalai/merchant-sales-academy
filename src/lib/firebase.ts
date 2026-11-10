import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config. These values are public by design (they ship to every
// browser); access is controlled by Firestore security rules in firestore.rules.
// Each branded deployment has its own Firebase project, set through the
// NEXT_PUBLIC_FIREBASE_* variables; without them it uses Merchant Sales Academy's.
const env = (v: string | undefined, fallback: string) => (v && v.trim()) || fallback;
const firebaseConfig = {
  apiKey: env(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyBlVRSQcCZtIat2IqEBMKuKQigR_6rTPs8"),
  authDomain: env(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "merchant-sales-academy.firebaseapp.com"),
  projectId: env(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "merchant-sales-academy"),
  storageBucket: env(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "merchant-sales-academy.firebasestorage.app"),
  messagingSenderId: env(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "556019279914"),
  appId: env(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:556019279914:web:75190dceea77d6dc233b53"),
};

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
