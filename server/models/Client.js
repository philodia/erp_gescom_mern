const mongoose = require('mongoose');

// Définition du schéma pour le modèle Client.
const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du client est obligatoire.'],
    trim: true,
  },
  
  // Distingue un simple contact d'un client facturable.
  // Utile pour la segmentation et le pipeline commercial.
  type: {
    type: String,
    enum: ['Prospect', 'Client'],
    default: 'Client',
    required: true,
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // Note : On ne met pas 'unique: true' ici car plusieurs contacts
    // d'une même entreprise pourraient partager un email générique (ex: contact@entreprise.com),
    // ou le champ peut être vide.
  },

  telephone: {
    type: String,
    trim: true,
  },
  
  // Structure d'adresse imbriquée pour une meilleure organisation.
  adresse: {
    rue: { type: String, trim: true },
    ville: { type: String, trim: true },
    codePostal: { type: String, trim: true },
    pays: { type: String, default: 'Sénégal', trim: true },
  },

  // Numéro d'Identification National des Entreprises et des Associations (Sénégal)
  numeroTVA: {
    type: String,
    trim: true,
    // Ce champ est souvent appelé NINEA ou RCCM.
  },
  
  // Représente le solde comptable du client.
  // Sera mis à jour par les factures et les paiements.
  solde: {
    type: Number,
    default: 0,
    required: true,
  },
  
  // Permet de désactiver un client sans le supprimer (soft delete).
  // Un client inactif n'apparaîtra plus dans les listes de sélection par défaut.
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Champ de traçabilité : qui a créé ce client ?
  // C'est une référence à un document dans la collection 'User'.
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Vous pourriez ajouter d'autres champs ici à l'avenir :
  // notes: String,
  // secteurActivite: String,
  // contactPrincipal: { nom: String, email: String, telephone: String },

}, {
  // Ajoute automatiquement les champs `createdAt` et `updatedAt`.
  timestamps: true,
});

// Création d'un index sur le nom pour accélérer les recherches et les tris par nom.
clientSchema.index({ nom: 1 });
// Index sur le statut d'activité pour filtrer rapidement les clients actifs.
clientSchema.index({ isActive: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;