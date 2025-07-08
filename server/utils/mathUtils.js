/**
 * Ce module fournit des fonctions utilitaires mathématiques pures.
 * Il est conçu pour être la base de calculs plus complexes effectués par les services métier.
 */

/**
 * Arrondit un nombre à un nombre spécifié de décimales.
 * C'est une fonction cruciale pour éviter les erreurs d'arrondi inhérentes
 * aux calculs en virgule flottante en JavaScript.
 *
 * @param {number} number - Le nombre à arrondir.
 * @param {number} [decimals=2] - Le nombre de décimales à conserver.
 * @returns {number} Le nombre arrondi, ou 0 si l'entrée n'est pas un nombre.
 * @example
 * roundDecimal(123.456); // 123.46
 * roundDecimal(0.1 + 0.2); // 0.3 (et non 0.30000000000000004)
 */
exports.roundDecimal = (number, decimals = 2) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 0;
  }
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
};

/**
 * Calcule la somme des valeurs d'une propriété numérique dans un tableau d'objets.
 *
 * @param {Array<object>} array - Le tableau d'objets à traiter.
 * @param {string} property - La clé de la propriété dont les valeurs doivent être sommées.
 * @returns {number} La somme totale, ou 0 si l'entrée n'est pas un tableau.
 * @example
 * const items = [{ price: 10.5 }, { price: 5 }, { price: 20.25 }];
 * sumByProperty(items, 'price'); // 35.75
 */
exports.sumByProperty = (array, property) => {
  if (!Array.isArray(array)) {
    return 0;
  }
  return array.reduce((accumulator, currentItem) => {
    const value = currentItem && typeof currentItem === 'object' ? currentItem[property] : 0;
    return accumulator + (typeof value === 'number' ? value : 0);
  }, 0);
};

/**
 * Calcule un pourcentage d'une valeur de base.
 *
 * @param {number} baseValue - La valeur de base.
 * @param {number} percentage - Le pourcentage à appliquer (ex: 18 pour 18%).
 * @returns {number} Le résultat du calcul de pourcentage.
 * @example
 * calculatePercentage(200, 18); // 36
 */
exports.calculatePercentage = (baseValue, percentage) => {
  if (typeof baseValue !== 'number' || typeof percentage !== 'number') {
    return 0;
  }
  return baseValue * (percentage / 100);
};

/**
 * Divise deux nombres en toute sécurité, en gérant le cas de la division par zéro.
 *
 * @param {number} numerator - Le numérateur.
 * @param {number} denominator - Le dénominateur.
 * @returns {number} Le résultat de la division, ou 0 si le dénominateur est 0.
 * @example
 * safeDivide(100, 5); // 20
 * safeDivide(100, 0); // 0
 */
exports.safeDivide = (numerator, denominator) => {
  if (typeof numerator !== 'number' || typeof denominator !== 'number' || denominator === 0) {
    return 0;
  }
  return numerator / denominator;
};
