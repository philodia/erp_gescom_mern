const { body, param, validationResult } = require('express-validator');
const { ROLES } = require('../utils/constants');

/**
 * Middleware qui agrège les résultats de la validation.
 * S'exécute après les règles de validation dans la chaîne de middlewares.
 * S'il y a des erreurs, il les formate et renvoie une réponse 422.
 * Sinon, il passe au prochain middleware.
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // Formate les erreurs pour être plus lisibles côté client.
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    message: "Les données fournies sont invalides.",
    errors: extractedErrors,
  });
};

// --- RÈGLES DE VALIDATION PAR RESSOURCE ---

// Validation pour l'inscription d'un utilisateur
exports.userValidationRules = () => {
  return [
    body('nom').trim().not().isEmpty().withMessage('Le nom est obligatoire.'),
    body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    body('role').optional().isIn(Object.values(ROLES)).withMessage('Le rôle fourni est invalide.'),
  ];
};

// Validation pour la connexion
exports.loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
        body('password').not().isEmpty().withMessage('Le mot de passe est obligatoire.'),
    ];
};

// Validation pour un client
exports.clientValidationRules = () => {
    return [
        body('nom').trim().not().isEmpty().withMessage('Le nom du client est obligatoire.'),
        body('email').optional({ checkFalsy: true }).isEmail().withMessage('L\'email fourni est invalide.').normalizeEmail(),
        body('telephone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Le numéro de téléphone est invalide.'),
        body('type').isIn(['Prospect', 'Client']).withMessage('Le type doit être "Prospect" ou "Client".')
    ];
};

// Validation pour une facture
exports.factureValidationRules = () => {
    return [
        body('client').isMongoId().withMessage('L\'ID du client est invalide.'),
        body('dateEcheance').isISO8601().toDate().withMessage('La date d\'échéance est invalide.'),
        body('lignes').isArray({ min: 1 }).withMessage('La facture doit contenir au moins une ligne.'),
        body('lignes.*.produit').isMongoId().withMessage('Chaque ligne doit avoir un produit valide.'),
        body('lignes.*.quantite').isFloat({ gt: 0 }).withMessage('La quantité doit être un nombre supérieur à 0.'),
        body('lignes.*.prixUnitaire').isFloat({ gte: 0 }).withMessage('Le prix unitaire doit être un nombre positif.'),
    ];
};

// Validation générique pour un ID MongoDB dans les paramètres d'URL
exports.idParamValidationRules = () => {
    return [
        param('id').isMongoId().withMessage('L\'ID fourni dans l\'URL est invalide.')
    ];
};