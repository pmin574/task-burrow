import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCRUiRJABvqwt4isUAIZDM2iMGwsO4_8Gc",
    authDomain: "taskburrow-v0-99323.firebaseapp.com",
    projectId: "taskburrow-v0-99323",
    storageBucket: "taskburrow-v0-99323.firebasestorage.app",
    messagingSenderId: "151180997150",
    appId: "1:151180997150:web:f56c248e92c93c23c8740f",
    measurementId: "G-QTZ8SG8CP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Authentication functions
const loginWithGoogle = () => signInWithPopup(auth, provider);
const logout = () => signOut(auth);

export { auth, db, loginWithGoogle, logout };
