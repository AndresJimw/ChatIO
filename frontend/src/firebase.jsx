import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5eVaFshaHHfi3i5qgAdv5NVLGXamHf_k",
  authDomain: "chat-adcb1.firebaseapp.com",
  projectId: "chat-adcb1",
  storageBucket: "chat-adcb1.appspot.com",
  messagingSenderId: "97082578981",
  appId: "1:97082578981:web:3653611117f7aded2587cc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
