import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxGc2fnyBJ6Xs0sokB5TgxtTQrEpbDvk4",
  authDomain: "nishi-barta.firebaseapp.com",
  projectId: "nishi-barta",
  storageBucket: "nishi-barta.firebasestorage.app",
  messagingSenderId: "746159150978",
  appId: "1:746159150978:web:49cb3c3bfe7b726f12a19b",
  measurementId: "G-796TE8CGL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export default auth;
