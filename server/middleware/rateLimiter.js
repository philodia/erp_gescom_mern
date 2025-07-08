const rateLimit = require('express-rate-limit');

/**
 * Middleware de limitation de débit de base pour toutes les routes de l'API.
 * Protège contre les attaques DoS de base.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre (par 15 minutes)
  standardHeaders: true, // Renvoie les informations de limite dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*` (ancienne version)
  message: {
    success: false,
    message: 'Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes.',
  },
});

/**
 * Middleware de limitation de débit plus strict, spécifiquement pour les routes sensibles
 * comme la connexion et la réinitialisation de mot de passe.
 * Protège contre les attaques par force brute.
 */
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // Fenêtre de 10 minutes
  max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer après 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});


/**
 * Middleware de limitation de débit pour les opérations de création (POST).
 * Empêche le spamming de création de ressources.
 */
const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Fenêtre de 1 heure
    max: 20, // Limite chaque IP à 20 créations par heure
    message: {
        success: false,
        message: 'Vous avez atteint la limite de création de ressources. Veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = {
  apiLimiter,
  authLimiter,
  createLimiter,
};