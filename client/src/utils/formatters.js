/**
 * Ce module fournit des fonctions utilitaires pour formater les données
 * pour l'affichage côté client.
 */

/**
 * Formate un nombre en une chaîne de caractères monétaire.
 * Utilise l'API Intl.NumberFormat pour un formatage localisé et précis.
 *
 * @param {number|string} amount - Le montant à formater.
 * @param {string} [currency='XOF'] - Le code ISO de la devise.
 * @param {string} [locale='fr-SN'] - La locale pour le formatage.
 * @returns {string} Le montant formaté (ex: "1 250 000 F CFA").
 */
export const formatCurrency = (amount, currency = 'XOF', locale = 'fr-SN') => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return '0 ' + currency; // Retourne une valeur par défaut si l'entrée n'est pas un nombre
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    // Pour le Franc CFA, on préfère souvent ne pas avoir de décimales
    minimumFractionDigits: currency === 'XOF' ? 0 : 2,
    maximumFractionDigits: currency === 'XOF' ? 0 : 2,
  }).format(numericAmount);
};


/**
 * Formate une date (chaîne ISO ou objet Date) en une chaîne lisible.
 *
 * @param {string|Date} dateInput - La date à formater.
 * @param {object} [options] - Les options pour Intl.DateTimeFormat.
 * @returns {string} La date formatée (ex: "15/05/2024").
 */
export const formatDate = (dateInput, options) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  // Options par défaut pour un format court et commun
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date);
};


/**
 * Formate une taille de fichier en octets en une chaîne lisible (Ko, Mo, Go).
 *
 * @param {number} bytes - La taille en octets.
 * @param {number} [decimals=2] - Le nombre de décimales.
 * @returns {string} La taille formatée.
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Octets';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


/**
 * Met la première lettre d'une chaîne de caractères en majuscule.
 *
 * @param {string} string - La chaîne à formater.
 * @returns {string} La chaîne formatée.
 */
export const capitalizeFirstLetter = (string) => {
  if (typeof string !== 'string' || string.length === 0) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};


/**
 * Tronque un texte à une longueur maximale et ajoute '...'.
 *
 * @param {string} text - Le texte à tronquer.
 * @param {number} [maxLength=100] - La longueur maximale avant de tronquer.
 * @returns {string} Le texte tronqué.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '…';
};