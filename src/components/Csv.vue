<template>
    <div class="export-container">
      <button @click="exportCSV" class="export-button">Exporter les rendez-vous en CSV</button>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { db } from '../firebaseConfig'; // Import Firebase Firestore
  import { collection, getDocs } from 'firebase/firestore';
  
  // Référence pour les rendez-vous
  const appointments = ref([]);
  
  // Fonction pour récupérer les rendez-vous de Firestore
  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      appointments.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous :', error);
    }
  };
  
  // Fonction pour exporter les rendez-vous en CSV
  const exportCSV = async () => {
    await fetchAppointments(); // Récupère les rendez-vous depuis la base de données
  
    if (appointments.value.length === 0) {
      alert('Aucun rendez-vous à exporter.');
      return;
    }
  
    let csvContent = 'data:text/csv;charset=utf-8,';
  
    // Ajout de l'en-tête CSV
    const headers = `"ID";"Nom du Service";"Type";"Date";"Heure";"Client"\n`;
    csvContent += headers;
  
    // Ajout des lignes de données
    appointments.value.forEach((appointment) => {
      const row = `"${appointment.id}";"${appointment.serviceTitle || ''}";"${appointment.type || ''}";"${appointment.date || ''}";"${appointment.hour || ''}";"${appointment.clientName || ''}"`;
      csvContent += row + '\n';
    });
  
    // Créer un lien de téléchargement pour le fichier CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'rendezvous.csv');
    document.body.appendChild(link);
  
    link.click();

  };
</script>
  
<style scoped>
  .export-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .export-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .export-button:hover {
    background-color: #2563eb;
  }
</style>
  