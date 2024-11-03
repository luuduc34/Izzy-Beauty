<template>
    <section v-if="user" class="review-section">
        <h2>Ajouter un Avis</h2>
        <form @submit.prevent="submitReview">
            <div class="form-group">
                <label for="review">Votre Avis :</label>
                <textarea id="review" v-model="reviewText" rows="4" required></textarea>
            </div>
            <div class="align-buttons">
                <button type="submit" class="button">Envoyer</button>
                <button type="button" class="button" @click="$emit('close')">Fermer</button>
            </div>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig'; // Import Firebase Auth

// Référence pour l'avis
const reviewText = ref('');

// Récupérer l'utilisateur actuel
const user = ref(auth.currentUser);

// Fonction pour soumettre un avis
const submitReview = async () => {
    if (user.value && reviewText.value) {
        try {
            await addDoc(collection(db, 'testimonials'), {
                userId: user.value.uid,
                userName: user.value.displayName,
                review: reviewText.value,
                timestamp: new Date()
            });
            alert("Merci pour votre avis !");
            reviewText.value = ''; // Réinitialiser l'avis
            // Émettre un événement de fermeture
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'avis :', error);
            alert('Une erreur est survenue, veuillez réessayer.');
        }
    } else {
        alert("Veuillez vous connecter pour laisser un avis.");
    }
};
</script>

<style scoped>
.review-section {
    margin-top: 2rem;
    padding: 2rem;
    background-color: #fff;
    text-align: center;
    margin-bottom: 10px;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e0;
    font-size: 1rem;
}

.align-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button {
    margin-bottom: 10px;
    padding: 0.5rem 1.5rem;
    color: white;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}

.button:hover {
    background-color: #2563eb;
}
</style>