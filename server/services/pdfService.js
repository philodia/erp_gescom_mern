const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');
const { formatDate, formatCurrency } = require('../utils/formatters');

class PdfService {
  /**
   * Remplace les placeholders dans un template HTML avec une logique plus avancée
   * gérant les boucles #each, les conditions #if et les helpers.
   * @param {string} template - Le contenu du template HTML.
   * @param {object} data - Un objet contenant les données à injecter.
   * @returns {string} Le template HTML avec les données injectées.
   */
  _populateTemplate(template, data) {
    // Helpers simples pour les calculs et le formatage
    const helpers = {
      formatDate,
      formatCurrency,
      multiply: (a, b) => a * b,
      isLessThanOrEqual: (a, b) => a <= b,
    };

    // Remplacement des helpers comme {{formatDate dateEcheance 'DD/MM/YYYY'}}
    template = template.replace(/\{\{formatDate\s+([^\s}]+)\s+'([^']*)'\}\}/g, (match, key, format) => {
      const date = this._resolvePath(data, key);
      return date ? helpers.formatDate(new Date(date), format) : '';
    });

    template = template.replace(/\{\{formatCurrency\s+([^\s}]+)\s+'([^']*)'\}\}/g, (match, key, currency) => {
      const amount = this._resolvePath(data, key);
      return typeof amount === 'number' ? helpers.formatCurrency(amount, currency) : '0';
    });

    template = template.replace(/\{\{multiply\s+([^\s}]+)\s+([^\s}]+)\}\}/g, (match, key1, key2) => {
      const val1 = this._resolvePath(data, key1);
      const val2 = this._resolvePath(data, key2);
      return typeof val1 === 'number' && typeof val2 === 'number' ? helpers.multiply(val1, val2) : '0';
    });

    // Remplacement des conditions #if
    template = template.replace(/\{\{#if\s+([^\s}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
      return this._resolvePath(data, key) ? content : '';
    });

    template = template.replace(/\{\{#if\s+\(isLessThanOrEqual\s+([^\s}]+)\s+([^\s}]+)\)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key1, key2, content) => {
      const val1 = this._resolvePath(data, key1);
      const val2 = this._resolvePath(data, key2);
      return helpers.isLessThanOrEqual(val1, val2) ? content : '';
    });

    // Remplacement des boucles #each
    template = template.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, block) => {
      const list = this._resolvePath(data, key);
      if (!Array.isArray(list)) return '';
      let result = '';
      list.forEach((item, index) => {
        // Crée un contexte pour chaque item, incluant les helpers et l'index
        const itemContext = { ...item, '@index': index, '@index_1': index + 1, 'this': item };
        result += this._populateTemplate(block, { ...data, ...itemContext });
      });
      return result;
    });

    // Remplacement des variables simples {{variable.path}}
    template = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = this._resolvePath(data, key.trim());
      return value !== undefined ? value : '';
    });

    return template;
  }

  /**
   * Résout un chemin de clé dans un objet de données (ex: 'client.adresse.ville').
   */
  _resolvePath(object, path) {
    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), object);
  }

  /**
   * Génère un PDF à partir d'un template HTML et de données.
   * @param {string} templateName - Le nom du fichier de template (ex: 'facture.html').
   * @param {object} data - Les données à injecter dans le template.
   * @returns {Promise<Buffer>} Le buffer du fichier PDF généré.
   */
  async generatePdf(templateName, data) {
    let browser = null;
    try {
      // 1. Lire le template HTML
      const templatePath = path.join(__dirname, '..', 'templates', 'pdf', templateName);
      const htmlTemplate = await fs.readFile(templatePath, 'utf-8');

      // 2. Injecter les données
      const finalHtml = this._populateTemplate(htmlTemplate, data);

      // 3. Lancer Puppeteer
      browser = await puppeteer.launch({
        headless: true, // "true" pour le serveur, "false" pour voir le navigateur
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Requis pour les environnements Linux/Docker
      });

      const page = await browser.newPage();

      // 4. Charger le HTML dans la page
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      // 5. Générer le PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Important pour que les couleurs de fond soient incluses
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      return pdfBuffer;
    } catch (error) {
      console.error(`❌ Erreur lors de la génération du PDF pour ${templateName}:`, error);
      throw new Error('Impossible de générer le PDF.');
    } finally {
      // 6. Toujours fermer le navigateur
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PdfService();
