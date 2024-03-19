import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyD8tqwG3ehkzU-yBNHUF06S9_SRUihDwZo",
  authDomain: "filmyverse-7bd37.firebaseapp.com",
  projectId: "filmyverse-7bd37",
  storageBucket: "filmyverse-7bd37.appspot.com",
  messagingSenderId: "763346809984",
  appId: "1:763346809984:web:3e36332fd5901ae98da265"
};

const app = initializeApp(firebaseConfig);
export const  db = getFirestore(app);
export const moviesref = collection(db, "movies");
export const reviewsref = collection(db, "reviews");
export const usersref = collection(db, "users");

export default app;