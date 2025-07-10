/**
 * Ce module fournit des fonctions d'aide diverses pour l'application client.
 */

/**
 * Génère une chaîne de classes CSS conditionnelles.
 * @param {object} classes - Objet de classes { 'ma-classe': true, 'autre-classe': false }.
 * @returns {string} Une chaîne de noms de classe.
 */
export const classNames = (classes) => {
  return Object.entries(classes)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(' ');
};

/**
 * Génère une URL de query string à partir d'un objet de paramètres.
 * @param {object} params - L'objet de paramètres.
 * @returns {string} La query string.
 */
export const generateQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    
  return query ? `?${query}` : '';
};

/**
 * Récupère une valeur imbriquée dans un objet en utilisant un chemin de chaîne de manière sécurisée.
 * @param {object} obj - L'objet dans lequel chercher.
 * @param {string} path - Le chemin de la propriété (ex: 'client.adresse.ville').
 * @param {any} [defaultValue=null] - La valeur à retourner si le chemin n'est pas trouvé ou invalide.
 * @returns {any} La valeur trouvée ou la valeur par défaut.
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  // Gérer les cas où l'objet ou le chemin sont invalides dès le départ.
  if (obj === null || typeof obj !== 'object' || typeof path !== 'string') {
    return defaultValue;
  }
  
  // La méthode reduce est concise et efficace pour cela.
  const value = path.split('.').reduce((current, key) => {
    // S'assurer que 'current' est un objet avant de tenter d'accéder à la clé.
    return (current && typeof current === 'object') ? current[key] : undefined;
  }, obj);
  
  // Retourner la valeur trouvée, ou la valeur par défaut si le résultat est undefined.
  return value !== undefined ? value : defaultValue;
};


/**
 * Crée un délai (debounce) pour l'exécution d'une fonction.
 * @param {function} func - La fonction à "débouncer".
 * @param {number} [delay=500] - Le délai en millisecondes.
 * @returns {function} La nouvelle fonction "débouncée".
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

/**
 * Génère un identifiant unique simple.
 * @param {string} [prefix='key'] - Un préfixe pour l'ID.
 * @returns {string} Un ID unique.
 */
export const generateUniqueId = (prefix = 'key') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};