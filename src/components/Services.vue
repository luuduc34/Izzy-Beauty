<template>
    <section class="services-section">
        <h2>Nos Services</h2>
        <div class="services-grid">
            <div v-for="(service, index) in services" :key="index" class="service-item"
                @click="goToServiceDetail(index)">
                <img :src="service.image" :alt="service.alt" class="service-image">
                <h3>{{ service.title }}</h3>
                <p>{{ service.description }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import facialImage from '@/assets/facial.jpg';
import massageImage from '@/assets/massage.jpg';
import manicureImage from '@/assets/manicure.jpg';

import { useRouter } from 'vue-router';

const router = useRouter();

const goToServiceDetail = (index) => {
    router.push({ path: `/service/${index}` });
};

const services = [
    {
        image: facialImage,
        alt: 'Soin du visage pour raviver la jeunesse de la peau',
        title: 'Soin du Visage',
        description: 'Nos soins du visage personnalisés pour raviver la jeunesse de votre peau.',
        types: [
            {
                name: 'Soin Hydratant',
                description: 'Un soin qui hydrate en profondeur pour restaurer la souplesse et l’éclat de la peau.',
            },
            {
                name: 'Soin Anti-Âge',
                description: 'Réduit les rides et ridules pour une apparence plus jeune et lumineuse.',
            },
            {
                name: 'Soin Purifiant',
                description: 'Nettoie en profondeur les pores et élimine les impuretés pour une peau nette.',
            },
            {
                name: 'Soin Éclat',
                description: 'Ravive l’éclat de la peau et améliore le teint pour un effet lumineux.',
            },
            {
                name: 'Soin Apaisant',
                description: 'Calme les rougeurs et les irritations pour les peaux sensibles.',
            }
        ]
    },
    {
        image: massageImage,
        alt: 'Massage relaxant par un professionnel certifié',
        title: 'Massages Relaxants',
        description: 'Détendez-vous avec nos massages de bien-être par des professionnels certifiés.',
        types: [
            {
                name: 'Massage Suédois',
                description: 'Détend les muscles en profondeur et améliore la circulation sanguine.',
            },
            {
                name: 'Massage aux Pierres Chaudes',
                description: 'Un massage doux utilisant des pierres volcaniques pour une relaxation totale.',
            },
            {
                name: 'Massage Californien',
                description: 'Un massage enveloppant qui favorise une relaxation profonde du corps et de l’esprit.',
            },
            {
                name: 'Massage des Tissus Profonds',
                description: 'Cible les couches profondes des muscles pour soulager les tensions.',
            },
            {
                name: 'Réflexologie Plantaire',
                description: 'Massage des pieds stimulant des points précis pour améliorer la santé générale.',
            }
        ]
    },
    {
        image: manicureImage,
        alt: 'Manucure et pédicure pour une finition parfaite',
        title: 'Manucure et Pédicure',
        description: 'Des soins esthétiques pour vos mains et pieds, pour une finition parfaite.',
        types: [
            {
                name: 'Manucure Classique',
                description: 'Limage, cuticules, et application de vernis pour des ongles soignés.',
            },
            {
                name: 'Pédicure Spa',
                description: 'Un soin complet des pieds avec gommage, masque, et massage relaxant.',
            },
            {
                name: 'Manucure Française',
                description: 'Finition élégante avec un bord blanc classique pour une apparence chic.',
            },
            {
                name: 'Pose de Vernis Gel',
                description: 'Pose de vernis gel longue tenue pour une couleur éclatante pendant des semaines.',
            },
            {
                name: 'Soin des Ongles au Parafin',
                description: 'Hydratation intense avec la chaleur de la paraffine pour des mains douces et souples.',
            }
        ]
    }
];


</script>

<style scoped>
.services-section {
    width: 100%;
    max-width: 80rem;
    padding: 2rem;
    margin-top: 2rem;
}

.services-section h2 {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #555;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 2rem;
    justify-items: center;
}

.service-item {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    overflow: hidden;
}

.service-item:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.service-image {
    height: 12rem;
    width: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
}

.service-item h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    color: #555;
}

.service-item p {
    color: #4a5568;
    margin-top: 0.5rem;
}
</style>