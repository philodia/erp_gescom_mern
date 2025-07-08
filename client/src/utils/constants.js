/**
 * Ce fichier contient les constantes et configurations statiques utilisées
 * à travers toute l'application client.
 */

// =========================================================================
// RÔLES & PERMISSIONS
// =========================================================================

/**
 * Rôles des utilisateurs.
 * Doit être synchronisé avec les constantes du backend.
 */
export const ROLES = Object.freeze({
  ADMIN: 'Admin',
  COMPTABLE: 'Comptable',
  COMMERCIAL: 'Commercial',
  VENDEUR: 'Vendeur',
});

/**
 * Hiérarchie des permissions.
 * Définit quelles actions chaque rôle peut effectuer.
 * C'est la source de vérité pour le contrôle d'accès dans l'UI.
 */
export const PERMISSIONS = Object.freeze({
  // Permission de base pour voir la plupart des données non sensibles
  CAN_VIEW: [ROLES.VENDEUR, ROLES.COMMERCIAL, ROLES.COMPTABLE, ROLES.ADMIN],
  
  // Permission de gérer le cycle de vente (clients, devis, commandes)
  CAN_MANAGE_SALES: [ROLES.COMMERCIAL, ROLES.ADMIN],

  // Permission de gérer les documents comptables (factures, paiements)
  CAN_MANAGE_ACCOUNTING: [ROLES.COMPTABLE, ROLES.ADMIN],
  
  // Permission de gérer les achats (fournisseurs, commandes d'achat)
  CAN_MANAGE_PURCHASES: [ROLES.COMMERCIAL, ROLES.ADMIN],

  // Permission de gérer les paramètres critiques (utilisateurs, config de l'entreprise)
  CAN_MANAGE_SETTINGS: [ROLES.ADMIN],
});


// =========================================================================
// CONFIGURATION DE L'APPLICATION
// =========================================================================

/**
 * Clés pour le Local Storage.
 */
export const LOCAL_STORAGE_KEYS = Object.freeze({
  TOKEN: 'authToken',
  THEME: 'appTheme',
  USER: 'currentUser',
});

/**
 * Limites pour la pagination.
 */
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
});


// =========================================================================
// CONSTANTES MÉTIER
// =========================================================================

/**
 * Statuts des documents.
 * Doit être synchronisé avec les constantes du backend.
 */
export const DOCUMENT_STATUS = Object.freeze({
  BROUILLON: 'brouillon',
  ENVOYE: 'envoyee',
  VALIDE: 'validee',
  PAYEE: 'payee',
  PARTIELLEMENT_PAYEE: 'partiellement payee',
  ANNULE: 'annulee',
  EN_RETARD: 'en retard',
});

/**
 * Devises supportées pour les listes déroulantes.
 */
export const CURRENCIES = Object.freeze([
  { value: 'XOF', label: 'Franc CFA (XOF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar Américain (USD)' },
]);

// La configuration de l'API a été déplacée dans config.js pour une meilleure séparation.
// Si vous préférez la garder ici, vous pouvez décommenter la section suivante.
/*
export const API_CONFIG = Object.freeze({
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 15000,
});
*/