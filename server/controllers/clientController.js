const asyncHandler = require('express-async-handler');
const Client = require('../models/Client');
const { successResponse } = require('../utils/helpers');
const { PAGINATION } = require('../utils/constants');

/**
 * @desc    Créer un nouveau client
 * @route   POST /api/clients
 * @access  Private (Admin, Commercial)
 */
exports.createClient = asyncHandler(async (req, res) => {
  const clientData = { ...req.body, createdBy: req.user.id };
  const client = await Client.create(clientData);
  successResponse(res, 201, 'Client créé avec succès.', client);
});


/**
 * @desc    Récupérer tous les clients avec recherche et pagination
 * @route   GET /api/clients
 * @access  Private
 */
exports.getAllClients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_PAGE_SIZE;
  const searchTerm = req.query.search || '';
  
  // Construire la requête de filtre
  const query = { isActive: true };
  if (searchTerm) {
    // Utiliser l'index textuel pour une recherche performante
    query.$text = { $search: searchTerm };
  }

  const skip = (page - 1) * limit;

  // Exécuter les requêtes en parallèle pour la performance
  const [clients, total] = await Promise.all([
    Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Client.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  const pagination = {
    total,
    limit,
    currentPage: page,
    totalPages,
  };
  
  successResponse(res, 200, 'Liste des clients récupérée.', { clients, pagination });
});


/**
 * @desc    Récupérer un client par son ID
 * @route   GET /api/clients/:id
 * @access  Private
 */
exports.getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error('Client non trouvé.');
  }
  successResponse(res, 200, 'Client trouvé.', client);
});


/**
 * @desc    Mettre à jour un client
 * @route   PUT /api/clients/:id
 * @access  Private (Admin, Commercial)
 */
exports.updateClient = asyncHandler(async (req, res) => {
  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedClient) {
    res.status(404);
    throw new Error('Client non trouvé.');
  }
  successResponse(res, 200, 'Client mis à jour avec succès.', updatedClient);
});


/**
 * @desc    Désactiver (soft delete) un client
 * @route   DELETE /api/clients/:id
 * @access  Private/Admin
 */
exports.deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error('Client non trouvé.');
  }

  if (!client.isActive) {
      return successResponse(res, 200, 'Ce client est déjà désactivé.');
  }

  client.isActive = false;
  await client.save();
  
  successResponse(res, 200, 'Client désactivé avec succès.');
});