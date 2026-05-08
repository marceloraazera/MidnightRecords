// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKWUKhsV-crkXZAnWdVXnko2o7jRJKj3g",
  authDomain: "midnightrecords-83d4b.firebaseapp.com",
  projectId: "midnightrecords-83d4b",
  storageBucket: "midnightrecords-83d4b.firebasestorage.app",
  messagingSenderId: "551663771505",
  appId: "1:551663771505:web:10cee3728e505d17c860d0",
  measurementId: "G-6TGS8B3FG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);