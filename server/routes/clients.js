const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

// 2. Importer les middlewares
const { protect, authorize } = require('../middleware/auth');
const { clientValidationRules, idParamValidationRules, validate } = require('../middleware/validation');
const { ROLES } = require('../utils/constants');


// 3. Appliquer le middleware 'protect' à TOUTES les routes de ce fichier.
router.use(protect);


// 4. Définir les routes pour l'URL de base ('/')
router.route('/')
  /**
   * @route   GET /api/clients
   * @desc    Récupérer la liste de tous les clients (avec pagination/recherche).
   * @access  Private
   */
  .get(getAllClients)
  
  /**
   * @route   POST /api/clients
   * @desc    Créer un nouveau client.
   * @access  Private (Admin, Commercial)
   */
  .post(
    authorize(ROLES.ADMIN, ROLES.COMMERCIAL), 
    clientValidationRules(), // Valider les données du corps de la requête
    validate, 
    createClient
  );


// 5. Définir les routes pour les URLs spécifiques à un client ('/:id')
router.route('/:id')
  /**
   * @route   GET /api/clients/:id
   * @desc    Récupérer les détails d'un client spécifique.
   * @access  Private
   */
  .get(
    idParamValidationRules(), // Valider que l'ID est un MongoID valide
    validate,
    getClientById
  )
  
  /**
   * @route   PUT /api/clients/:id
   * @desc    Mettre à jour un client.
   * @access  Private (Admin, Commercial)
   */
  .put(
    authorize(ROLES.ADMIN, ROLES.COMMERCIAL),
    idParamValidationRules(),
    clientValidationRules(), // Valide aussi le corps de la requête de mise à jour
    validate,
    updateClient
  )
  
  /**
   * @route   DELETE /api/clients/:id
   * @desc    Désactiver (soft delete) un client.
   * @access  Private (Admin)
   */
  .delete(
    authorize(ROLES.ADMIN),
    idParamValidationRules(),
    validate,
    deleteClient
  );


// 6. Exporter le routeur
module.exports = router;