// firebaseConfig.js

import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  '@firebase/auth',
]);

const firebaseConfig = {
  apiKey: "AIzaSyDdO1Mmyy-1zill6kgCNvOh4EGXHiWJwl0",
  authDomain: "cleancycle-adf7d.firebaseapp.com",
  projectId: "cleancycle-adf7d",
  storageBucket: "cleancycle-adf7d.appspot.com",
  messagingSenderId: "692616237960",
  appId: "1:692616237960:android:3e6e8f08e452d5152a203d"
};

console.log('Firebase config initialized');
// Initialize Firebase
const firebaseConfigApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseConfigApp);
export const storageConfig = getStorage(firebaseConfigApp);
export default firebaseConfigApp;
