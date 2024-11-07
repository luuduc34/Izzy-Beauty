<template>
    <div v-if="user" class="main-container">
        <div class="fantome"></div>
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content" @click="goToHomepage">
                <h1 class="title">Izzy Beauty</h1>
            </div>
            <font-awesome-icon icon="home" class="home-icon" @click="goToHomepage" />
        </section>
        <div>

        </div>
        <!-- Profile Content Section -->
        <section class="profile-content">
            <h1 class="welcome">Bonjour, {{ user.displayName }}</h1>
            <img :src="user.photoURL" alt="Profile Picture" class="profile-picture" />
            <button @click="logout" class="profile-button">Se Déconnecter</button>
            <button @click="showReviewForm = true" class="review-button">Laisser un avis</button>
        </section>

        <!-- Employee Section -->

        <!-- Afficher worklist -->

        <Worklist />

        <!-- Afficher les disponibilités -->
        <section class="availabilities-section" v-if="userRole === 'employee'">
            <h2>Vos Disponibilités</h2>
            <div v-if="availabilities.length > 0" class="availabilities-list">
                <ul>
                    <li v-for="availability in availabilities" :key="availability.id"
                        :class="['availability-item', { 'past-availability': isPastAvailability(availability.date, availability.hour) }]">
                        {{ availability.service }} - {{ availability.date }} à {{ availability.hour }}:00
                        <button @click="removeAvailabilityFromDB(availability)" class="cancel-button"
                            :disabled="isPastAvailability(availability.date, availability.hour)">
                            Supprimer
                        </button>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>Vous n'avez pas encore de disponibilités enregistrées.</p>
            </div>
        </section>
        <!-- Ajouter des disponibilités -->
        <section class="appointments-section" v-if="userRole === 'employee'">
            <div class="availability-container">
                <h2>Encoder vos disponibilités</h2>
                <div class="date-hour-selection">
                    <label for="datePicker">Sélectionner une date:</label>
                    <input v-model="selectedDate" id="datePicker" type="date" :min="minDate" />

                    <label for="hourPicker">Sélectionner une heure:</label>
                    <select v-model="selectedHour" id="hourPicker">
                        <option v-for="hour in availableHours" :key="hour" :value="hour">{{ hour }}:00</option>
                    </select>
                </div>
                <label>Sélectionner un soin:</label>
                <select v-model="selectedService">
                    <option v-for="service in services" :key="service.title" :value="service.title">
                        {{ service.title }}
                    </option>
                </select>
                <button @click="addAvailability">Ajouter le créneau</button>

                <div v-if="availabilityList.length > 0" class="availability-list">
                    <h3>Vos Disponibilités:</h3>
                    <ul>
                        <li v-for="(availability, index) in availabilityList" :key="index">
                            {{ availability.service }} - {{ availability.date }} à {{ availability.hour }}:00
                            <button @click="removeAvailability(index)" class="cancel-button">Supprimer</button>
                        </li>
                    </ul>
                </div>

                <button @click="saveAvailabilities">Enregistrer les disponibilités</button>
            </div>
        </section>

        <!-- Rendez-vous Section -->
        <section class="appointments-section">
            <h2 class="welcome">Vos rendez-vous</h2>
            <div v-if="appointments.length > 0" class="appointments-list">
                <div v-for="appointment in appointments" :key="appointment.id"
                    :class="['appointment-item', { 'past-appointment': isPastAppointment(appointment.date, appointment.hour) }]">
                    <h3>{{ appointment.serviceTitle }}</h3>
                    <p>Type de soin : {{ appointment.type }}</p>
                    <p>Date : {{ formatDate(appointment.date) }} à {{ appointment.hour }}h</p>
                    <button @click="cancelAppointment(appointment)" class="cancel-button"
                        :disabled="isPastAppointment(appointment.date, appointment.hour)">
                        Annuler le rendez-vous
                    </button>
                </div>
            </div>
            <div v-else class="no-appointments">
                <p>Vous n'avez aucun rendez-vous pour le moment.</p>
            </div>
        </section>

        <Contact />
    </div>

    <!-- Modal pour laisser un avis -->
    <div v-if="showReviewForm" class="modal-overlay" @click.self="closeReviewModal">
        <div class="modal-content">
            <Avis @close="closeReviewModal" /> <!-- Composant Avis.vue pour laisser un avis -->
        </div>
    </div>

    <div v-else class="login-container" v-if="!userIsAuthenticated">
        <div class="fantome"></div>
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="title">Izzy Beauty</h1>
            </div>
            <!-- Home Icon -->
            <font-awesome-icon icon="home" class="home-icon" @click="goToHomepage" />
        </section>
        <p>Connectez-vous pour accéder à votre profil</p>
        <button class="connect-button" @click="goToConnexion">Se Connecter</button>
    </div>
    <div v-if="showConnexionForm" class="modal-overlay" @click.self="closeConnexion">
        <div class="modal-content">
            <Connexion @close="closeConnexion" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import Contact from "./Contact.vue";
