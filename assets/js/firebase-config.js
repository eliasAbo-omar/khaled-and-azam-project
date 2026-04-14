// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5uAMh4lplTs35V-Y5eJt6NmCRULksRKc",
  authDomain: "my-reader-b0542.firebaseapp.com",
  databaseURL:
    "https://my-reader-b0542-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-reader-b0542",
  storageBucket: "my-reader-b0542.firebasestorage.app",
  messagingSenderId: "4814921617",
  appId: "1:4814921617:web:c78fe99f45e0700fdd8430",
  measurementId: "G-QRXHPZYTNF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
