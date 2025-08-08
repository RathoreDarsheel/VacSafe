// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'vacsafe-o8z1d',
  appId: '1:949614573730:web:e8e4aac9f4fddbbd69bffb',
  storageBucket: 'vacsafe-o8z1d.firebasestorage.app',
  apiKey: 'AIzaSyBOAIl0CeHETO4SH4CSW9Kz2wosnY6Lc94',
  authDomain: 'vacsafe-o8z1d.firebaseapp.com',
  messagingSenderId: '949614573730',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
