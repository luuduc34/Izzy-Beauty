// src/plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons'; // Importez ici les icônes que vous voulez

// Ajoutez les icônes à la bibliothèque
library.add(faUser, faHome);

export default FontAwesomeIcon;
