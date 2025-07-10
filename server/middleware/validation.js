const { body, param, validationResult } = require('express-validator');
const { ROLES, TIERS_TYPES, CURRENCIES } = require('../utils/constants'); // Importer plus de constantes

/**
 * Middleware qui agrège les résultats de la validation et renvoie les erreurs.
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    message: "Les données fournies sont invalides.",
    errors: extractedErrors,
  });
};


// --- RÈGLES DE VALIDATION PAR RESSOURCE ---

exports.userValidationRules = () => {
  return [
    body('nom').trim().not().isEmpty().withMessage('Le nom est obligatoire.'),
    body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    body('role').optional().isIn(Object.values(ROLES)).withMessage('Le rôle fourni est invalide.'),
  ];
};

exports.loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Veuillez fournir un email valide.').normalizeEmail(),
        body('password').not().isEmpty().withMessage('Le mot de passe est obligatoire.'),
    ];
};

exports.clientValidationRules = () => {
    return [
        body('nom').trim().not().isEmpty().withMessage('Le nom du client est obligatoire.'),
        body('email').optional({ checkFalsy: true }).isEmail().withMessage('L\'email fourni est invalide.').normalizeEmail(),
        body('telephone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Le numéro de téléphone est invalide.'),
        // Utiliser les constantes pour la validation
        body('type').isIn([TIERS_TYPES.PROSPECT, TIERS_TYPES.CLIENT]).withMessage(`Le type doit être "${TIERS_TYPES.PROSPECT}" ou "${TIERS_TYPES.CLIENT}".`)
    ];
};

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

// --- RÈGLE AJOUTÉE ---
/**
 * Validation pour les paramètres de l'entreprise.
 */
exports.parametresValidationRules = () => {
    return [
        body('nomEntreprise')
            .not().isEmpty({ ignore_whitespace: true }).withMessage("Le nom de l'entreprise est obligatoire.")
            .trim(),
        
        body('email')
            .optional({ checkFalsy: true })
            .isEmail().withMessage("L'email fourni est invalide.")
            .normalizeEmail(),
        
        body('siteWeb')
            .optional({ checkFalsy: true })
            .isURL().withMessage("L'URL du site web est invalide.")
            .trim(),
        
        body('devisePrincipale')
            .optional()
            .isIn(Object.values(CURRENCIES)).withMessage('La devise fournie n\'est pas supportée.')
    ];
};


/* Validation pour la création/mise à jour d'un fournisseur.
 */
exports.fournisseurValidationRules = () => {
    return [
        body('nom')
            .trim()
            .not().isEmpty().withMessage('Le nom du fournisseur est obligatoire.'),
        
        body('email')
            .optional({ checkFalsy: true }) // Le champ est optionnel
            .isEmail().withMessage('L\'email principal est invalide.')
            .normalizeEmail(),
        
        // Valider l'email du contact principal, qui est un champ imbriqué
        body('contactPrincipal.email')
            .optional({ checkFalsy: true })
            .isEmail().withMessage('L\'email du contact principal est invalide.')
            .normalizeEmail(),

        body('evaluation')
            .optional({ checkFalsy: true })
            .isInt({ min: 1, max: 5 }).withMessage("L'évaluation doit être un nombre entier entre 1 et 5."),
    ];
};


exports.idParamValidationRules = () => {
    return [
        param('id').isMongoId().withMessage('L\'ID fourni dans l\'URL est invalide.')
    ];
};


// Exporter toutes les règles
module.exports.parametresValidationRules = exports.parametresValidationRules;