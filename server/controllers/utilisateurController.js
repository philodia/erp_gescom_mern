const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { successResponse } = require('../utils/helpers');

/**
 * @desc    Obtenir les informations de l'utilisateur actuellement connecté.
 * @route   GET /api/utilisateurs/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  // req.user est déjà attaché par le middleware 'protect'
  // On le renvoie directement pour une performance optimale.
  successResponse(res, 200, 'Profil utilisateur récupéré.', req.user);
});

/**
 * @desc    Récupérer tous les utilisateurs.
 * @route   GET /api/utilisateurs
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  // On pourrait ajouter de la pagination ici plus tard
  const users = await User.find({}).sort({ createdAt: -1 });
  successResponse(res, 200, 'Liste des utilisateurs récupérée.', users);
});

/**
 * @desc    Récupérer un utilisateur par son ID.
 * @route   GET /api/utilisateurs/:id
 * @access  Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé.');
  }
  successResponse(res, 200, 'Utilisateur trouvé.', user);
});

/**
 * @desc    Créer un nouvel utilisateur (par un admin).
 * @route   POST /api/utilisateurs
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res) => {
    // Cette fonction est similaire à `register` mais est destinée à être appelée par un admin.
    const { nom, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Un utilisateur avec cet email existe déjà.');
    }

    const user = await User.create({ nom, email, password, role });
    successResponse(res, 201, 'Utilisateur créé avec succès par l\'administrateur.', user);
});


/**
 * @desc    Mettre à jour un utilisateur (par un admin).
 * @route   PUT /api/utilisateurs/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé.');
  }
  
  // On ne met à jour que les champs fournis.
  user.nom = req.body.nom || user.nom;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  if (req.body.isActive !== undefined) {
    user.isActive = req.body.isActive;
  }
  
  // La modification de mot de passe doit se faire via une route et un contrôleur dédiés.

  const updatedUser = await user.save();
  successResponse(res, 200, 'Utilisateur mis à jour.', updatedUser);
});

/**
 * @desc    Supprimer (désactiver) un utilisateur - Soft Delete.
 * @route   DELETE /api/utilisateurs/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé.');
  }

  // Soft delete: on ne supprime pas, on désactive.
  user.isActive = false;
  await user.save();
  
  successResponse(res, 200, 'Utilisateur désactivé avec succès.');
});