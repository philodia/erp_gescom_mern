const mongoose = require('mongoose');
const { TIERS_TYPES } = require('../utils/constants'); // Importer nos constantes

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du client est obligatoire.'],
    trim: true,
    index: true, // Raccourci pour créer un index sur ce champ
  },
  
  type: {
    type: String,
    // Utiliser les constantes pour l'enum pour une meilleure maintenabilité
    enum: {
      values: [TIERS_TYPES.CLIENT, TIERS_TYPES.PROSPECT],
      message: "Le type '{VALUE}' n'est pas supporté."
    },
    default: TIERS_TYPES.CLIENT,
    required: true,
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // Ajouter une validation de format, même si le champ n'est pas requis
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Veuillez fournir une adresse email valide."],
  },

  telephone: {
    type: String,
    trim: true,
  },
  
  adresse: {
    rue: { type: String, trim: true },
    ville: { type: String, trim: true },
    codePostal: { type: String, trim: true },
    pays: { type: String, default: 'Sénégal', trim: true },
  },

  numeroTVA: {
    type: String,
    trim: true,
  },
  
  solde: {
    type: Number,
    default: 0,
    required: true,
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true, // Index sur ce champ pour filtrer rapidement les actifs/inactifs
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Utile si on veut filtrer les clients par créateur
  },

}, {
  timestamps: true,
});

// La syntaxe `index: true` dans les champs remplace les appels .index() manuels,
// ce qui est plus concis.

// Ajouter un index composé pour les recherches/tris fréquents
clientSchema.index({ nom: 'text', email: 'text' }); // Permet une recherche textuelle plus efficace

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;