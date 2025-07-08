/**
 * Ce fichier centralise la configuration pour le middleware CORS (Cross-Origin Resource Sharing).
 * Il définit quelles origines sont autorisées à accéder à l'API, ce qui est une mesure de sécurité cruciale.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

// 1. Définir une liste blanche (whitelist) des origines autorisées.
const allowedOrigins = [
  // L'URL de votre client React en développement
  'http://localhost:3000',

  // Ajoutez ici les URLs de votre application en production et en pré-production
  // process.env.FRONTEND_URL_PROD,
  // process.env.FRONTEND_URL_STAGING,
];

// 2. Configurer les options de CORS.
const corsOptions = {
  /**
   * La fonction 'origin' est la manière la plus flexible et la plus sécurisée
   * de gérer une liste blanche.
   *
   * @param {string} origin - L'origine de la requête entrante.
   * @param {function} callback - La fonction de callback à appeler.
   */
  origin: (origin, callback) => {
    // En développement, on peut être plus permissif pour faciliter les tests.
    // La condition `!origin` autorise les requêtes qui n'ont pas d'origine,
    // comme celles venant de Postman ou d'autres outils d'API.
    if (process.env.NODE_ENV === 'development' && !origin) {
      return callback(null, true);
    }
    
    // Si l'origine de la requête est dans notre liste blanche, on l'autorise.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Sinon, on la refuse avec une erreur.
      callback(new Error('L\'accès à cette ressource est interdit par la politique CORS.'));
    }
  },

  /**
   * Les méthodes HTTP que nous autorisons.
   */
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  /**
   * Les en-têtes que le client est autorisé à envoyer.
   * 'Authorization' est crucial pour les tokens JWT.
   */
  allowedHeaders: ['Content-Type', 'Authorization'],

  /**
   * Permet au client d'envoyer des informations d'identification (comme les cookies ou les tokens d'autorisation).
   */
  credentials: true,

  /**
   * Code de statut à renvoyer pour les requêtes de pré-vérification (preflight) OPTIONS.
   * 204 No Content est une valeur standard et efficace.
   */
  optionsSuccessStatus: 204
};


module.exports = corsOptions;