import Connexion from "./Connexion.vue";
import Avis from "./Avis.vue";
import Worklist from "./Worklist.vue";

const router = useRouter();
const userRole = ref('');
const user = ref(null);
const appointments = ref([]);
const selectedDate = ref(null); // Date sélectionnée
const selectedHour = ref(9);  // Heure sélectionnée
const services = [
    { title: 'Soin du Visage' },
    { title: 'Massages Relaxants' },
    { title: 'Manucure et Pédicure' }
];
const selectedService = ref(services[0].title);
const minDate = new Date().toISOString().split('T')[0]; // Date minimum (aujourd'hui)
const availabilityList = ref([]);
const userIsAuthenticated = ref(false);
const showConnexionForm = ref(false); // Pour montrer ou cacher le formulaire de connexion
const availabilities = ref([]); // Pour récupérer toutes les disponibilités de l'employé
const showReviewForm = ref(false); // Variable pour montrer ou cacher la modal Avis

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        userIsAuthenticated.value = !!user;
        if (user) {
            closeConnexion(); // Ferme le popup si l'utilisateur est connecté
        }
    });
});

// Observer l'état d'authentification
onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser;
    if (user.value) {
        await fetchAppointments();
        await fetchAvailabilities();  // Appel de la fonction pour récupérer les disponibilités

        try {
            const userRef = doc(db, 'users', user.value.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                userRole.value = userDoc.data().role; // Récupérer le rôle de l'utilisateur
            } else {
                console.error("Utilisateur non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du rôle de l'utilisateur :", error);
        }
    }
});

// Fonction pour récupérer les disponibilités de l'utilisateur
const fetchAvailabilities = async () => {
    if (user.value) {
        const availabilitiesRef = collection(db, 'availabilities');
        const q = query(availabilitiesRef, where('employeeId', '==', user.value.uid));
        try {
            const querySnapshot = await getDocs(q);
            availabilities.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des disponibilités :", error);
        }
    }
};

// Supprimer une disponibilité de la base de données
const removeAvailabilityFromDB = async (availability) => {
    try {
        await deleteDoc(doc(db, 'availabilities', availability.id));
        availabilities.value = availabilities.value.filter(avail => avail.id !== availability.id);
        alert("La disponibilité a été supprimée avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression de la disponibilité :", error);
        alert("Une erreur s'est produite lors de la suppression. Veuillez réessayer.");
    }
};


// Générer une liste d'heures disponibles entre 9h et 17h
const availableHours = [];
for (let i = 9; i < 17; i++) {
    availableHours.push(i);
}

// Ajouter une disponibilité à la liste
const addAvailability = () => {
    if (!selectedDate.value || !selectedHour.value || !selectedService.value) {
        alert("Veuillez sélectionner une date, une heure et un service.");
        return;
    }
    availabilityList.value.push({
        service: selectedService.value,
        date: selectedDate.value,
        hour: selectedHour.value
    });
    selectedHour.value = '';
    selectedService.value = '';
};

// Supprimer une disponibilité de la liste
const removeAvailability = (index) => {
    availabilityList.value.splice(index, 1);
};

// Enregistrer les disponibilités dans la base de données
const saveAvailabilities = async () => {
    if (availabilityList.value.length === 0) {
        alert("Veuillez ajouter au moins une disponibilité.");
        return;
    }
    try {
        for (const availability of availabilityList.value) {
            // Vérifier si la disponibilité existe déjà
            const availabilityQuery = query(
                collection(db, 'availabilities'),
                where('employeeId', '==', user.value.uid),
                where('date', '==', availability.date),
                where('hour', '==', availability.hour),
                where('service', '==', availability.service)
            );
            const querySnapshot = await getDocs(availabilityQuery);

            if (!querySnapshot.empty) {
                alert(`Le créneau du ${availability.date} à ${availability.hour}:00 pour ${availability.service} existe déjà.`);
                continue;
            }

            // Ajouter la disponibilité si elle n'existe pas
            await addDoc(collection(db, 'availabilities'), {
                booked: false,
                employeeId: user.value.uid,
                date: availability.date,
                hour: availability.hour,
                service: availability.service
            });
        }

        alert('Disponibilités enregistrées avec succès!');
        availabilityList.value = []; // Réinitialiser la liste après l'enregistrement

        // Mettre à jour les disponibilités affichées
        await fetchAvailabilities();

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des disponibilités:', error);
        alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
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

const goToConnexion = () => {
    showConnexionForm.value = true; // Afficher le popup de Connexion
};

const closeConnexion = () => {
    showConnexionForm.value = false; // Fermer le popup de Connexion
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

// Formater la date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const cancelAppointment = async (appointment) => {
    const currentDate = new Date();
    const appointmentDate = new Date(appointment.date);

    // Annulation possible seulement jusqu'à la veille
    const dayBeforeAppointment = new Date(appointmentDate);
    dayBeforeAppointment.setDate(dayBeforeAppointment.getDate() - 1);

    if (currentDate > dayBeforeAppointment) {
        alert("L'annulation n'est possible que jusqu'à la veille du rendez-vous.");
        return;
    }

    // Formatage du jour, de la date et de l'heure
    const appointmentDateObject = new Date(appointment.date + "T00:00:00");
    const appointmentDay = appointmentDateObject.toLocaleDateString('fr-FR', {
        weekday: 'long',
    });
    const appointmentFormattedDate = appointmentDateObject.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const appointmentTime = `${appointment.hour}:00`;

    // Demander une confirmation avant d'annuler le rendez-vous
    const confirmationMessage = `Êtes-vous sûr de vouloir annuler le rendez-vous pour ${appointment.serviceTitle} (${appointment.type}) prévu le ${appointmentDay} ${appointmentFormattedDate} à ${appointmentTime} ?`;
    const confirmation = confirm(confirmationMessage);

    if (!confirmation) {
        return;
    }

    try {
        // Supprimer le rendez-vous de la collection 'bookings'
        await deleteDoc(doc(db, 'bookings', appointment.id));
        alert("Le rendez-vous a été annulé avec succès.");

        // Mettre à jour la liste des rendez-vous après l'annulation
        appointments.value = appointments.value.filter(a => a.id !== appointment.id);

        // Rechercher la disponibilité correspondante dans 'availabilities'
        const availabilityQuery = query(
            collection(db, 'availabilities'),
            where('employeeId', '==', appointment.employeeId),
            where('date', '==', appointment.date),
            where('hour', '==', appointment.hour),
            where('service', '==', appointment.serviceTitle)
        );

        const querySnapshot = await getDocs(availabilityQuery);
        if (!querySnapshot.empty) {
            const availabilityDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'availabilities', availabilityDoc.id), {
                booked: false
            });
            console.log("La disponibilité a été mise à jour pour refléter l'annulation.");
        } else {
            console.log("Aucune disponibilité trouvée correspondant au rendez-vous annulé.");
        }

    } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous :", error);
        alert("Une erreur s'est produite lors de l'annulation. Veuillez réessayer.");
    }
};

// Fonction pour fermer la modal Avis
const closeReviewModal = () => {
    showReviewForm.value = false;
};

// Fonction pour vérifier si un rendez-vous est passé
const isPastAppointment = (date, hour) => {
    const appointmentDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
    return appointmentDate < new Date();
};

// Fonction pour vérifier si une disponibilité est passée
const isPastAvailability = (date, hour) => {
    const availabilityDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
    return availabilityDate < new Date();
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
    color: #333;
}

.fantome {
    width: 990px;
}

.availability-container {
    max-width: 400px;
    margin: auto;
    background-color: #ffffff;
    text-align: center;
}

.date-hour-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}

input[type="date"],
select {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: border-color 0.3s;
    font-size: 16px;
    color: #555;
}

input[type="date"]:focus,
select:focus {
    outline: none;
    border-color: #3b82f6;
}

button {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    font-size: 1.125rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
}

button:hover {
    background-color: #2563eb;
}

button:disabled {
    background-color: #bbb;
    cursor: not-allowed;
}

h2 {
    margin-bottom: 10px;
    color: #333;
    font-family: "Cookie", cursive;
    font-weight: 400;
    font-size: 2.5rem;
    font-style: normal;
}

.login-container {
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
    transition: background-color 0.3s ease, color 0.3s ease;
}

.appointment-item.past-appointment {
    background-color: #f1f1f1;
    color: #9e9e9e;
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

.availability-list {
    text-align: left;
}

.availability-list ul {
    list-style: none;
    padding: 0;
}

.availability-list li {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
}

.availabilities-section {
    width: 90%;
    padding: 2rem;
    margin-top: 2rem;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.availabilities-list {
    margin-top: 1rem;
    text-align: left;
}

.availabilities-list ul {
    list-style: none;
    padding: 0;
}

.availabilities-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.availability-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.availability-item.past-availability {
    background-color: #f1f1f1;
    color: #9e9e9e;
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
    padding: 2rem;
    border-radius: 0.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.review-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
}

.review-button:hover {
    background-color: #2563eb;
}
</style>
