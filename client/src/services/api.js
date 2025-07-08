import axios from 'axios';
import config from '../utils/config'; // Importer notre configuration globale
import { LOCAL_STORAGE_KEYS } from '../utils/constants'; // Importer nos constantes

// 1. Création de l'instance Axios en utilisant la configuration centralisée
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Mise en place d'un intercepteur de requête
api.interceptors.request.use(
  (axiosConfig) => {
    // Utiliser la clé de token depuis nos constantes
    const tokenKey = LOCAL_STORAGE_KEYS.TOKEN;
    const token = localStorage.getItem(tokenKey);

    if (token) {
      axiosConfig.headers['Authorization'] = `Bearer ${token}`;
    }

    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Mise en place d'un intercepteur de réponse pour la gestion globale des erreurs
api.interceptors.response.use(
  (response) => {
    // Si la réponse est réussie, on la retourne.
    // On peut aussi choisir de ne retourner que response.data pour simplifier le code
    // dans les services et les slices Redux.
    return response;
  },
  (error) => {
    // Gérer le cas où la requête échoue à cause d'un problème réseau
    if (!error.response) {
      console.error('Erreur réseau ou serveur inaccessible:', error.message);
      // On pourrait déclencher une notification globale pour l'utilisateur ici.
    }

    // Gérer les erreurs 401 (Non autorisé)
    if (error.response && error.response.status === 401) {
      const tokenKey = LOCAL_STORAGE_KEYS.TOKEN;
      // On vérifie qu'il y avait bien un token. Si non, l'utilisateur n'était
      // simplement pas connecté, ce qui n'est pas une erreur à gérer ici.
      if (localStorage.getItem(tokenKey)) {
        console.warn('Token invalide ou expiré. Déconnexion de l\'utilisateur.');
        localStorage.removeItem(tokenKey);
        // Rediriger vers la page de login, sauf si on y est déjà.
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'; // href pour un rechargement complet
        }
      }
    }
    
    // On rejette l'erreur pour qu'elle puisse être traitée par le code appelant
    // (ex: dans le `rejectWithValue` d'un thunk Redux).
    return Promise.reject(error);
  }
);

// 4. Exporter l'instance configurée
export default api;