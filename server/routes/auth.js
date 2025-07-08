const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur
const { register, login } = require('../controllers/authController');

// 2. Importer les middlewares nécessaires
const { userValidationRules, loginValidationRules, validate } = require('../middleware/validation');
const { authLimiter, createLimiter } = require('../middleware/rateLimiter');


// 3. Définir les routes avec leurs chaînes de middlewares

/**
 * @desc    Enregistrer un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Chaîne de middlewares:
 * 1. createLimiter: Limite la fréquence de création de nouveaux comptes.
 * 2. userValidationRules: Applique les règles de validation pour l'inscription.
 * 3. validate: Vérifie les résultats de la validation et renvoie les erreurs si nécessaire.
 * 4. register: Le contrôleur final, qui ne s'exécute que si tout est valide.
 */
router.post('/register', createLimiter, userValidationRules(), validate, register);


/**
 * @desc    Authentifier un utilisateur et renvoyer un token
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Chaîne de middlewares:
 * 1. authLimiter: Limite strictement le nombre de tentatives de connexion (protection force brute).
 * 2. loginValidationRules: Applique les règles de validation pour la connexion.
 * 3. validate: Vérifie les résultats.
 * 4. login: Le contrôleur final.
 */
router.post('/login', authLimiter, loginValidationRules(), validate, login);


// Note : Pour les futures routes, on suivrait le même modèle.
// Par exemple, pour un mot de passe oublié :
// const { forgotPasswordLimiter } = require('../middleware/rateLimiter');
// router.post('/forgotpassword', forgotPasswordLimiter, forgotPassword);


// 4. Exporter le routeur
module.exports = router;