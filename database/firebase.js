import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDQBAA3RUrjbj12DBZVLb0sh_Z3sBOPuR0",
  authDomain: "agenda-personal-97af2.firebaseapp.com",
  projectId: "agenda-personal-97af2",
  storageBucket: "agenda-personal-97af2.appspot.com",
  messagingSenderId: "503474505715",
  appId: "1:503474505715:web:f3ee7c191c72902c377486"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

