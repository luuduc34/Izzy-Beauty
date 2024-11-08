<template>
    <section v-if="user" class="review-section">
        <h2>Ajouter un Avis</h2>
        <form @submit.prevent="submitReview">
            <!-- Section de notation par étoiles -->
            <div class="star-rating">
                <span v-for="star in 5" :key="star" @click="rate(star)" class="star"
                    :class="{ filled: star <= rating }">★</span>
            </div>
            <p>(1 = pas bien du tout, 5 = très bien)</p>
            <!-- Champ pour l'avis -->
            <div class="form-group">
                <label for="review">Votre Avis :</label>
                <textarea id="review" v-model="reviewText" rows="4" required></textarea>
            </div>
            <!-- Boutons d'envoi et de fermeture -->
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

// Références pour l'avis et la notation
const reviewText = ref('');
const rating = ref(0);

// Récupérer l'utilisateur actuel
const user = ref(auth.currentUser);

// Fonction pour noter (1 à 5 étoiles)
const rate = (star) => {
    rating.value = star;
};

// Fonction pour soumettre un avis
const submitReview = async () => {
    if (user.value && reviewText.value && rating.value > 0) {
        try {
            await addDoc(collection(db, 'testimonials'), {
                userId: user.value.uid,
                userName: user.value.displayName,
                review: reviewText.value,
                rating: rating.value,
                timestamp: new Date()
            });
            alert("Merci pour votre avis !");
            reviewText.value = ''; // Réinitialiser l'avis
            rating.value = 0; // Réinitialiser la note
            // Fermer la modal après l'envoi de l'avis
            //$emit('close');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'avis :', error);
            alert('Une erreur est survenue, veuillez réessayer.');
        }
    } else {
        alert("Veuillez vous connecter et laisser une note et un avis pour continuer.");
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
    margin-top: 2rem;
    margin-bottom: 1rem;
}

textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e0;
    font-size: 1rem;
}

/* Section de notation par étoiles */
.star-rating {
    display: flex;
    justify-content: center;
}

.star {
    font-size: 2rem;
    cursor: pointer;
    color: #ddd;
    transition: color 0.3s;
}

.star.filled {
    color: #ffc107;
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

h2 {
    margin-bottom: 10px;
    color: #333;
    font-family: "Cookie", cursive;
    font-weight: 400;
    font-size: 2.5rem;
    font-style: normal;
}
</style>
