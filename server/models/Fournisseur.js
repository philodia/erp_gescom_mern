const mongoose = require('mongoose');
const { TIERS_TYPES } = require('../utils/constants');

const fournisseurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du fournisseur est obligatoire.'],
    trim: true,
    index: true,
  },
  
  // Bien que ce soit un modèle Fournisseur, on peut garder un champ `type`
  // pour une future unification des tiers, mais on le fixe par défaut.
  type: {
    type: String,
    enum: Object.values(TIERS_TYPES),
    default: TIERS_TYPES.FOURNISSEUR,
    required: true,
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Veuillez fournir une adresse email valide."],
  },

  telephone: {
    type: String,
    trim: true,
  },
  
  contactPrincipal: {
    nom: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telephone: { type: String, trim: true },
  },

  adresse: {
    rue: { type: String, trim: true },
    ville: { type: String, trim: true },
    codePostal: { type: String, trim: true },
    pays: { type: String, default: 'Sénégal', trim: true },
  },

  // NINEA / RCCM du fournisseur
  numeroTVA: {
    type: String,
    trim: true,
  },
  
  // Représente le solde comptable du fournisseur.
  // Une valeur positive signifie que l'entreprise a une dette envers le fournisseur.
  solde: {
    type: Number,
    default: 0,
    required: true,
  },
  
  // Conditions de paiement habituelles négociées avec ce fournisseur
  conditionsPaiement: {
    type: String,
    trim: true,
  },

  // Évaluation interne (1 à 5 étoiles)
  evaluation: {
    type: Number,
    min: 1,
    max: 5,
  },

  informationsBancaires: {
    nomBanque: { type: String, trim: true },
    iban: { type: String, trim: true },
    swift: { type: String, trim: true },
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, {
  timestamps: true,
});

// Index textuel pour la recherche par nom et email
fournisseurSchema.index({ nom: 'text', email: 'text' });

const Fournisseur = mongoose.model('Fournisseur', fournisseurSchema);

module.exports = Fournisseur;