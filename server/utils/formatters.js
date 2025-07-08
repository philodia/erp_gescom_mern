const { CURRENCIES } = require('./constants');

/**
 * Formate un nombre en une chaîne de caractères monétaire avec le symbole de la devise.
 * Gère spécifiquement le format français/africain (espace comme séparateur de milliers).
 *
 * @param {number} amount - Le montant à formater.
 * @param {string} currency - Le code ISO de la devise (ex: 'XOF', 'EUR'). Par défaut 'XOF'.
 * @returns {string} Le montant formaté (ex: "1 250 000 XOF").
 */
exports.formatCurrency = (amount, currency = CURRENCIES.XOF) => {
  if (typeof amount !== 'number') {
    return 'N/A';
  }

  // Utilise l'API Intl.NumberFormat pour un formatage localisé et robuste.
  // 'fr-FR' utilise un espace comme séparateur de milliers.
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'decimal', // 'currency' ajouterait le symbole, mais on le gère manuellement pour la position.
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(amount)} ${currency}`;
};

/**
 * Formate un objet Date dans une chaîne de caractères lisible.
 *
 * @param {Date} date - L'objet Date à formater.
 * @param {string} format - Le format de sortie ('DD/MM/YYYY', 'YYYY-MM-DD', etc.).
 * @returns {string} La date formatée.
 */
exports.formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Date invalide';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
  const year = date.getFullYear();

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY HH:mm':
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    // Ajouter d'autres formats si nécessaire
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Formate un numéro de téléphone en un format international plus lisible.
 *
 * @param {string} phoneNumber - Le numéro de téléphone brut.
 * @param {string} countryCode - Le code du pays (ex: '+221').
 * @returns {string} Le numéro formaté.
 */
exports.formatPhoneNumber = (phoneNumber, countryCode = '+221') => {
  if (!phoneNumber) return '';
  // Supprime tous les caractères non numériques
  const digits = phoneNumber.replace(/\D/g, '');
  // Logique simple pour l'exemple
  if (digits.length === 9) { // Format local 771234567
    return `${countryCode} ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return phoneNumber; // Retourne le numéro tel quel s'il ne correspond pas au format attendu
};

/**
 * Tronque un texte à une longueur maximale et ajoute '...'.
 *
 * @param {string} text - Le texte à tronquer.
 * @param {number} maxLength - La longueur maximale.
 * @returns {string} Le texte tronqué.
 */
exports.truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};
