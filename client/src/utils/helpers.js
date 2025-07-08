/**
 * Ce module fournit des fonctions d'aide diverses pour l'application client.
 */

/**
 * Génère une chaîne de classes CSS conditionnelles.
 * Très utile pour appliquer des styles dynamiquement dans les composants.
 *
 * @param {object} classes - Un objet où les clés sont les noms de classe et les valeurs des booléens.
 * @returns {string} Une chaîne de noms de classe séparés par des espaces.
 * @example
 * // returns "btn btn-primary active"
 * classNames({ 'btn': true, 'btn-primary': true, 'btn-sm': false, 'active': true });
 */
export const classNames = (classes) => {
  return Object.entries(classes)
    .filter(([key, value]) => Boolean(value))
    .map(([key]) => key)
    .join(' ');
};


/**
 * Génère une URL de query string à partir d'un objet de paramètres.
 *
 * @param {object} params - L'objet de paramètres (ex: { page: 2, search: 'test' }).
 * @returns {string} La query string (ex: "?page=2&search=test").
 */
export const generateQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    
  return query ? `?${query}` : '';
};


/**
 * Récupère une valeur imbriquée dans un objet en utilisant un chemin de chaîne.
 *
 * @param {object} obj - L'objet dans lequel chercher.
 * @param {string} path - Le chemin de la propriété (ex: 'client.adresse.ville').
 * @param {any} [defaultValue=null] - La valeur à retourner si le chemin n'est pas trouvé.
 * @returns {any} La valeur trouvée ou la valeur par défaut.
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }
  
  const value = path.split('.').reduce((o, key) => (o && o[key] !== 'undefined' ? o[key] : undefined), obj);
  
  return value === undefined ? defaultValue : value;
};


/**
 * Crée un délai (debounce) pour l'exécution d'une fonction.
 * Très utile pour les barres de recherche, pour ne pas lancer une requête API à chaque frappe.
 *
 * @param {function} func - La fonction à "débouncer".
 * @param {number} [delay=500] - Le délai en millisecondes.
 * @returns {function} La nouvelle fonction "débouncée".
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Génère un identifiant unique simple pour les clés dans les listes React.
 * A utiliser uniquement lorsque les données n'ont pas d'ID stable.
 *
 * @param {string} [prefix='key'] - Un préfixe pour l'ID.
 * @returns {string} Un ID unique.
 */
export const generateUniqueId = (prefix = 'key') => {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};