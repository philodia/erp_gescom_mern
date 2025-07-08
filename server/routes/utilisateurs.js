const express = require('express');
const router = express.Router();
const { ROLES } = require('../utils/constants'); // Importer les rôles pour la validation

// 1. Importer les fonctions du contrôleur
const {
  createUser, // Nouvelle fonction
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
} = require('../controllers/utilisateurController');

// 2. Importer les middlewares de sécurité et de validation
const { protect, authorize } = require('../middleware/auth');
const { userValidationRules, idParamValidationRules, validate } = require('../middleware/validation');


// --- Application globale du middleware 'protect' ---
// Toutes les routes définies dans ce fichier nécessiteront une authentification.
router.use(protect);


// --- Route pour l'utilisateur connecté ---
// Doit rester avant '/:id' pour ne pas être interprétée comme un ID.
router.get('/me', getMe);


// --- Routes d'Administration (réservées aux Admins) ---

router.route('/')
  /**
   * @route   GET /api/utilisateurs
   * @desc    Récupérer la liste de tous les utilisateurs.
   * @access  Private/Admin
   */
  .get(authorize(ROLES.ADMIN), getAllUsers)
  
  /**
   * @route   POST /api/utilisateurs
   * @desc    Créer un nouvel utilisateur (par un admin).
   * @access  Private/Admin
   */
  .post(
    authorize(ROLES.ADMIN), 
    userValidationRules(), // Valide les données du nouvel utilisateur
    validate, 
    createUser
  );


router.route('/:id')
  /**
   * @route   GET /api/utilisateurs/:id
   * @desc    Récupérer un utilisateur par son ID.
   * @access  Private/Admin
   */
  .get(
    authorize(ROLES.ADMIN), 
    idParamValidationRules(), // Valide que l'ID est un MongoID valide
    validate, 
    getUserById
  )
  
  /**
   * @route   PUT /api/utilisateurs/:id
   * @desc    Mettre à jour un utilisateur.
   * @access  Private/Admin
   */
  .put(
    authorize(ROLES.ADMIN), 
    idParamValidationRules(), 
    validate, 
    updateUser
  )
  
  /**
   * @route   DELETE /api/utilisateurs/:id
   * @desc    Désactiver (soft delete) un utilisateur.
   * @access  Private/Admin
   */
  .delete(
    authorize(ROLES.ADMIN), 
    idParamValidationRules(), 
    validate, 
    deleteUser
  );


// 3. Exporter le routeur
module.exports = router;