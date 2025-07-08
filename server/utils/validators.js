const { body, param, validationResult } = require('express-validator');

/**
 * Middleware qui vérifie le résultat de la validation.
 * S'il y a des erreurs, il les formate et renvoie une réponse 400.
 * Sinon, il passe au prochain middleware.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Formate les erreurs pour être plus lisibles côté client
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({
    message: "Les données fournies sont invalides.",
    errors: extractedErrors,
  });
};

// --- RÈGLES DE VALIDATION SPÉCIFIQUES ---

// Validation pour la création d'un utilisateur (register)
const userValidationRules = () => {
  return [
    body('nom').trim().not().isEmpty().withMessage('Le nom est obligatoire.'),
    body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  ];
};

// Validation pour la connexion (login)
const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
        body('password').not().isEmpty().withMessage('Le mot de passe est obligatoire.'),
    ];
};

// Validation pour la création/mise à jour d'un client
const clientValidationRules = () => {
    return [
        body('nom').trim().not().isEmpty().withMessage('Le nom du client est obligatoire.'),
        body('email').optional({ checkFalsy: true }).isEmail().withMessage('L\'email fourni est invalide.').normalizeEmail(),
        body('telephone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Le numéro de téléphone est invalide.'),
        body('type').isIn(['Prospect', 'Client']).withMessage('Le type doit être "Prospect" ou "Client".')
    ];
};

// Validation pour la création/mise à jour d'une facture
const factureValidationRules = () => {
    return [
        body('client').isMongoId().withMessage('L\'ID du client est invalide.'),
        body('dateEcheance').isISO8601().toDate().withMessage('La date d\'échéance est invalide.'),
        body('lignes').isArray({ min: 1 }).withMessage('La facture doit contenir au moins une ligne.'),
        body('lignes.*.produit').isMongoId().withMessage('Chaque ligne doit avoir un produit valide.'),
        body('lignes.*.quantite').isNumeric({ min: 1 }).withMessage('La quantité doit être un nombre positif.'),
        body('lignes.*.prixUnitaire').isNumeric({ min: 0 }).withMessage('Le prix unitaire doit être un nombre positif.'),
    ]
};

// Validation pour les IDs dans les paramètres d'URL (ex: /api/clients/:id)
const idParamValidationRules = () => {
    return [
        param('id').isMongoId().withMessage('L\'ID fourni dans l\'URL est invalide.')
    ];
};

// Exporter les règles et le middleware de validation
module.exports = {
  validate,
  userValidationRules,
  loginValidationRules,
  clientValidationRules,
  factureValidationRules,
  idParamValidationRules,
};
