<template>
    <section class="testimonials-section">
        <h2>Que disent nos clients ?</h2>
        <div v-if="testimonials.length > 0" class="testimonials-content">
            <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-item">
                <p>"{{ testimonial.review }}"</p>
                <div class="star-rating">
                    <span v-for="star in 5" :key="star" class="star"
                        :class="{ filled: star <= testimonial.rating }">★</span>
                </div>
                <span>- {{ testimonial.userName }}</span>
            </div>
        </div>
        <div v-else>
            <p>Aucun avis pour le moment.</p>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';

// Référence pour stocker les avis
const testimonials = ref([]);

// Fonction pour récupérer les avis de Firestore
const fetchTestimonials = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        testimonials.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
    }
};

// Récupérer les avis au montage du composant
onMounted(() => {
    fetchTestimonials();
});
</script>

<style scoped>
.testimonials-section {
    width: 90%;
    max-width: 80rem;
    padding: 2rem;
    margin-top: 3rem;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonials-section h2 {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #555;
}

.testimonials-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
}

.testimonial-item p {
    font-size: 1.125rem;
    color: #4a5568;
    font-style: italic;
}

.testimonial-item .star-rating {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.testimonial-item .star {
    font-size: 1.5rem;
    color: #ddd;
}

.testimonial-item .star.filled {
    color: #ffc107;
    /* Couleur dorée pour les étoiles remplies */
}

.testimonial-item span {
    font-size: 1rem;
    font-weight: 600;
    color: #2b6cb0;
}
</style>
