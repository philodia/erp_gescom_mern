const mongoose = require('mongoose');
const path = require('path'); // Importer path pour une gestion plus propre des chemins
const { CURRENCIES } = require('../utils/constants');
const storageConfig = require('../config/storage');

const parametresSchema = new mongoose.Schema({
  nomEntreprise: {
    type: String,
    required: [true, "Le nom de l'entreprise est obligatoire."],
    trim: true,
    // On peut s'assurer qu'il n'y ait qu'un seul document en rendant ce champ unique.
    // L'approche "upsert" du contrôleur le gère déjà, mais c'est une double sécurité.
    unique: true, 
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

  // Stocke le chemin relatif du logo, ex: 'logos/monlogo-12345.png'
  logo: {
    type: String,
  },

  // NINEA / RCCM
  numeroTVA: {
    type: String,
    trim: true,
  },

  devisePrincipale: {
    type: String,
    enum: {
        values: Object.values(CURRENCIES),
        message: "La devise '{VALUE}' n'est pas supportée."
    },
    default: CURRENCIES.XOF,
    required: true,
  },

  mentionsLegales: {
    type: String,
    trim: true,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


/**
 * Champ Virtuel: logoUrl
 * Construit l'URL complète et absolue du logo de l'entreprise.
 * Ce champ n'est pas stocké en base de données mais est calculé dynamiquement,
 * ce qui le rend flexible aux changements de configuration de stockage (local vs S3).
 */
parametresSchema.virtual('logoUrl').get(function() {
  // Récupérer la configuration du disque de stockage actuel
  const diskConfig = storageConfig.disks[storageConfig.disk];
  if (!diskConfig) {
      // Cas de secours si la configuration est invalide
      return null;
  }
  
  const baseUrl = diskConfig.url;

  if (this.logo) {
    // path.join est plus robuste que la concaténation simple avec '/'
    // bien qu'ici, avec une URL, une concaténation simple fonctionne bien aussi.
    // On s'assure de ne pas avoir de double slash si baseUrl en a un.
    return `${baseUrl.replace(/\/$/, '')}/${this.logo}`;
  }
  
  // Chemin par défaut
  const defaultLogoPath = path.join(storageConfig.paths.logos, 'default_logo.png').replace(/\\/g, '/');
  return `${baseUrl.replace(/\/$/, '')}/${defaultLogoPath}`;
});


const Parametres = mongoose.model('Parametres', parametresSchema);

module.exports = Parametres;