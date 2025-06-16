import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx-aVert6T-0rvmzk4nOV-6s2OQcg2SB4",
  authDomain: "fireblog-2543f.firebaseapp.com",
  projectId: "fireblog-2543f",
  storageBucket: "fireblog-2543f.firebasestorage.app",
  messagingSenderId: "631437500290",
  appId: "1:631437500290:web:a8b1832ebbf114ce52f99b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Export Firebase functions
