/**
 * Génère un numéro de document séquentiel avec un préfixe et une date.
 * Exemple: FACT-2024-0001
 *
 * @param {string} prefix - Le préfixe du document (ex: 'FACT', 'DEV').
 * @param {number} lastNumber - Le dernier numéro utilisé pour ce type de document.
 * @returns {string} Le nouveau numéro de document.
 */
exports.generateDocumentNumber = (prefix, lastNumber) => {
  const currentYear = new Date().getFullYear();
  const newSequence = (lastNumber + 1).toString().padStart(4, '0'); // '0001', '0002', etc.

  return `${prefix.toUpperCase()}-${currentYear}-${newSequence}`;
};

/**
 * Formate une réponse JSON standard pour les succès.
 *
 * @param {object} res - L'objet de réponse Express.
 * @param {number} statusCode - Le code de statut HTTP.
 * @param {string} message - Un message descriptif.
 * @param {object} [data] - Les données à envoyer dans la réponse.
 * @returns {object} La réponse JSON.
 */
exports.successResponse = (res, statusCode, message, data) => {
  const response = { success: true, message };
  if (data) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Formate une réponse JSON standard pour les erreurs.
 *
 * @param {object} res - L'objet de réponse Express.
 * @param {number} statusCode - Le code de statut HTTP.
 * @param {string} message - Le message d'erreur.
 * @returns {object} La réponse JSON.
 */
exports.errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 * Calcule les totaux (HT, TVA, TTC) à partir des lignes d'un document.
 *
 * @param {Array<object>} lignes - Le tableau des lignes de produits/services.
 *   Chaque ligne doit avoir { quantite, prixUnitaire, tva }.
 * @returns {object} Un objet contenant { totalHT, montantTVA, totalTTC }.
 */
exports.calculateTotals = (lignes) => {
  let totalHT = 0;
  let montantTVA = 0;
  lignes.forEach(ligne => {
    const prixLigneHT = ligne.quantite * ligne.prixUnitaire;
    totalHT += prixLigneHT;
    // Le taux de TVA est en pourcentage (ex: 18 pour 18%)
    const tauxTVA = ligne.tva || 18;
    montantTVA += prixLigneHT * (tauxTVA / 100);
  });

  // Utiliser Math.round pour éviter les problèmes d'arrondi avec les nombres flottants
  totalHT = Math.round(totalHT * 100) / 100;
  montantTVA = Math.round(montantTVA * 100) / 100;
  const totalTTC = Math.round((totalHT + montantTVA) * 100) / 100;
  return { totalHT, montantTVA, totalTTC };
};

/**
 * Génère une chaîne de caractères aléatoire de la longueur spécifiée.
 * Utile pour les tokens de réinitialisation de mot de passe, etc.
 *
 * @param {number} length - La longueur de la chaîne à générer.
 * @returns {string} La chaîne aléatoire.
 */
exports.generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * "Slugify" une chaîne de caractères.
 * Remplace les espaces et les caractères spéciaux par des tirets.
 * Utile pour créer des URLs propres.
 *
 * @param {string} text - Le texte à convertir.
 * @returns {string} Le texte "slugifié".
 */
exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Remplace les espaces par -
    .replace(/[^\w\-]+/g, '')       // Supprime les caractères non-alphanumériques (sauf -)
    .replace(/\-\-+/g, '-')         // Remplace plusieurs - par un seul
    .replace(/^-+/, '')             // Supprime les - au début
    .replace(/-+$/, '');            // Supprime les - à la fin
};
