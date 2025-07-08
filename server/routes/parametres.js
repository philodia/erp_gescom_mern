const express = require('express');
const router = express.Router();
const { ROLES } = require('../utils/constants');

// 1. Importer les fonctions du contrôleur
const {
  getParametres,
  updateParametres,
  updateLogo, // <-- Importer le nouveau contrôleur
} = require('../controllers/parametresController');

// 2. Importer les middlewares
const { protect, authorize } = require('../middleware/auth');
const { uploadLogo, handleUploadErrors } = require('../middleware/upload'); // <-- Importer les middlewares d'upload

// --- Application globale du middleware 'protect' ---
// Toutes les routes de ce fichier nécessiteront une authentification.
router.use(protect);


// 3. Définir la route principale pour les données textuelles
router.route('/')
  /**
   * @route   GET /api/parametres
   * @desc    Récupérer les paramètres de l'entreprise.
   * @access  Private (tous les utilisateurs connectés)
   */
  .get(getParametres)

  /**
   * @route   PUT /api/parametres
   * @desc    Mettre à jour les paramètres textuels de l'entreprise.
   * @access  Private/Admin
   */
  .put(authorize(ROLES.ADMIN), updateParametres);


// 4. Définir une route spécifique pour l'upload du logo
/**
 * @route   PUT /api/parametres/logo
 * @desc    Mettre à jour le logo de l'entreprise.
 * @access  Private/Admin
 *
 * Chaîne de middlewares:
 * 1. authorize: Vérifie que l'utilisateur est un Admin.
 * 2. uploadLogo: Le middleware Multer qui traite le fichier uploadé.
 * 3. handleUploadErrors: Attrape les erreurs spécifiques à l'upload (taille, type).
 * 4. updateLogo: Le contrôleur qui traite les informations du fichier.
 */
router.put(
  '/logo',
  authorize(ROLES.ADMIN),
  uploadLogo,
  handleUploadErrors,
  updateLogo
);


// 5. Exporter le routeur
module.exports = router;