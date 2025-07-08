// On importe les constantes métier et les utilitaires mathématiques
const { DEFAULT_TVA_RATE } = require('../utils/constants');
const { roundDecimal, sumByProperty, safeDivide } = require('../utils/mathUtils'); // <-- Mise à jour des imports

/**
 * Calcule les totaux (HT, TTC, et par taux de TVA) pour un document (facture, devis...).
 * @param {Array<object>} lignes - Le tableau des lignes. Chaque ligne: { quantite, prixUnitaire, tva? }.
 * @returns {object} Un objet contenant { totalHT, totalTTC, montantTVA, tvaDetails }.
 */
exports.calculateDocumentTotals = (lignes = []) => {
  const tvaDetails = {};
  let totalHT = 0;

  lignes.forEach(ligne => {
    // Utilise roundDecimal pour plus de précision sur chaque ligne
    const ligneHT = roundDecimal((ligne.quantite || 0) * (ligne.prixUnitaire || 0));
    totalHT += ligneHT;

    const tauxTVA = ligne.tva === 0 ? 0 : (ligne.tva || DEFAULT_TVA_RATE);
    // Utilise roundDecimal ici aussi
    const montantTVALigne = roundDecimal(ligneHT * (tauxTVA / 100));

    if (tvaDetails[tauxTVA]) {
      tvaDetails[tauxTVA] += montantTVALigne;
    } else {
      tvaDetails[tauxTVA] = montantTVALigne;
    }
  });

  const totalTVA = Object.values(tvaDetails).reduce((acc, val) => acc + val, 0);
  const totalTTC = totalHT + totalTVA;

  // Arrondit le résultat final pour chaque taux de TVA
  const roundedTvaDetails = Object.fromEntries(
    Object.entries(tvaDetails).map(([rate, amount]) => [rate, roundDecimal(amount)])
  );

  return {
    totalHT: roundDecimal(totalHT),
    totalTTC: roundDecimal(totalTTC),
    montantTVA: roundDecimal(totalTVA),
    tvaDetails: roundedTvaDetails,
  };
};

/**
 * Calcule la marge brute et le taux de marge pour une ligne de vente.
 * @param {number} prixVenteHT - Le prix de vente hors taxes.
 * @param {number} coutAchatHT - Le coût d'achat hors taxes du produit.
 * @returns {{margeBrute: number, tauxMarge: number}}
 */
exports.calculateGrossMargin = (prixVenteHT, coutAchatHT) => {
  const margeBrute = prixVenteHT - coutAchatHT;
  // Utilise safeDivide pour éviter les erreurs si le prix de vente est 0
  const tauxMarge = safeDivide(margeBrute, prixVenteHT) * 100;
  return {
    margeBrute: roundDecimal(margeBrute),
    tauxMarge: roundDecimal(tauxMarge),
  };
};

/**
 * Calcule le solde dû sur une facture.
 * @param {number} totalTTC - Le montant total TTC de la facture.
 * @param {Array<object>} paiements - Un tableau d'objets de paiement, chacun avec un champ 'montant'.
 * @returns {number} Le solde restant à payer.
 */
exports.calculateBalanceDue = (totalTTC, paiements = []) => {
  // Utilise notre helper sumByProperty pour un code plus concis
  const totalPaye = sumByProperty(paiements, 'montant');
  const balance = totalTTC - totalPaye;
  return roundDecimal(balance);
};

/**
 * Calcule la valeur totale d'un inventaire de produits.
 * @param {Array<object>} produits - Tableau de produits. Chaque produit: { quantiteEnStock, prixAchat }.
 * @returns {number} La valeur totale du stock.
 */
exports.calculateStockValue = (produits = []) => {
  const totalValue = produits.reduce((acc, produit) => {
    const itemValue = (produit.quantiteEnStock || 0) * (produit.prixAchat || 0);
    return acc + itemValue;
  }, 0);
  return roundDecimal(totalValue);
};
