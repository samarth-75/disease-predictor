// firebase.js
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAi-xmMx7iqdDnYcNf-sgTN5vScifc_DbY",
  authDomain: "health-prediction-system-908e8.firebaseapp.com",
  projectId: "health-prediction-system-908e8",
  storageBucket: "health-prediction-system-908e8.appspot.com",
  messagingSenderId: "439712227221",
  appId: "1:439712227221:web:0394ddb0d39055f558e09c",
  measurementId: "G-MPG01M4CGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
