import api from './api';

/**
 * Service d'authentification.
 * Gère les appels API pour l'inscription, la connexion et la récupération
 * de l'utilisateur actuellement authentifié.
 */

/**
 * Envoie une requête d'inscription au backend.
 * @param {object} userData - { nom, email, password, role? }.
 * @returns {Promise<object>} La réponse de l'API (token et utilisateur).
 */
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Retourner directement les données est plus pratique pour le code appelant.
  return response.data;
};

/**
 * Envoie une requête de connexion au backend.
 * @param {object} credentials - { email, password }.
 * @returns {Promise<object>} La réponse de l'API (token et utilisateur).
 */
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Récupère les informations de l'utilisateur actuellement connecté via son token.
 * @returns {Promise<object>} Les données de l'utilisateur.
 */
const getMe = async () => {
    const response = await api.get('/utilisateurs/me');
    return response.data;
}


const authService = {
  register,
  login,
  getMe,
  // Note: logout et sessionService ont été retirés car ils sont gérés
  // par le AuthContext et le storageService.
};

export default authService;