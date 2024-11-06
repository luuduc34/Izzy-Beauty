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

                <!-- Description du soin sélectionné -->
                <p v-if="selectedType" class="selected-type-description">
                    {{ getSelectedTypeDescription(selectedType) }}
                </p>

                <!-- Créneaux Disponibles Section -->
                <div v-if="userIsAuthenticated" class="available-slots-container">
                    <label for="slot-picker">Choisissez un créneau disponible :</label>
                    <div v-if="availableSlots.length > 0" class="available-slots-container">
                        <select v-model="selectedSlot" id="slot-picker" class="slot-picker">
                            <option v-for="slot in availableSlots" :key="slot.id" :value="slot">
                                {{ formatSlot(slot) }}
                            </option>
                        </select>
                        <button @click="bookService" class="book-button">
                            Réserver ce créneau
                        </button>
                    </div>
                    <div v-else>
                        <p>Aucun créneau disponible.</p>
                    </div>
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
import { collection, getDocs, updateDoc, addDoc, query, where, doc } from 'firebase/firestore'; // Import Firestore methods

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
const selectedType = ref("");
const selectedSlot = ref(null);
const availableSlots = ref([]);

const services = [
    {
        image: facialImage,
        alt: 'Soin du visage pour raviver la jeunesse de la peau',
        title: 'Soin du Visage',
        description: 'Nos soins du visage personnalisés pour raviver la jeunesse de votre peau. Chaque soin dure entre 30 et 60 minutes.',
        types: [
            { name: 'Soin Hydratant', description: 'Un soin qui hydrate en profondeur pour restaurer la souplesse et l’éclat de la peau. Durée : 45 minutes. Tarif : 60€.' },
            { name: 'Soin Anti-Âge', description: 'Réduit les rides et ridules pour une apparence plus jeune et lumineuse. Durée : 60 minutes. Tarif : 75€.' },
            { name: 'Soin Purifiant', description: 'Nettoie en profondeur les pores et élimine les impuretés pour une peau nette. Durée : 50 minutes. Tarif : 65€.' },
            { name: 'Soin Éclat', description: 'Ravive l’éclat de la peau et améliore le teint pour un effet lumineux. Durée : 40 minutes. Tarif : 70€.' },
            { name: 'Soin Apaisant', description: 'Calme les rougeurs et les irritations pour les peaux sensibles. Durée : 30 minutes. Tarif : 60€.' }
        ]
    },
    {
        image: massageImage,
        alt: 'Massage relaxant par un professionnel certifié',
        title: 'Massages Relaxants',
        description: 'Détendez-vous avec nos massages de bien-être par des professionnels certifiés. Chaque soin dure entre 30 et 60 minutes.',
        types: [
            { name: 'Massage Suédois', description: 'Détend les muscles en profondeur et améliore la circulation sanguine. Durée : 60 minutes. Tarif : 80€.' },
            { name: 'Massage aux Pierres Chaudes', description: 'Un massage doux utilisant des pierres volcaniques pour une relaxation totale. Durée : 50 minutes. Tarif : 90€.' },
            { name: 'Massage Californien', description: 'Un massage enveloppant qui favorise une relaxation profonde du corps et de l’esprit. Durée : 45 minutes. Tarif : 85€.' },
            { name: 'Massage des Tissus Profonds', description: 'Cible les couches profondes des muscles pour soulager les tensions. Durée : 55 minutes. Tarif : 95€.' },
            { name: 'Réflexologie Plantaire', description: 'Massage des pieds stimulant des points précis pour améliorer la santé générale. Durée : 30 minutes. Tarif : 70€.' }
        ]
    },
    {
        image: manicureImage,
        alt: 'Manucure et pédicure pour une finition parfaite',
        title: 'Manucure et Pédicure',
        description: 'Des soins esthétiques pour vos mains et pieds, pour une finition parfaite. Chaque soin dure entre 30 et 60 minutes.',
        types: [
            { name: 'Manucure Classique', description: 'Limage, cuticules, et application de vernis pour des ongles soignés. Durée : 40 minutes. Tarif : 40€.' },
            { name: 'Pédicure Spa', description: 'Un soin complet des pieds avec gommage, masque, et massage relaxant. Durée : 50 minutes. Tarif : 50€.' },
            { name: 'Manucure Française', description: 'Finition élégante avec un bord blanc classique pour une apparence chic. Durée : 45 minutes. Tarif : 45€.' },
            { name: 'Pose de Vernis Gel', description: 'Pose de vernis gel longue tenue pour une couleur éclatante pendant des semaines. Durée : 30 minutes. Tarif : 55€.' },
            { name: 'Soin des Ongles au Parafin', description: 'Hydratation intense avec la chaleur de la paraffine pour des mains douces et souples. Durée : 35 minutes. Tarif : 60€.' }
        ]
    }
];



onMounted(() => {
    const serviceId = route.params.id;
    service.value = services[serviceId];
    fetchAvailableSlots();
});

// Fonction pour récupérer la description du soin sélectionné
const getSelectedTypeDescription = (typeName) => {
    const type = service.value.types.find(t => t.name === typeName);
    return type ? type.description : '';
};

// Récupérer les créneaux disponibles depuis la base de données
const fetchAvailableSlots = async () => {
    try {
        const availabilityQuery = query(
            collection(db, 'availabilities'),
            where('service', '==', service.value.title)
        );
        const querySnapshot = await getDocs(availabilityQuery);
        availableSlots.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(slot => slot.booked !== true); // Ne montrer que les créneaux non réservés
    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    }
};

const goToHomepage = () => {
    router.push('/');
};

// Réserver le créneau choisi
const bookService = async () => {
    if (!selectedType.value) {
        alert("Veuillez sélectionner un type de soin.");
        return;
    }

    if (!selectedSlot.value) {
        alert("Veuillez sélectionner un créneau disponible.");
        return;
    }

    if (auth.currentUser) {
        try {
            await addDoc(collection(db, 'bookings'), {
                userId: auth.currentUser.uid,
                serviceTitle: service.value.title,
                type: selectedType.value,
                serviceId: route.params.id,
                date: selectedSlot.value.date,
                hour: selectedSlot.value.hour,
                employeeId: selectedSlot.value.employeeId
            });

            // Marquer le créneau comme réservé
            await updateDoc(doc(db, 'availabilities', selectedSlot.value.id), {
                booked: true
            });

            alert("Réservation effectuée avec succès !");
            fetchAvailableSlots(); // Mettre à jour les créneaux disponibles
        } catch (error) {
            console.error("Erreur lors de la réservation :", error);
            alert("Une erreur s'est produite lors de la réservation. Veuillez réessayer.");
        }
    } else {
        alert("Vous devez être connecté pour réserver.");
    }
};

// Formater le créneau pour l'affichage
const formatSlot = (slot) => {
    return `${slot.date} à ${slot.hour}:00`;
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
    color: #555;
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

.available-slots-container {
    max-width: 300px;
    margin: auto;
    background-color: #ffffff;
    text-align: center;
}

.available-slots-container label {
    color: #555;
}

.slot-picker {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #cbd5e0;
    margin-bottom: 1rem;
}

.book-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 5px;
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
    color: #555;
}

.selected-type-description {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: #4a5568;
    font-style: italic;
}
</style>