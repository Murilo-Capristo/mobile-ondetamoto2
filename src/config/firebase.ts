// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDB6Juv9Y0KbFVcTb_pJJj59_AEcvA281k',
  authDomain: 'ondetamoto.firebaseapp.com',
  projectId: 'ondetamoto',
  storageBucket: 'ondetamoto.firebasestorage.app',
  messagingSenderId: '483992165107',
  appId: '1:483992165107:web:4dd3c3b0435f956b2f7586',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
