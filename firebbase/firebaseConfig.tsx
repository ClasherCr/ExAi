import { initializeApp } from 'firebase/app';
import { initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { getDatabase, ref, set, off ,get } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBo1qadSDNqqCgxqI1-rpsR9w_eB2kckWg",
    authDomain: "exai-96c0c.firebaseapp.com",
    databaseURL: "https://exai-96c0c-default-rtdb.firebaseio.com",
    projectId: "exai-96c0c",
    storageBucket: "exai-96c0c.appspot.com",
    messagingSenderId: "569401566923",
    appId: "1:569401566923:web:9755fd5117baf2b78e9d4e"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app);

// Initialize Realtime Database
const db = getDatabase(app);

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, off, onAuthStateChanged , get, sendPasswordResetEmail, sendEmailVerification};
