<template>
    <div class="connexion-container">
        <h2>Connectez-vous pour accéder à plus de fonctionnalités</h2>

        <!-- Formulaire de connexion par Email et Mot de Passe -->
        <div class="auth-form">
            <div v-if="isSignUp" class="align-form">
                <h3>Créer un compte</h3>
                <input v-model="email" type="email" placeholder="Adresse Email" />
                <input v-model="password" type="password" placeholder="Mot de Passe" />
                <button @click="signUpWithEmail">Créer un Compte</button>
                <p>Vous avez déjà un compte ? <span @click="isSignUp = false">Connectez-vous ici</span></p>
            </div>
            <div v-else class="align-form">
                <h3>Se Connecter</h3>
                <input v-model="email" type="email" placeholder="Adresse Email" />
                <input v-model="password" type="password" placeholder="Mot de Passe" />
                <button @click="signInWithEmail">Se Connecter</button>
                <p>Vous n'avez pas de compte ? <span @click="isSignUp = true">Créez-en un ici</span></p>
            </div>
        </div>
        <br>
        <h3>Ou</h3>
        <br>
        <!-- Bouton de connexion Google -->
        <button @click="signInWithGoogle" class="google-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo"
                class="google-logo">
            Se Connecter avec Google
        </button>

        <!-- Message de confirmation -->
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const email = ref('');
const password = ref('');
const isSignUp = ref(false);
const successMessage = ref('');

// Fonction pour se connecter avec Google
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
                role: 'client', // Par exemple, définir un rôle par défaut
                displayName: user.displayName,
                email: user.email
            });
            console.log('Nouveau document utilisateur créé !');
        }
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        alert("Erreur : " + error.message);
    }
};

// Fonction pour se connecter avec Email et Mot de Passe
const signInWithEmail = async () => {
    // Validation des champs
    if (!email.value || !password.value) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('Utilisateur connecté avec succès:', userCredential.user);
    } catch (error) {
        console.error("Erreur lors de la connexion avec l'email:", error);
        alert("Erreur : " + error.message);
    }
};

// Fonction pour créer un compte avec Email et Mot de Passe
const signUpWithEmail = async () => {
    // Validation des champs
    if (!email.value || !password.value) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (password.value.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Ajouter un document utilisateur
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            role: 'client', // Par exemple, définir un rôle par défaut
            displayName: user.email,
            email: user.email
        });

        successMessage.value = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        console.log('Compte créé avec succès et utilisateur enregistré:', user);
        isSignUp.value = false; // Basculer vers l'écran de connexion après la création du compte
    } catch (error) {
        console.error("Erreur lors de la création de compte:", error);
        alert("Erreur : " + error.message);
    }
};
</script>

<style scoped>
.connexion-container {
    text-align: center;
    margin: 2rem 0;
}

.auth-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.align-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

input {
    padding: 0.5rem;
    margin: 0.5rem 0;
    width: 80%;
    max-width: 400px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
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

span {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
}

.success-message {
    color: green;
    margin-top: 1rem;
}

.google-button {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    gap: 0.5rem;
    /* Espace entre l'icône et le texte */
}

.google-button:hover {
    background-color: #2563eb;
}

.google-logo {
    width: 20px;
    height: 20px;
}
</style>