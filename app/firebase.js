import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {

  apiKey: "AIzaSyB7qCvjGX_-hnL3a6Kbb6WrxOg-a_FQU0I",
  authDomain: "better-a7642.firebaseapp.com",
  projectId: "better-a7642",
  storageBucket: "better-a7642.firebasestorage.app",
  messagingSenderId: "925213042740",
  appId: "1:925213042740:web:13db87a5b39b2748690261",
  measurementId: "G-4FKY4ZHZG7"
};
   
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
