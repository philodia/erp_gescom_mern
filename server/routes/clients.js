const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur des clients
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

// 2. Importer les middlewares de sécurité
const { protect, authorize } = require('../middleware/auth');


// 3. Appliquer le middleware 'protect' à TOUTES les routes de ce fichier.
//    Toute requête vers une URL commençant par /api/clients nécessitera un token valide.
//    C'est plus concis que de l'ajouter à chaque route individuellement.
router.use(protect);


// 4. Définir les routes pour l'URL de base ('/')
router.route('/')
  /**
   * @route   GET /api/clients
   * @desc    Récupérer la liste de tous les clients actifs.
   * @access  Private (accessible à tous les rôles une fois connectés)
   */
  .get(getAllClients)
  
  /**
   * @route   POST /api/clients
   * @desc    Créer un nouveau client.
   * @access  Private (réservé aux Admins et Commerciaux)
   */
  .post(authorize('Admin', 'Commercial'), createClient);


// 5. Définir les routes pour les URLs spécifiques à un client ('/:id')
router.route('/:id')
  /**
   * @route   GET /api/clients/:id
   * @desc    Récupérer les détails d'un client spécifique.
   * @access  Private (accessible à tous les rôles)
   */
  .get(getClientById)
  
  /**
   * @route   PUT /api/clients/:id
   * @desc    Mettre à jour un client.
   * @access  Private (réservé aux Admins et Commerciaux)
   */
  .put(authorize('Admin', 'Commercial'), updateClient)
  
  /**
   * @route   DELETE /api/clients/:id
   * @desc    Désactiver (soft delete) un client.
   * @access  Private (réservé aux Admins)
   */
  .delete(authorize('Admin'), deleteClient);


// 6. Exporter le routeur
module.exports = router;