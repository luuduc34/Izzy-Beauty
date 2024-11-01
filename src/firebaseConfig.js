import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCYpYti-q0-4MVjr8TToDmqPm5IRQATCMM",
    authDomain: "izzy-beauty.firebaseapp.com",
    projectId: "izzy-beauty",
    storageBucket: "izzy-beauty.firebasestorage.app",
    messagingSenderId: "492883334353",
    appId: "1:492883334353:web:91551340070b75f34021f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);
