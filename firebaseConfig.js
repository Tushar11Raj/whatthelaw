// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAAQ2eHF_zShGuD2Ou0Y4lQeMn7L-QuLI",
  authDomain: "whatthelaw-f33d4.firebaseapp.com",
  projectId: "whatthelaw-f33d4",
  storageBucket: "whatthelaw-f33d4.appspot.com",
  messagingSenderId: "116764314449",
  appId: "1:116764314449:web:13c609d0824e8ef3686170",
  measurementId: "G-6JV7V0GPS4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
// const analytics = getAnalytics(app);
