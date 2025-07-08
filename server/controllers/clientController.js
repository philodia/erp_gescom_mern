const Client = require('../models/Client');

/**
 * @desc    Créer un nouveau client
 * @route   POST /api/clients
 * @access  Private (Admin, Commercial)
 */
exports.createClient = async (req, res) => {
  try {
    // On prend toutes les données du corps de la requête...
    const clientData = { ...req.body };
    // ...et on y ajoute l'ID de l'utilisateur qui effectue l'action.
    // req.user est fourni par notre middleware 'protect'.
    clientData.createdBy = req.user.id;

    const newClient = new Client(clientData);
    const savedClient = await newClient.save();
    
    res.status(201).json({
      message: "Client créé avec succès.",
      data: savedClient
    });
  } catch (error) {
    // Si une erreur de validation Mongoose se produit, on renvoie une erreur 400.
    console.error("Erreur lors de la création du client :", error);
    res.status(400).json({ message: 'Erreur lors de la création du client.', error: error.message });
  }
};

/**
 * @desc    Récupérer tous les clients (avec pagination et recherche)
 * @route   GET /api/clients
 * @access  Private (tous les utilisateurs connectés)
 */
exports.getAllClients = async (req, res) => {
  try {
    // Pour l'instant, une récupération simple. Nous ajouterons la pagination/recherche plus tard.
    // On récupère uniquement les clients actifs et on les trie par date de création (du plus récent au plus ancien).
    const clients = await Client.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des clients.', error: error.message });
  }
};

/**
 * @desc    Récupérer un client par son ID
 * @route   GET /api/clients/:id
 * @access  Private
 */
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${req.params.id} :`, error);
    res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
  }
};

/**
 * @desc    Mettre à jour un client
 * @route   PUT /api/clients/:id
 * @access  Private (Admin, Commercial)
 */
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, // Retourne le document mis à jour
        runValidators: true // Exécute les validations du modèle sur les nouvelles données
      }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }

    res.status(200).json({
        message: "Client mis à jour avec succès.",
        data: updatedClient
    });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${req.params.id} :`, error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du client.', error: error.message });
  }
};

/**
 * @desc    Supprimer (désactiver) un client - Soft Delete
 * @route   DELETE /api/clients/:id
 * @access  Private (Admin)
 */
exports.deleteClient = async (req, res) => {
  try {
    // Au lieu de supprimer le document, on met son statut 'isActive' à false.
    // C'est une "suppression douce" (soft delete).
    const client = await Client.findByIdAndUpdate(
        req.params.id, 
        { isActive: false },
        { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }
    
    res.status(200).json({ message: 'Client désactivé avec succès.' });
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${req.params.id} :`, error);
    res.status(500).json({ message: 'Erreur du serveur lors de la suppression du client.', error: error.message });
  }
};