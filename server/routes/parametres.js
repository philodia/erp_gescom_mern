const express = require('express');
const router = express.Router();
const { ROLES } = require('../utils/constants');

// --- Importer les contrôleurs ---
const {
  getParametres,
  updateParametres,
  updateLogo,
} = require('../controllers/parametresController');

// --- Importer les middlewares ---
const { protect, authorize } = require('../middleware/auth');
const { uploadLogo, handleUploadErrors } = require('../middleware/upload');
// On peut ajouter une règle de validation pour les paramètres
const { parametresValidationRules, validate } = require('../middleware/validation');

// --- Appliquer le middleware 'protect' à toutes les routes de ce module ---
router.use(protect);


// --- Route principale pour les données de l'entreprise ---
router.route('/')
  /**
   * @route   GET /api/parametres
   * @desc    Récupérer les paramètres de l'entreprise.
   * @access  Private
   */
  .get(getParametres)

  /**
   * @route   PUT /api/parametres
   * @desc    Mettre à jour les paramètres textuels.
   * @access  Private/Admin
   */
  .put(
    authorize(ROLES.ADMIN),
    parametresValidationRules(), // <-- AJOUT: Valider les données entrantes
    validate,
    updateParametres
  );


// --- Route spécifique pour l'upload du logo ---
router.put(
  '/logo',
  authorize(ROLES.ADMIN),
  uploadLogo,
  handleUploadErrors,
  updateLogo
);


module.exports = router;