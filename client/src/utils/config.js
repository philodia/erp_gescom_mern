/**
 * Ce fichier centralise la configuration de l'application client.
 * Il lit les variables d'environnement et fournit des valeurs par défaut.
 */

// Configuration de l'API
export const apiConfig = {
  // L'URL de base de notre API backend.
  // Utilise la variable d'environnement de Create React App (doit commencer par REACT_APP_).
  // Fournit une valeur par défaut pour le développement local.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',

  // Timeout pour les requêtes Axios en millisecondes.
  timeout: 15000,
};


// Configuration du stockage local (Local Storage)
export const localStorageConfig = {
  // Préfixe pour toutes les clés pour éviter les collisions avec d'autres applications
  // sur le même domaine.
  prefix: 'erp_senegal_',

  // Clés spécifiques utilisées dans l'application.
  keys: {
    authToken: 'authToken',
    theme: 'theme',
    user: 'currentUser',
  },
};


// Configuration de la pagination
export const paginationConfig = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};


// Configuration générale de l'application
export const appConfig = {
  appName: 'ERP Commercial Sénégal',
  defaultLocale: 'fr-SN',
  defaultCurrency: 'XOF',
};

// Exportation d'un objet de configuration global
const config = {
  api: apiConfig,
  storage: localStorageConfig,
  pagination: paginationConfig,
  app: appConfig,
};

export default config;