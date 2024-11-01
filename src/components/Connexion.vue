<template>
    <div class="connexion-container">
        <h2>Connectez-vous pour accéder à plus de fonctionnalités</h2>
        <button @click="signInWithGoogle">Se Connecter avec Google</button>
    </div>
</template>

<script setup>
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        alert("Connexion réussie !");
    } catch (error) {
        console.error("Erreur lors de l'authentification :", error);
        alert("Erreur lors de l'authentification. Veuillez réessayer.");
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
