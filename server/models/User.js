const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/constants'); // Importer les rôles depuis les constantes
const { bcrypt: bcryptConfig } = require('../config/auth'); // Importer la config bcrypt

// Définition du schéma pour le modèle Utilisateur
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom complet est obligatoire."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'adresse email est obligatoire."],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Veuillez fournir une adresse email valide."],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire."],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères."],
    select: false,
  },
  role: {
    type: String,
    // Utiliser Object.values pour peupler l'enum depuis nos constantes
    // Rend le modèle plus maintenable.
    enum: {
      values: Object.values(ROLES),
      message: "Le rôle '{VALUE}' n'est pas supporté."
    },
    default: ROLES.VENDEUR, // Utiliser la constante pour la valeur par défaut
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // L'URL de l'avatar de l'utilisateur
  avatarUrl: {
      type: String,
      default: '/uploads/avatars/default.png' // Un avatar par défaut
  },
  // Pour la réinitialisation de mot de passe
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

/**
 * Middleware Mongoose (hook) qui s'exécute AVANT qu'un document 'User' soit sauvegardé.
 * Il hache le mot de passe s'il a été modifié.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Utiliser le coût de hachage depuis la configuration centralisée
  const salt = await bcrypt.genSalt(bcryptConfig.saltRounds);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Méthode d'instance pour comparer le mot de passe entré avec celui stocké.
 * @param {string} enteredPassword - Le mot de passe en clair fourni par l'utilisateur.
 * @returns {Promise<boolean>} True si les mots de passe correspondent, false sinon.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // `this.password` est accessible ici même avec 'select: false' car 'this'
  // fait référence à un document qui a été explicitement récupéré avec le mot de passe.
  return await bcrypt.compare(enteredPassword, this.password);
};

// (On pourrait ajouter ici une méthode pour générer le token de reset de mot de passe)

const User = mongoose.model('User', userSchema);

module.exports = User;
