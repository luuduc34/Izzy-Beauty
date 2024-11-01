<script setup>

defineProps({
    msg: {
        type: String,
        required: true
    }
})
</script>
<template>
    <div class="card">
        <img :src="imgSrc" :alt="title" class="card-image" />
        <div class="card-content">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServiceCard',
    props: {
        imgSrc: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.card:hover {
    transform: scale(1.05);
}

.card-image {
    width: 100%;
    height: 12rem;
    object-fit: cover;
    border-bottom: 2px solid #f0f0f0;
}

.card-content {
    padding: 1rem;
}

.card-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
}

.card-content p {
    color: #4a5568;
    margin-top: 0.5rem;
}
</style>