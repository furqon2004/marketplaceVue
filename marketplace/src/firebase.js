import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApCHz4UH9kVaC0f0e48N09Qa5Pjr8Uo0c",
  authDomain: "marketplace-4bf33.firebaseapp.com",
  databaseURL: "https://marketplace-4bf33-default-rtdb.firebaseio.com",
  projectId: "marketplace-4bf33",
  storageBucket: "marketplace-4bf33.firebasestorage.app",
  messagingSenderId: "883749743258",
  appId: "1:883749743258:web:09197b00c6baf9c0708d23",
  measurementId: "G-REDLT3VHVB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
