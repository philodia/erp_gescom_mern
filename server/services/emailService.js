const nodemailer = require('nodemailer');
const fs = require('fs/promises');
const path = require('path');
const emailConfig = require('../config/email'); // Importer notre configuration
const { logger } = require('../middleware/logging'); // Importer notre logger

class EmailService {
  constructor() {
    // Le service est maintenant initialisé avec la configuration centralisée.
    // Il n'y a plus de `process.env` dans ce fichier.
    this.transporter = nodemailer.createTransport(emailConfig.smtp);
    this.from = emailConfig.from;
    this.preview = emailConfig.options.previewEmail;
  }

  /**
   * Remplace les placeholders dans un template HTML.
   * (La logique interne de cette fonction reste la même)
   * @param {string} template - Le contenu du template HTML.
   * @param {object} data - Un objet contenant les données à injecter.
   * @returns {string} Le template HTML avec les données injectées.
   */
  _populateTemplate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value = data;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return match;
        }
      }
      return value;
    });
  }

  /**
   * Envoie un email en utilisant un template HTML.
   * @param {string} to - L'adresse email du destinataire.
   * @param {string} subject - L'objet de l'email.
   * @param {string} templateName - Le nom du fichier de template (ex: 'welcome.html').
   * @param {object} data - Les données à injecter dans le template.
   * @param {Array<object>} [attachments] - Les pièces jointes (optionnel).
   */
  async sendEmail(to, subject, templateName, data, attachments = []) {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'email', templateName);
      let htmlContent = await fs.readFile(templatePath, 'utf-8');
      const templateData = {
        ...data,
        appName: 'ERP Commercial Sénégal',
        currentYear: new Date().getFullYear(),
        entreprise: data.entreprise || { nom: 'ERP Commercial Sénégal' }, // Fournir une valeur par défaut
      };
      htmlContent = this._populateTemplate(htmlContent, templateData);
      const mailOptions = {
        from: this.from, // Utilise la valeur 'from' de la config
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: attachments,
      };
      const info = await this.transporter.sendMail(mailOptions);

      // Utiliser notre logger au lieu de console.log
      logger.info(`Email envoyé avec succès à ${to}. Message ID: ${info.messageId}`);

      // Utiliser la configuration pour décider d'afficher le lien de preview
      if (this.preview && nodemailer.getTestMessageUrl(info)) {
          logger.info(`Lien de prévisualisation (Ethereal): ${nodemailer.getTestMessageUrl(info)}`);
      }
      return { success: true, info };
    } catch (error) {
      // Utiliser notre logger pour les erreurs
      logger.error(`Erreur lors de l'envoi de l'email à ${to}: ${error.message}`, {
        to,
        subject,
        templateName,
        stack: error.stack
      });
      // L'échec de l'envoi d'email ne doit pas faire planter l'application
      return { success: false, error };
    }
  }
}

module.exports = new EmailService();
