// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj5ZqRavY2DL_muVb2W-Xlp2ULr2AfXuY",
  authDomain: "household-typescript-iino.firebaseapp.com",
  projectId: "household-typescript-iino",
  storageBucket: "household-typescript-iino.appspot.com",
  messagingSenderId: "217396402440",
  appId: "1:217396402440:web:996b6a9c817d1b1d2574bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }