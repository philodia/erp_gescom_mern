/**
 * Ce module fournit des fonctions de calcul spécifiques au domaine métier
 * pour une utilisation côté client.
 */

/**
 * Calcule le montant total d'une ligne de document (HT).
 *
 * @param {object} ligne - Un objet représentant une ligne de facture/devis.
 * @param {number} ligne.quantite - La quantité de l'article.
 * @param {number} ligne.prixUnitaire - Le prix unitaire de l'article.
 * @returns {number} Le montant total de la ligne, arrondi à 2 décimales.
 */
export const calculateLigneTotal = (ligne) => {
  const quantite = Number(ligne.quantite) || 0;
  const prixUnitaire = Number(ligne.prixUnitaire) || 0;
  const total = quantite * prixUnitaire;
  // Arrondi pour éviter les imprécisions des flottants
  return Math.round(total * 100) / 100;
};


/**
 * Calcule les totaux (HT, TTC, TVA) pour un ensemble de lignes de document.
 * C'est une version simplifiée pour une utilisation dans les formulaires du client.
 *
 * @param {Array<object>} lignes - Le tableau des lignes. Chaque ligne: { quantite, prixUnitaire, tva? }.
 * @param {number} [defaultTvaRate=18] - Le taux de TVA par défaut en pourcentage.
 * @returns {{totalHT: number, totalTTC: number, montantTVA: number}}
 */
export const calculateDocumentTotals = (lignes = [], defaultTvaRate = 18) => {
  let totalHT = 0;
  let montantTVA = 0;

  lignes.forEach(ligne => {
    const ligneTotalHT = calculateLigneTotal(ligne);
    totalHT += ligneTotalHT;
    
    const tauxTVA = Number(ligne.tva) === 0 ? 0 : (Number(ligne.tva) || defaultTvaRate);
    montantTVA += ligneTotalHT * (tauxTVA / 100);
  });
  
  totalHT = Math.round(totalHT * 100) / 100;
  montantTVA = Math.round(montantTVA * 100) / 100;
  const totalTTC = totalHT + montantTVA;

  return {
    totalHT,
    montantTVA: Math.round(montantTVA * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100,
  };
};


/**
 * Calcule la somme totale d'une propriété numérique sur un tableau de données.
 *
 * @param {Array<object>} data - Le tableau de données (ex: liste de factures).
 * @param {string} property - La clé de la propriété à sommer (ex: 'totalTTC').
 * @returns {number} La somme totale.
 */
export const sumProperty = (data = [], property) => {
  return data.reduce((acc, item) => {
    const value = Number(item[property]) || 0;
    return acc + value;
  }, 0);
};


/**
 * Calcule la progression en pourcentage.
 * Utile pour les barres de progression.
 *
 * @param {number} currentValue - La valeur actuelle.
 * @param {number} targetValue - La valeur cible (le 100%).
 * @returns {number} Le pourcentage de progression (entre 0 et 100).
 */
export const calculateProgressPercentage = (currentValue, targetValue) => {
    if (targetValue === 0) return 0;
    if (currentValue >= targetValue) return 100;

    const percentage = (currentValue / targetValue) * 100;
    return Math.round(percentage);
};