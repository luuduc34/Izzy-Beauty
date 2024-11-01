<template>
    <div v-if="user" class="main-container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content" @click="goToHomepage">
                <h1 class="title">Izzy Beauty</h1>
            </div>
            <font-awesome-icon icon="home" class="home-icon" @click="goToHomepage" />
        </section>

        <!-- Profile Content Section -->
        <section class="profile-content">
            <h1 class="welcome">Bonjour, {{ user.displayName }}</h1>
            <img :src="user.photoURL" alt="Profile Picture" class="profile-picture" />
            <button @click="logout" class="profile-button">Se Déconnecter</button>
        </section>

        <!-- Rendez-vous Section -->
        <section class="appointments-section">
            <h2 class="welcome">Vos rendez-vous</h2>
            <div v-if="appointments.length > 0" class="appointments-list">
                <div v-for="appointment in appointments" :key="appointment.id" class="appointment-item">
                    <h3>{{ appointment.serviceTitle }}</h3>
                    <p>Type de soin : {{ appointment.type }}</p>
                    <p>Date : {{ formatDate(appointment.date) }}</p>
                    <button @click="cancelAppointment(appointment)" class="cancel-button">Annuler le
                        rendez-vous</button>
                </div>
            </div>
            <div v-else class="no-appointments">
                <p>Vous n'avez aucun rendez-vous pour le moment.</p>
            </div>
        </section>

        <Contact />
    </div>
    <div v-else class="login-container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="title">Izzy Beauty</h1>
            </div>
        </section>
        <h2>Connectez-vous pour accéder à votre profil</h2>
        <button @click="signInWithGoogle">Se Connecter avec Google</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore methods

import Contact from "./Contact.vue";

const router = useRouter();
const user = ref(null);
const appointments = ref([]);

// Observer l'état d'authentification
onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser;
    if (user.value) {
        await fetchAppointments();
    }
});

// Fonction de connexion avec Google
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Erreur d'authentification:", error);
    }
};

// Fonction de déconnexion
const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
    }
};

// Rediriger vers la page d'accueil
const goToHomepage = () => {
    router.push('/');
};

// Récupérer les rendez-vous de l'utilisateur
const fetchAppointments = async () => {
    if (user.value) {
        const appointmentsRef = collection(db, 'bookings');
        const q = query(appointmentsRef, where('userId', '==', user.value.uid));
        try {
            const querySnapshot = await getDocs(q);
            appointments.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des rendez-vous :", error);
        }
    }
};

// Fonction pour formater la date
const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Fonction pour annuler un rendez-vous
const cancelAppointment = async (appointment) => {
    // Formatage du jour, de la date et de l'heure
    const appointmentDateObject = new Date(appointment.date.seconds * 1000);
    const appointmentDay = appointmentDateObject.toLocaleDateString('fr-FR', {
        weekday: 'long',
    });
    const appointmentDate = appointmentDateObject.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const appointmentTime = appointmentDateObject.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Demander une confirmation avant d'annuler le rendez-vous
    const confirmationMessage = `Êtes-vous sûr de vouloir annuler le rendez-vous pour ${appointment.serviceTitle} (${appointment.type}) prévu le ${appointmentDay} ${appointmentDate} à ${appointmentTime} ?`;
    const confirmation = confirm(confirmationMessage);

    if (!confirmation) {
        return; // Si l'utilisateur annule, ne continuez pas
    }

    const now = new Date();
    const appointmentDateTime = new Date(appointment.date.seconds * 1000);

    // Vérifier si le rendez-vous est annulable (plus de 24 heures avant le rendez-vous)
    if (appointmentDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000) {
        try {
            await deleteDoc(doc(db, 'bookings', appointment.id));
            alert("Le rendez-vous a été annulé avec succès.");
            // Mettre à jour la liste des rendez-vous après l'annulation
            appointments.value = appointments.value.filter(a => a.id !== appointment.id);
        } catch (error) {
            console.error("Erreur lors de l'annulation du rendez-vous :", error);
            alert("Une erreur s'est produite lors de l'annulation. Veuillez réessayer.");
        }
    } else {
        alert("Attention, il est trop tard pour annuler ce rendez-vous.");
    }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cookie&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cookie&family=DM+Serif+Text:ital@0;1&display=swap');

.main-container {
    min-height: 100vh;
    min-width: 900px;
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
}

.hero-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 2rem;
    border-radius: 1rem;
    cursor: pointer;
}

.welcome {
    font-family: "Cookie", cursive;
    font-weight: 400;
    font-size: 2.5rem;
    font-style: normal;
    color: #585757;
}

.title {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 3rem;
    font-style: normal;
    color: #ffffff;
}

.profile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 80rem;
    padding: 2rem;
    margin-top: 2rem;
    text-align: center;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 1.5rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.profile-button:hover {
    background-color: #2563eb;
}

.appointments-section {
    width: 90%;
    max-width: 80rem;
    padding: 2rem;
    margin-top: 2rem;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.appointments-list {
    margin-top: 1rem;
}

.appointment-item {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.appointment-item h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2b6cb0;
}

.no-appointments {
    font-size: 1rem;
    color: #4a5568;
}

.cancel-button {
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #e53e3e;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cancel-button:hover {
    background-color: #c53030;
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
</style>
