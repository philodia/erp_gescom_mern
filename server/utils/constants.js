// Rôles des utilisateurs
// Permet d'éviter les fautes de frappe et de centraliser les rôles disponibles.
exports.ROLES = Object.freeze({
  ADMIN: 'Admin',
  COMPTABLE: 'Comptable',
  COMMERCIAL: 'Commercial',
  VENDEUR: 'Vendeur',
});

// Statuts des documents (Factures, Devis, Commandes)
exports.DOCUMENT_STATUS = Object.freeze({
  BROUILLON: 'brouillon',
  ENVOYE: 'envoyee',
  VALIDE: 'validee',
  PAYEE: 'payee',
  PARTIELLEMENT_PAYEE: 'partiellement payee',
  ANNULE: 'annulee',
  EN_RETARD: 'en retard',
});

// Types de Tiers
exports.TIERS_TYPES = Object.freeze({
  CLIENT: 'Client',
  PROSPECT: 'Prospect',
  FOURNISSEUR: 'Fournisseur',
});

// Types de mouvements de stock
exports.STOCK_MOVEMENT_TYPES = Object.freeze({
  ENTREE_ACHAT: 'Entrée (Achat)',
  SORTIE_VENTE: 'Sortie (Vente)',
  ENTREE_RETOUR_CLIENT: 'Entrée (Retour Client)',
  SORTIE_RETOUR_FOURNISSEUR: 'Sortie (Retour Fournisseur)',
  AJUSTEMENT_INVENTAIRE_PLUS: 'Ajustement Inventaire (+)',
  AJUSTEMENT_INVENTAIRE_MOINS: 'Ajustement Inventaire (-)',
  TRANSFERT_SORTIE: 'Transfert (Sortie)',
  TRANSFERT_ENTREE: 'Transfert (Entrée)',
});

// Préfixes pour la numérotation des documents
exports.DOCUMENT_PREFIXES = Object.freeze({
  FACTURE: 'FACT',
  DEVIS: 'DEV',
  BON_COMMANDE_VENTE: 'BCV',
  BON_COMMANDE_ACHAT: 'BCA',
  BON_LIVRAISON: 'BL',
  AVOIR: 'AV',
});

// Devises supportées (ISO 4217)
exports.CURRENCIES = Object.freeze({
  XOF: 'XOF', // Franc CFA
  EUR: 'EUR', // Euro
  USD: 'USD', // Dollar Américain
});

// Taux de TVA par défaut (Sénégal)
exports.DEFAULT_TVA_RATE = 18; // 18%

// Limites pour la pagination
exports.PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
});
