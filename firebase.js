// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL4yg_1lzdJvuhEkJHkv9xqHsG3ZhlcLo",
  authDomain: "goldenhair-17d30.firebaseapp.com",
  projectId: "goldenhair-17d30",
  storageBucket: "goldenhair-17d30.firebasestorage.app",
  messagingSenderId: "164727124498",
  appId: "1:164727124498:web:82aa0f1926e8cfb3911ecb"
};

// Initialize firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };