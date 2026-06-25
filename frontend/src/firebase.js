import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIW-SzdQ_AS_w-9JWpZvXRN5Oka-pSHq4",
  authDomain: "budgetflow-ke.firebaseapp.com",
  projectId: "budgetflow-ke",
  storageBucket: "budgetflow-ke.firebasestorage.app",
  messagingSenderId: "929563188635",
  appId: "1:929563188635:web:38cb75492099b376d0153e",
  measurementId: "G-XJRXJL7MF0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();