import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDd3ygYuSCwXvuJ0-XoFRqtwJun-K08DA",
  authDomain: "water-supply-app-f9716.firebaseapp.com",
  projectId: "water-supply-app-f9716",
  storageBucket: "water-supply-app-f9716.firebasestorage.app",
  messagingSenderId: "946817176983",
  appId: "1:946817176983:web:342c654364fc4755eda0d2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
