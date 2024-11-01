<template>
    <div class="main-container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="welcome">Bienvenue au centre d'esthétique</h1>
                <h1 class="title">Izzy Beauty</h1>
            </div>
            <i class="fas fa-user profile-icon" @click="goToProfile"></i>
            <!-- Home Icon -->
            <font-awesome-icon icon="home" class="home-icon" @click="goToHomepage" />
        </section>

        <!-- Service Detail Section -->
        <section class="service-detail-section">
            <div v-if="service" class="service-detail">
                <h2>{{ service.title }}</h2>
                <img :src="service.image" :alt="service.alt" class="service-image">
                <p>{{ service.description }}</p>
                <select v-if="userIsAuthenticated" v-model="selectedType" class="service-type-select">
                    <option disabled value="">Sélectionnez un type de soin</option>
                    <option v-for="(type, index) in service.types" :key="index" :value="type.name">
                        {{ type.name }}
                    </option>
                </select>
                <!-- Datepicker Section -->
                <div v-if="userIsAuthenticated" class="datepicker-container">
                    <label for="date-picker">Choisissez une date pour ce service :</label>
                    <Datepicker v-model="selectedDate" id="date-picker" class="custom-datepicker" />
                    <button @click="bookService" class="book-button" :disabled="!selectedType || !selectedDate">
                        Réserver cette date
                    </button>
                </div>
            </div>
            <div v-else class="service-detail">
                <p>Service non trouvé.</p>
            </div>
        </section>

        <!-- About Us Section -->
        <AboutUs />

        <!-- Testimonials Section -->
        <Testimonials />

        <!-- Contact Section -->
        <Contact />
    </div>
</template>

<script setup>
import facialImage from '@/assets/facial.jpg';
import massageImage from '@/assets/massage.jpg';
import manicureImage from '@/assets/manicure.jpg';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import Datepicker from '@vuepic/vue-datepicker'; // Import Datepicker
import '@vuepic/vue-datepicker/dist/main.css'; // Import default CSS for Datepicker

import AboutUs from "./AboutUs.vue";
import Testimonials from "./Testimonials.vue";
import Contact from "./Contact.vue";

const userIsAuthenticated = ref(false);

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        userIsAuthenticated.value = !!user;
    });
});

const goToProfile = () => {
    if (auth.currentUser) {
        router.push('/profile');
    } else {
        alert("Vous devez être connecté pour accéder à votre profil.");
        router.push('/');
    }
};

const route = useRoute();
const router = useRouter();
const service = ref({});
const selectedDate = ref(null);
const selectedType = ref("");

const services = [
    {
        image: facialImage,
        alt: 'Soin du visage pour raviver la jeunesse de la peau',
        title: 'Soin du Visage',
        description: 'Nos soins du visage personnalisés pour raviver la jeunesse de votre peau.',
        types: [
            { name: 'Soin Hydratant', description: 'Un soin qui hydrate en profondeur pour restaurer la souplesse et l’éclat de la peau.' },
            { name: 'Soin Anti-Âge', description: 'Réduit les rides et ridules pour une apparence plus jeune et lumineuse.' },
            { name: 'Soin Purifiant', description: 'Nettoie en profondeur les pores et élimine les impuretés pour une peau nette.' },
            { name: 'Soin Éclat', description: 'Ravive l’éclat de la peau et améliore le teint pour un effet lumineux.' },
            { name: 'Soin Apaisant', description: 'Calme les rougeurs et les irritations pour les peaux sensibles.' }
        ]
    },
    {
        image: massageImage,
        alt: 'Massage relaxant par un professionnel certifié',
        title: 'Massages Relaxants',
        description: 'Détendez-vous avec nos massages de bien-être par des professionnels certifiés.',
        types: [
            { name: 'Massage Suédois', description: 'Détend les muscles en profondeur et améliore la circulation sanguine.' },
            { name: 'Massage aux Pierres Chaudes', description: 'Un massage doux utilisant des pierres volcaniques pour une relaxation totale.' },
            { name: 'Massage Californien', description: 'Un massage enveloppant qui favorise une relaxation profonde du corps et de l’esprit.' },
            { name: 'Massage des Tissus Profonds', description: 'Cible les couches profondes des muscles pour soulager les tensions.' },
            { name: 'Réflexologie Plantaire', description: 'Massage des pieds stimulant des points précis pour améliorer la santé générale.' }
        ]
    },
    {
        image: manicureImage,
        alt: 'Manucure et pédicure pour une finition parfaite',
        title: 'Manucure et Pédicure',
        description: 'Des soins esthétiques pour vos mains et pieds, pour une finition parfaite.',
        types: [
            { name: 'Manucure Classique', description: 'Limage, cuticules, et application de vernis pour des ongles soignés.' },
            { name: 'Pédicure Spa', description: 'Un soin complet des pieds avec gommage, masque, et massage relaxant.' },
            { name: 'Manucure Française', description: 'Finition élégante avec un bord blanc classique pour une apparence chic.' },
            { name: 'Pose de Vernis Gel', description: 'Pose de vernis gel longue tenue pour une couleur éclatante pendant des semaines.' },
            { name: 'Soin des Ongles au Parafin', description: 'Hydratation intense avec la chaleur de la paraffine pour des mains douces et souples.' }
        ]
    }
];

onMounted(() => {
    const serviceId = route.params.id;
    service.value = services[serviceId];
});

const goToHomepage = () => {
    router.push('/');
};

// Fonction pour réserver le service avec la date et le type de soin sélectionné
const bookService = async () => {
    if (!selectedType.value) {
        alert("Veuillez sélectionner un type de soin.");
        return;
    }

    if (!selectedDate.value) {
        alert("Veuillez sélectionner une date.");
        return;
    }

    if (auth.currentUser) {
        try {
            await addDoc(collection(db, 'bookings'), {
                userId: auth.currentUser.uid,
                serviceTitle: service.value.title,
                type: selectedType.value,
                serviceId: route.params.id,
                date: selectedDate.value,
            });
            alert("Réservation effectuée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la réservation :", error);
            alert("Une erreur s'est produite lors de la réservation. Veuillez réessayer.");
        }
    } else {
        alert("Vous devez être connecté pour réserver.");
    }
};
</script>

<style scoped>
.main-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f7fafc;
}

.hero-section {
    position: relative;
    width: 100%;
    height: 24rem;
    background: url('../assets/spa-hero.jpg') center center / cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.hero-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 2rem;
    border-radius: 1rem;
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

.service-detail-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 80rem;
    margin-top: 2rem;
    padding: 2rem;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.service-detail {
    text-align: center;
}

.service-detail p {
    margin-top: 1rem;
}

.service-image {
    width: 100%;
    max-width: 30rem;
    border-radius: 0.5rem;
    margin: auto;
}

.service-detail h2 {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    margin-bottom: 1.5rem;
    text-align: center;
}

.service-detail p {
    font-size: 1.125rem;
    color: #4a5568;
    line-height: 1.8;
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

.datepicker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.custom-datepicker {
    max-width: 300px;
    /* Limite la largeur du datepicker */
    margin: 1rem 0;
}

.book-button {
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    font-size: 1.125rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.book-button:hover {
    background-color: #2563eb;
}

.service-type-select {
    width: 100%;
    max-width: 300px;
    margin: 1rem 0;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e0;
}
</style>