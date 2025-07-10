import axios from 'axios';
import config from '../utils/config';
import storageService from './storage'; // <-- Importer notre service de stockage
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// 1. Création de l'instance Axios en utilisant la configuration centralisée
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Intercepteur de REQUÊTE pour ajouter le token d'authentification
api.interceptors.request.use(
  (axiosConfig) => {
    // Utiliser notre storageService pour récupérer le token
    const token = storageService.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    if (token) {
      axiosConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    // Renvoyer une promesse rejetée si la configuration de la requête échoue
    return Promise.reject(error);
  }
);

// 3. Intercepteur de RÉPONSE pour la gestion globale des succès et des erreurs
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit (statut 2xx), on retourne directement les données `response.data`.
    // Cela évite d'avoir à faire `response.data` dans chaque appel de service.
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Cas 1: Erreur réseau ou serveur inaccessible (pas de réponse)
    if (!response) {
      console.error('Erreur réseau ou serveur inaccessible. Veuillez vérifier votre connexion.', error);
      // On pourrait ici déclencher une notification toast globale pour l'utilisateur.
      // toast.error('Erreur réseau. Impossible de joindre le serveur.');
      return Promise.reject(new Error('Erreur réseau.'));
    }

    // Cas 2: Erreur 401 - Non autorisé (token invalide ou expiré)
    // C'est le cas le plus important à gérer globalement.
    if (response.status === 401) {
      // On vérifie qu'un token existait, pour ne pas déconnecter un utilisateur non authentifié.
      if (storageService.getItem(LOCAL_STORAGE_KEYS.TOKEN)) {
        console.warn('Session invalide ou expirée. Déconnexion...');
        // Vider toutes les données de session via le service
        storageService.clear();
        // Redirection forcée vers la page de connexion
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
      }
    }
    
    // Cas 3: Autres erreurs serveur (400, 403, 404, 500...)
    // On ne fait rien de spécial ici. On se contente de rejeter la promesse.
    // L'erreur sera attrapée par le bloc `catch` du code qui a initié l'appel
    // (par exemple, dans un `thunk` Redux ou un `useEffect` de composant).
    // Le message d'erreur est déjà dans `error.response.data.message`.
    console.error(`Erreur API: ${response.status} - ${response.data?.message || error.message}`);

    // Rejeter l'erreur pour que le code appelant puisse la traiter
    return Promise.reject(error);
  }
);

// 4. Exporter l'instance configurée
export default api;