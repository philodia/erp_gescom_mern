/**
 * Ce fichier centralise la configuration liée à l'authentification.
 * Il charge les variables sensibles depuis l'environnement.
 */
// On s'assure que les variables d'environnement sont chargées
// C'est une sécurité si ce fichier est importé avant l'initialisation de dotenv.
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const authConfig = {
  /**
   * Configuration de JSON Web Token (JWT).
   */
  jwt: {
    // Le secret utilisé pour signer et vérifier les tokens.
    // Il DOIT être une longue chaîne de caractères aléatoire et complexe.
    // Il est impératif de le charger depuis les variables d'environnement et non en dur.
    secret: process.env.JWT_SECRET,
    // La durée de validité du token.
    // Exemples de formats: "1h", "7d", "30m".
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  /**
   * Configuration du hachage des mots de passe avec Bcrypt.
   */
  bcrypt: {
    // Le "coût" du hachage. Un nombre plus élevé est plus sécurisé mais plus lent.
    // 10 ou 12 est un bon compromis pour la plupart des applications.
    saltRounds: 10,
  },

  /**
   * Configuration pour l'authentification via des fournisseurs externes (OAuth).
   * À décommenter et compléter si vous ajoutez cette fonctionnalité.
   */
  // oauth: {
  //   google: {
  //     clientID: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     callbackURL: '/api/auth/google/callback'
  //   },
  //   facebook: {
  //     clientID: process.env.FACEBOOK_APP_ID,
  //     clientSecret: process.env.FACEBOOK_APP_SECRET,
  //     callbackURL: '/api/auth/facebook/callback'
  //   }
  // },
};

// Vérification de la présence du secret JWT au démarrage de l'application.
if (!authConfig.jwt.secret) {
  console.error("ERREUR FATALE: La variable d'environnement JWT_SECRET n'est pas définie.");
  // Arrête le processus Node.js si le secret est manquant, car l'application ne peut pas
  // fonctionner de manière sécurisée sans lui.
  process.exit(1);
}

module.exports = authConfig;
