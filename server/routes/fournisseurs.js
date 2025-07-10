const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur
const {
  createFournisseur,
  getAllFournisseurs,
  getFournisseurById,
  updateFournisseur,
  deleteFournisseur,
} = require('../controllers/fournisseurController');

// 2. Importer les middlewares
const { protect, authorize } = require('../middleware/auth');
const { fournisseurValidationRules, idParamValidationRules, validate } = require('../middleware/validation');
const { ROLES } = require('../utils/constants');


// Appliquer le middleware 'protect' à toutes les routes de ce module
router.use(protect);


// Définir les routes pour l'URL de base ('/')
router.route('/')
  /**
   * @route   GET /api/fournisseurs
   * @desc    Récupérer la liste de tous les fournisseurs.
   * @access  Private
   */
  .get(getAllFournisseurs)
  
  /**
   * @route   POST /api/fournisseurs
   * @desc    Créer un nouveau fournisseur.
   * @access  Private (Admin, Commercial)
   */
  .post(
    authorize(ROLES.ADMIN, ROLES.COMMERCIAL),
    fournisseurValidationRules(),
    validate,
    createFournisseur
  );


// Définir les routes pour les URLs spécifiques à un fournisseur ('/:id')
router.route('/:id')
  /**
   * @route   GET /api/fournisseurs/:id
   * @desc    Récupérer les détails d'un fournisseur.
   * @access  Private
   */
  .get(
    idParamValidationRules(),
    validate,
    getFournisseurById
  )
  
  /**
   * @route   PUT /api/fournisseurs/:id
   * @desc    Mettre à jour un fournisseur.
   * @access  Private (Admin, Commercial)
   */
  .put(
    authorize(ROLES.ADMIN, ROLES.COMMERCIAL),
    idParamValidationRules(),
    fournisseurValidationRules(),
    validate,
    updateFournisseur
  )
  
  /**
   * @route   DELETE /api/fournisseurs/:id
   * @desc    Désactiver (soft delete) un fournisseur.
   * @access  Private (Admin)
   */
  .delete(
    authorize(ROLES.ADMIN),
    idParamValidationRules(),
    validate,
    deleteFournisseur
  );


module.exports = router;