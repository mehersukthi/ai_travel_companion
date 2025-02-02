// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDANxxQUn1JEIOfrWvI6cJmaQAvM0ycIBQ",
  authDomain: "ai-travel-companion-cd698.firebaseapp.com",
  projectId: "ai-travel-companion-cd698",
  storageBucket: "ai-travel-companion-cd698.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "482865634581",
  appId: "1:482865634581:web:6d9bfb7c4abac0ad575d1c",
  measurementId: "G-21FG0DMT3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };