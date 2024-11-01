<template>
    <section class="testimonials-section">
        <h2>Ce que disent nos clients</h2>
        <div class="testimonials-content">
            <div class="testimonial-item">
                <p>“Excellent service, l'équipe est très professionnelle et les soins sont merveilleux !”</p>
                <span>- Bryan S.</span>
            </div>
            <div class="testimonial-item">
                <p>“Le meilleur centre d'esthétique, je me sens toujours détendu après
                    chaque massage.”</p>
                <span>- Claude V.</span>
            </div>
        </div>
    </section>
</template>

<script setup>

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

.testimonial-item span {
    font-size: 1rem;
    font-weight: 600;
    color: #2b6cb0;
}
</style>