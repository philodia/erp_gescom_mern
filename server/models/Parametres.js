const mongoose = require('mongoose');
const { CURRENCIES } = require('../utils/constants'); // Importer les devises depuis les constantes
const storageConfig = require('../config/storage'); // Importer la config de stockage pour l'URL de base

const parametresSchema = new mongoose.Schema({
  nomEntreprise: {
    type: String,
    required: [true, "Le nom de l'entreprise est obligatoire."],
    trim: true,
  },
  
  adresse: {
    rue: { type: String, trim: true },
    ville: { type: String, trim: true },
    codePostal: { type: String, trim: true },
    pays: { type: String, default: 'Sénégal', trim: true },
  },

  telephone: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Veuillez fournir un email valide."],
  },

  siteWeb: {
    type: String,
    trim: true,
  },

  // Ce champ stockera le CHEMIN RELATIF du logo (ex: 'logos/monlogo-12345.png')
  logo: {
    type: String,
  },

  numeroTVA: {
    type: String,
    trim: true,
    unique: true, 
    sparse: true, 
  },

  devisePrincipale: {
    type: String,
    enum: {
        values: Object.values(CURRENCIES),
        message: "La devise '{VALUE}' n'est pas supportée."
    },
    default: CURRENCIES.XOF, // Utiliser la constante
    required: true,
  },

  mentionsLegales: {
    type: String,
    trim: true,
  },

}, {
  timestamps: true,
  // Ajout d'un "virtual" pour construire l'URL complète du logo
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Création d'un champ virtuel 'logoUrl'
// Ce champ n'est pas stocké en base de données, mais est calculé à la volée.
parametresSchema.virtual('logoUrl').get(function() {
  if (this.logo) {
    // Utilise la configuration de stockage pour construire l'URL
    const baseUrl = storageConfig.disks[storageConfig.disk].url;
    return `${baseUrl}/${this.logo}`;
  }
  // Retourne un chemin vers un logo par défaut si aucun n'est défini
  return `${storageConfig.disks[storageConfig.disk].url}/logos/default_logo.png`;
});


// Index unique pour s'assurer qu'il n'y a qu'un seul document de paramètres.
// Le nom est un bon candidat pour cette unicité.
parametresSchema.index({ _id: 1 });


const Parametres = mongoose.model('Parametres', parametresSchema);

module.exports = Parametres;