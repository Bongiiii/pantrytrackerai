// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Corrected import statement

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtQtJax5d3WzOnJa4JHkVsum7qa0u9aYw",
  authDomain: "pantrytracker-bongi.firebaseapp.com",
  projectId: "pantrytracker-bongi",
  storageBucket: "pantrytracker-bongi.appspot.com",
  messagingSenderId: "109391939509",
  appId: "1:109391939509:web:e5da4b7681e64c3f70bbfc",
  measurementId: "G-4KVDDQ59Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Initialize Firestore correctly

export { app, firestore, firebaseConfig }; // Export firestore
