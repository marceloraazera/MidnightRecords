import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBKWUKhsV-crkXZAnWdVXnko2o7jRJKj3g",
  authDomain: "midnightrecords-83d4b.firebaseapp.com",
  projectId: "midnightrecords-83d4b",
  storageBucket: "midnightrecords-83d4b.firebasestorage.app",
  messagingSenderId: "551663771505",
  appId: "1:551663771505:web:10cee3728e505d17c860d0",
  measurementId: "G-6TGS8B3FG3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
