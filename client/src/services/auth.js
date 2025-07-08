import api from './api'; // Importe notre instance Axios pré-configurée
import { LOCAL_STORAGE_KEYS } from '../utils/constants'; // Importer les constantes

/**
 * Service d'authentification.
 * Ce service est une couche d'abstraction pure pour les appels API liés à l'authentification.
 * Il ne gère PAS l'état ou le localStorage ; cette responsabilité est laissée au AuthContext.
 */

/**
 * Envoie une requête d'inscription au backend.
 * @param {object} userData - Les données de l'utilisateur.
 * @param {string} userData.nom
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} [userData.role]
 * @returns {Promise<object>} La réponse de l'API (contenant le token et l'utilisateur).
 */
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Le service retourne directement les données de la réponse
  return response.data;
};

/**
 * Envoie une requête de connexion au backend.
 * @param {object} credentials - Les identifiants de l'utilisateur.
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<object>} La réponse de l'API (contenant le token et l'utilisateur).
 */
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Récupère les informations de l'utilisateur actuellement connecté depuis le backend.
 * L'intercepteur d'axios se charge d'ajouter le token à la requête.
 * @returns {Promise<object>} Les données de l'utilisateur.
 */
const getMe = async () => {
    // La route est /utilisateurs/me, pas /auth/me
    const response = await api.get('/utilisateurs/me');
    return response.data;
}

/**
 * Service de stockage de session.
 * Encapsule la logique d'interaction avec le localStorage pour le token.
 */
export const sessionService = {
    getToken: () => {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    },
    setToken: (token) => {
        if (token) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
        }
    },
    removeToken: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    }
};


// On regroupe toutes les fonctions dans un objet pour l'exportation.
const authService = {
  register,
  login,
  getMe,
  // Note: La fonction logout est retirée car elle ne fait pas d'appel API.
  // Sa logique est maintenant entièrement dans le AuthContext et le sessionService.
};

export default authService;