import config from '../utils/config';

// Récupérer la configuration du stockage
const { prefix, keys } = config.storage;
const storage = window.localStorage; // On peut facilement changer pour window.sessionStorage ici

/**
 * Service de stockage qui encapsule l'API de stockage du navigateur (localStorage).
 * Gère le préfixage automatique des clés et la sérialisation JSON.
 */

/**
 * Construit la clé complète avec le préfixe.
 * @param {string} key - La clé de base (ex: 'authToken').
 * @returns {string} La clé complète (ex: 'erp_senegal_authToken').
 */
const _getFullKey = (key) => `${prefix}${key}`;


/**
 * Enregistre une valeur dans le stockage.
 * Sérialise automatiquement les objets/tableaux en JSON.
 *
 * @param {string} key - La clé de base (doit être une des clés de config.storage.keys).
 * @param {any} value - La valeur à stocker.
 */
const setItem = (key, value) => {
  if (!Object.values(keys).includes(key)) {
    console.warn(`Clé de stockage non reconnue: "${key}". Il est recommandé de la définir dans config.js.`);
  }
  try {
    const serializedValue = JSON.stringify(value);
    storage.setItem(_getFullKey(key), serializedValue);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans le stockage :", error);
  }
};


/**
 * Récupère une valeur depuis le stockage.
 * Désérialise automatiquement les valeurs JSON.
 *
 * @param {string} key - La clé de base.
 * @param {any} [defaultValue=null] - La valeur à retourner si la clé n'est pas trouvée.
 * @returns {any} La valeur récupérée ou la valeur par défaut.
 */
const getItem = (key, defaultValue = null) => {
  if (!Object.values(keys).includes(key)) {
    console.warn(`Clé de stockage non reconnue: "${key}".`);
  }
  try {
    const serializedValue = storage.getItem(_getFullKey(key));
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Erreur lors de la récupération depuis le stockage :", error);
    return defaultValue;
  }
};


/**
 * Supprime une valeur du stockage.
 *
 * @param {string} key - La clé de base.
 */
const removeItem = (key) => {
  if (!Object.values(keys).includes(key)) {
    console.warn(`Clé de stockage non reconnue: "${key}".`);
  }
  storage.removeItem(_getFullKey(key));
};


/**
 * Vide entièrement le stockage géré par l'application (toutes les clés préfixées).
 */
const clear = () => {
  Object.values(keys).forEach(key => {
    removeItem(key);
  });
  console.log('Stockage de l\'application vidé.');
};


// Exporter les fonctions dans un objet
const storageService = {
  setItem,
  getItem,
  removeItem,
  clear,
};

export default storageService;