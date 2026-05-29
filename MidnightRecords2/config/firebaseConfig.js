import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKWUKhsV-crkXZAnWdVXnko2o7jRJKj3g",
  authDomain: "midnightrecords-83d4b.firebaseapp.com",
  projectId: "midnightrecords-83d4b",
  storageBucket: "midnightrecords-83d4b.firebasestorage.app",
  messagingSenderId: "551663771505",
  appId: "1:551663771505:web:66dc7ebaf6eee6d6c860d0",
  measurementId: "G-070NV77X4J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };