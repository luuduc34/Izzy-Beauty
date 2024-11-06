<template>
    <section class="work-list-section" v-if="assignedAppointments.length > 0">
        <h2 class="welcome">Liste de Travail</h2>
        <div v-if="assignedAppointments.length > 0" class="appointments-list">
            <div v-for="appointment in assignedAppointments" :key="appointment.id"
                :class="['appointment-item', { 'past-appointment': isPastAppointment(appointment.date, appointment.hour) }]">
                <h3>{{ appointment.serviceTitle }}</h3>
                <p>Type de soin : {{ appointment.type }}</p>
                <p>Date : {{ formatDate(appointment.date) }} à {{ appointment.hour }}h</p>
                <p>Client : {{ appointment.clientName }}</p>
            </div>
        </div>
        <div v-else class="no-appointments">
            <p>Vous n'avez aucun rendez-vous assigné pour le moment.</p>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const assignedAppointments = ref([]); // État pour stocker les rendez-vous assignés

onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await fetchAssignedAppointments(user);
        }
    });
});

// Fonction pour récupérer les rendez-vous assignés à l'employé
const fetchAssignedAppointments = async (user) => {
    if (user) {
        const appointmentsRef = collection(db, 'bookings');
        const q = query(appointmentsRef, where('employeeId', '==', user.uid));
        try {
            const querySnapshot = await getDocs(q);
            assignedAppointments.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                clientName: doc.data().clientName ?? 'Nom inconnu' // Assurez-vous que le nom du client est affiché
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des rendez-vous assignés :", error);
        }
    }
};

const isPastAppointment = (date, hour) => {
    const formattedHour = hour.toString().padStart(2, '0');
    const appointmentDateTime = new Date(`${date}T${formattedHour}:00:00`);
    const now = new Date();

    return appointmentDateTime.getTime() < now.getTime();
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
</script>

<style scoped>
.work-list-section {
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

h2 {
    margin-bottom: 10px;
    color: #333;
    font-family: "Cookie", cursive;
    font-weight: 400;
    font-size: 2.5rem;
    font-style: normal;
}
</style>
