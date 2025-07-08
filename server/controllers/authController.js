const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/auth'); // Importer la config JWT
const { logger } = require('../middleware/logging'); // Importer le logger
const emailService = require('../services/emailService'); // Importer le service email
const { successResponse } = require('../utils/helpers'); // Importer un helper pour les réponses

/**
 * Helper function pour générer un token JWT.
 * Utilise la configuration centralisée.
 * @param {string} id - L'ID de l'utilisateur.
 * @returns {string} Le token JWT signé.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Envoie une réponse de succès avec token et informations utilisateur.
 * @param {object} res - L'objet de réponse Express.
 * @param {number} statusCode - Le code de statut HTTP.
 * @param {string} message - Le message de succès.
 * @param {object} user - L'objet utilisateur.
 */
const sendTokenResponse = (res, statusCode, message, user) => {
  const token = generateToken(user._id);
  const userData = {
    _id: user._id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  };
  
  // Utiliser notre helper de réponse standardisé
  successResponse(res, statusCode, message, { token, user: userData });
};

//---------------------------------------------------------------------

/**
 * @desc    Enregistrer (créer) un nouvel utilisateur.
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  const { nom, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà.' });
    }

    const user = await User.create({ nom, email, password, role });
    
    // Envoyer l'email de bienvenue en arrière-plan
    emailService.sendEmail(
      user.email,
      'Bienvenue sur ERP Commercial Sénégal !',
      'welcome.html',
      { 
        user: { nom: user.nom, email: user.email, role: user.role },
        loginUrl: process.env.CLIENT_URL || 'http://localhost:3000/login' 
      }
    ).catch(err => logger.error(`Échec de l'envoi de l'email de bienvenue à ${user.email}`, { error: err }));
    
    logger.info(`Nouvel utilisateur enregistré : ${user.email} (Rôle: ${user.role})`);
    sendTokenResponse(res, 201, 'Utilisateur créé avec succès.', user);

  } catch (error) {
    // L'erreur sera attrapée par le errorHandler global
    next(error); 
  }
};

//---------------------------------------------------------------------

/**
 * @desc    Authentifier un utilisateur existant et obtenir un token.
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // La validation initiale est maintenant gérée par le middleware `validation.js`
    
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      logger.warn(`Tentative de connexion échouée pour l'email: ${email}`);
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    logger.info(`Utilisateur connecté avec succès: ${user.email}`);
    sendTokenResponse(res, 200, 'Connexion réussie.', user);

  } catch (error) {
    // L'erreur sera attrapée par le errorHandler global
    next(error); 
  }
};