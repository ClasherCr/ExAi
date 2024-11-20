import { initializeApp } from 'firebase/app';
import { initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { getDatabase, ref, set, off ,get } from 'firebase/database';

const firebaseConfig = {
    apiKey: "xxxxxx",
    authDomain: "xxxxxxx",
    databaseURL: "xxxxxxx",
    projectId: "xxxxxxx",
    storageBucket: "xxxxxxx",
    messagingSenderId: "xxxxxxx",
    appId: "xxxxxxx"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app);

// Initialize Realtime Database
const db = getDatabase(app);

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, off, onAuthStateChanged , get, sendPasswordResetEmail, sendEmailVerification};
