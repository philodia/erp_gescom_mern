/**
 * Ce fichier centralise la configuration pour le service d'envoi d'emails.
 * Il charge les variables sensibles depuis l'environnement.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const emailConfig = {
  /**
   * Configuration du transporteur SMTP (via Nodemailer).
   * Ces informations sont utilisées pour se connecter au serveur d'envoi d'emails.
   */
  smtp: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    // La connexion est sécurisée si le port est 465, sinon STARTTLS est utilisé.
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  /**
   * Adresse d'expédition par défaut.
   * C'est le nom et l'adresse qui apparaîtront dans le champ "De" / "From" de l'email.
   * ex: "Mon ERP <no-reply@mon-erp.sn>"
   */
  from: process.env.EMAIL_FROM,

  /**
   * Options supplémentaires.
   */
  options: {
    // Si vous utilisez un service comme Ethereal en développement, cette option est utile.
    // Pour des services comme SendGrid ou Mailgun en production, ces options peuvent être différentes.
    previewEmail: process.env.NODE_ENV === 'development',
  },

  // Vous pourriez ajouter ici des configurations pour d'autres services d'email (API-based)
  // sendgrid: {
  //   apiKey: process.env.SENDGRID_API_KEY,
  // },
  // mailgun: {
  //   apiKey: process.env.MAILGUN_API_KEY,
  //   domain: process.env.MAILGUN_DOMAIN,
  // }
};

// Vérification de la configuration au démarrage
if (!emailConfig.smtp.host || !emailConfig.smtp.auth.user || !emailConfig.from) {
  // On affiche un avertissement plutôt qu'une erreur fatale,
  // car l'application peut fonctionner sans l'envoi d'emails (contrairement à JWT).
  console.warn("AVERTISSEMENT: La configuration pour l'envoi d'emails est incomplète. Les emails ne pourront pas être envoyés.");
}

module.exports = emailConfig;