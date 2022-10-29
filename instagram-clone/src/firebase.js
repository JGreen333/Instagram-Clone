import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZrhcvU2CzWOxTFtHTC_VE_oUJkVwp8bY",
  authDomain: "instagram-clone-36735.firebaseapp.com",
  projectId: "instagram-clone-36735",
  storageBucket: "instagram-clone-36735.appspot.com",
  messagingSenderId: "223801998078",
  appId: "1:223801998078:web:c233d45f43081373e503af",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
