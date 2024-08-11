// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd-KtqZxkdPyoe82xkIolid9geoUQGIkQ",
  authDomain: "inventory-management-44672.firebaseapp.com",
  projectId: "inventory-management-44672",
  storageBucket: "inventory-management-44672.appspot.com",
  messagingSenderId: "184761424745",
  appId: "1:184761424745:web:9775a2486511954f823bf8",
  measurementId: "G-HS4212YBM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };