<template>
    <div class="connexion-container">
        <h2>Connectez-vous pour accéder à plus de fonctionnalités</h2>
        <button @click="signInWithGoogle">Se Connecter avec Google</button>
    </div>
</template>

<script setup>
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Ajouter un document utilisateur si ce n'est pas déjà fait
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            // Créer un nouveau document pour cet utilisateur
            await setDoc(userRef, {
                role: 'client',  // Par exemple, définir un rôle par défaut
                displayName: user.displayName,
                email: user.email
            });
            console.log("Nouveau document utilisateur créé !");
        }
    } catch (error) {
        console.error("Erreur d'authentification:", error);
    }
};
</script>

<style scoped>
.connexion-container {
    text-align: center;
    margin: 2rem 0;
}

button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #2563eb;
}
</style>
