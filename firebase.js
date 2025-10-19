// Import Firebase SDK modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsJvMniPmiKD5CR1arD2P-KIYicg9w5lBo",
  authDomain: "alex-home-f0430.firebaseapp.com",
  projectId: "alex-home-f0430",
  storageBucket: "alex-home-f0430.firebasestorage.app",
  messagingSenderId: "528440841721",
  appId: "1:528440841721:web:21ceddd56021d2dbfad928"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

