import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDegQ6bQmknh9UuRMIihIBRwxtuK7YtdoU",
    authDomain: "progect-joke.firebaseapp.com",
    databaseURL: "https://progect-joke-default-rtdb.firebaseio.com",
    projectId: "progect-joke",
    storageBucket: "progect-joke.appspot.com",
    messagingSenderId: "975969197783",
    appId: "1:975969197783:web:544d76b9a99ce5150cda92"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };