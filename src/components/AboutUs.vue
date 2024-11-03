<template>
    <section class="about-section">
        <h2>Qui Sommes-Nous ?</h2>
        <div class="about-content">
            <p>
                Situé en plein cœur de la ville de Seraing, notre centre d'esthétique propose des soins haut de gamme
                pour la
                beauté et le bien-être. Notre équipe de professionnels vous offre un service personnalisé et à la
                hauteur de vos attentes.
            </p>
        </div>
    </section>
</template>

<script setup>

</script>

<style scoped>
.about-section {
    width: 90%;
    max-width: 80rem;
    margin-top: 3rem;
    padding-top: 2rem;
    padding-bottom: 1rem;
    background-color: #ebf8ff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #555;
}

.about-content {
    display: flex;
    justify-content: center;
    padding: 1rem;
}

.about-content p {
    text-align: center;
    color: #4a5568;
    line-height: 1.8;
    max-width: 60rem;
}
</style>