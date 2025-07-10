const express = require('express');
const router = express.Router();

// 1. Importer la fonction du contrôleur
const { getDashboardData } = require('../controllers/dashboardController');

// 2. Importer le middleware de sécurité
const { protect } = require('../middleware/auth');


/**
 * @desc    Récupérer les données agrégées pour le dashboard.
 * @route   GET /api/dashboard
 * @access  Private
 *
 * Cette route est protégée par le middleware `protect`, ce qui signifie
 * que seul un utilisateur authentifié peut y accéder.
 * Nous n'utilisons pas `authorize` ici, car nous supposons que tous les
 * utilisateurs connectés (même un 'Vendeur') ont le droit de voir un dashboard
 * (qui pourrait être personnalisé en fonction de leur rôle dans le futur).
 */
router.get('/', protect, getDashboardData);


// 3. Exporter le routeur
module.exports = router;