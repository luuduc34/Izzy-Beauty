<template>
    <section class="contact-section">
        <h2>Contactez-Nous</h2>
        <div class="contact-content">
            <p>Pour toute question, contactez-nous :</p>
            <p class="contact-info">Téléphone : +32 479 53 24 78</p>
            <p class="contact-info">Email : contact@izzybeauty.be</p>
            <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="form-group">
                    <label for="name">Nom :</label>
                    <input type="text" id="name" v-model="form.name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email :</label>
                    <input type="email" id="email" v-model="form.email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message :</label>
                    <textarea id="message" v-model="form.message" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-button">Envoyer</button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
    name: '',
    email: '',
    message: ''
});

const handleSubmit = () => {
    console.log('Formulaire soumis :', form.value);
    alert('Merci pour votre message, nous vous contacterons prochainement !');
    form.value = { name: '', email: '', message: '' };
};
</script>

<style scoped>
.contact-section {
    width: 90%;
    max-width: 80rem;
    padding: 2rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
    background-color: #ebf8ff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-section h2 {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-size: 2rem;
    font-style: normal;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #555;
}

.contact-content {
    text-align: center;
}

.contact-content p {
    font-size: 1.125rem;
    color: #555;
}

.contact-info {
    font-size: 1.25rem;
    margin-top: 0.5rem;
    font-weight: 600;
    color: #2b6cb0;
}

.contact-form {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 30rem;
}

label {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
}

input,
textarea {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e0;
    width: 100%;
    font-size: 1rem;
    color: #555;
}

.submit-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #2563eb;
}
</style>