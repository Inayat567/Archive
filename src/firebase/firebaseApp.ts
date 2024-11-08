import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';
import { getDatabase } from "firebase/database";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const realtimeDB = ()=>{ return getDatabase(app) };

export { 
    db, 
    auth,
    realtimeDB,
};
