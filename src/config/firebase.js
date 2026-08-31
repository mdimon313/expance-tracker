// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTWeup72YooKM85MjyiLrtXriFu3ZZnfI",
  authDomain: "expense-tracker-f42b5.firebaseapp.com",
  projectId: "expense-tracker-f42b5",
  storageBucket: "expense-tracker-f42b5.firebasestorage.app",
  messagingSenderId: "45904697162",
  appId: "1:45904697162:web:798ff6988f76e1910513b3",
  measurementId: "G-8PRZDHWEN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
