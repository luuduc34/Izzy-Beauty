<template>
    <div class="main-container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="welcome">Bienvenue au centre d'esthétique</h1>
                <h1 class="title">Izzy Beauty</h1>
            </div>
            <i class="fas fa-user profile-icon" @click="goToProfile"></i>
            <font-awesome-icon icon="home" class="home-icon" />
        </section>
        <div class="align-right">
            <button v-if="!userIsAuthenticated" class="connect-button" @click="goToConnexion">Se Connecter</button>
        </div>

        <!-- Modal for Connexion Section -->
        <div v-if="showConnexionForm" class="modal-overlay" @click.self="closeConnexion">
            <div class="modal-content">
                <Connexion @close="closeConnexion" />
            </div>
        </div>

        <!-- Services Section -->
        <Services />

        <!-- About Us Section -->
        <AboutUs />

        <!-- Testimonials Section -->
        <Testimonials />

        <!-- Contact Section -->
        <Contact />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { auth } from '../firebaseConfig';
import { onMounted, ref, watch } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

import AboutUs from "./AboutUs.vue";
import Testimonials from "./Testimonials.vue";
import Services from "./Services.vue";
import Contact from "./Contact.vue";
import Connexion from "./Connexion.vue";

const route = useRoute();
const router = useRouter();

const userIsAuthenticated = ref(false);
const showConnexionForm = ref(false); // Pour montrer ou cacher le formulaire de connexion

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        userIsAuthenticated.value = !!user;
        if (user) {
            closeConnexion(); // Ferme le popup si l'utilisateur est connecté
        }
    });
});

const goToConnexion = () => {
    showConnexionForm.value = true; // Afficher le popup de Connexion
};

const closeConnexion = () => {
    showConnexionForm.value = false; // Fermer le popup de Connexion
};

const goToProfile = () => {
    if (auth.currentUser) {
        router.push('/profile');
    } else {
        alert("Vous devez être connecté pour accéder à votre profil.");
        goToConnexion();
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cookie&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cookie&family=DM+Serif+Text:ital@0;1&display=swap');

.main-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f7fafc;
}

.align-right {
    text-align: right;
    margin-left: auto;
    margin-right: 1rem;
}

.hero-section {
    position: relative;
    width: 100%;
    height: 24rem;
    background: url('../assets/spa-hero.jpg') center center / cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 2rem;
    border-radius: 1rem;
}

.connect-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.connect-button:hover {
    background-color: #2563eb;
}

.welcome {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    color: #ffffff;
}

.title {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 3rem;
    font-style: normal;
    color: #ffffff;
}

.home-icon {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.home-icon:hover {
    background-color: rgba(0, 0, 0, 0.8);
}

.profile-icon {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.profile-icon:hover {
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 2rem 0;
    border-radius: 0.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
