import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import Homepage from './components/Homepage.vue';
import Services from './components/Services.vue';
import ServiceDetail from './components/ServiceDetail.vue';
import Profile from './components/Profile.vue';
import { auth } from './firebaseConfig';
import FontAwesomeIcon from './plugins/fontawesome';

const routes = [
    { path: '/', component: Homepage },
    { path: '/services', component: Services },
    { path: '/service/:id', component: ServiceDetail, props: true },
    { path: '/profile', component: Profile, meta: { requiresAuth: true },},
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = auth.currentUser;
  
    if (requiresAuth && !isAuthenticated) {
      next('/');
    } else {
      next();
    }
  });

  const app = createApp(App);
  app.component('font-awesome-icon', FontAwesomeIcon); // Enregistrez Font Awesome comme composant global
  app.use(router);
  app.mount('#app');
