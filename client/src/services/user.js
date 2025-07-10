import api from './api';

/**
 * Service pour toutes les opérations CRUD sur les utilisateurs.
 */

/**
 * Récupère les informations d'un utilisateur spécifique depuis le backend.
 * @param {string} userId - L'ID de l'utilisateur.
 * @returns {Promise<object>} Les données de l'utilisateur.
 */
const getById = async (userId) => {
    const response = await api.get(`/utilisateurs/${userId}`);
    return response.data;
};

/**
 * Récupère la liste de tous les utilisateurs.
 * @returns {Promise<Array<object>>} La liste des utilisateurs.
 */
const getAll = async () => {
    const response = await api.get('/utilisateurs');
    return response.data;
};

/**
 * Met à jour les informations d'un utilisateur spécifique.
 * @param {string} userId - L'ID de l'utilisateur.
 * @param {object} userData - Les nouvelles données de l'utilisateur.
 * @returns {Promise<object>} Les données mises à jour de l'utilisateur.
 */
const update = async (userId, userData) => {
    const response = await api.put(`/utilisateurs/${userId}`, userData);
    return response.data;
};

/**
 * Crée un nouvel utilisateur (action réservée à l'admin).
 * @param {object} userData - Les données du nouvel utilisateur.
 * @returns {Promise<object>} Les données du nouvel utilisateur créé.
 */
const create = async (userData) => {
    const response = await api.post('/utilisateurs', userData);
    return response.data;
}

/**
 * Supprime (désactive) un utilisateur.
 * @param {string} userId - L'ID de l'utilisateur.
 * @returns {Promise<object>} La réponse de l'API.
 */
const remove = async (userId) => {
    const response = await api.delete(`/utilisateurs/${userId}`);
    return response.data;
}


const userService = {
    getById,
    getAll,
    update,
    create,
    remove,
};

export default userService;