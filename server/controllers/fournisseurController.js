const asyncHandler = require('express-async-handler');
const Fournisseur = require('../models/Fournisseur');
const { successResponse } = require('../utils/helpers');
const { PAGINATION } = require('../utils/constants');

/**
 * @desc    Créer un nouveau fournisseur
 * @route   POST /api/fournisseurs
 * @access  Private (Admin, Commercial)
 */
exports.createFournisseur = asyncHandler(async (req, res) => {
  const fournisseurData = { ...req.body, createdBy: req.user.id };
  const fournisseur = await Fournisseur.create(fournisseurData);
  successResponse(res, 201, 'Fournisseur créé avec succès.', fournisseur);
});


/**
 * @desc    Récupérer tous les fournisseurs avec recherche et pagination
 * @route   GET /api/fournisseurs
 * @access  Private
 */
exports.getAllFournisseurs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_PAGE_SIZE;
  const searchTerm = req.query.search || '';
  
  const query = { isActive: true };
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  const skip = (page - 1) * limit;

  const [fournisseurs, total] = await Promise.all([
    Fournisseur.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Fournisseur.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  const pagination = {
    total,
    limit,
    currentPage: page,
    totalPages,
  };
  
  successResponse(res, 200, 'Liste des fournisseurs récupérée.', { fournisseurs, pagination });
});


/**
 * @desc    Récupérer un fournisseur par son ID
 * @route   GET /api/fournisseurs/:id
 * @access  Private
 */
exports.getFournisseurById = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findById(req.params.id);
  if (!fournisseur) {
    res.status(404);
    throw new Error('Fournisseur non trouvé.');
  }
  successResponse(res, 200, 'Fournisseur trouvé.', fournisseur);
});


/**
 * @desc    Mettre à jour un fournisseur
 * @route   PUT /api/fournisseurs/:id
 * @access  Private (Admin, Commercial)
 */
exports.updateFournisseur = asyncHandler(async (req, res) => {
  const updatedFournisseur = await Fournisseur.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedFournisseur) {
    res.status(404);
    throw new Error('Fournisseur non trouvé.');
  }
  successResponse(res, 200, 'Fournisseur mis à jour avec succès.', updatedFournisseur);
});


/**
 * @desc    Désactiver (soft delete) un fournisseur
 * @route   DELETE /api/fournisseurs/:id
 * @access  Private/Admin
 */
exports.deleteFournisseur = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findById(req.params.id);

  if (!fournisseur) {
    res.status(404);
    throw new Error('Fournisseur non trouvé.');
  }

  if (!fournisseur.isActive) {
      return successResponse(res, 200, 'Ce fournisseur est déjà désactivé.');
  }

  fournisseur.isActive = false;
  await fournisseur.save();
  
  successResponse(res, 200, 'Fournisseur désactivé avec succès.');
});