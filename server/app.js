const express = require('express');
const cors = require('cors');
const path = require('path');

// --- Importation des Configurations ---
const corsOptions = require('./config/cors');
const storageConfig = require('./config/storage');

// --- Importation des Middlewares ---
const { httpLogger } = require('./middleware/logging');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// --- Importation des Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/utilisateurs');
const clientRoutes = require('./routes/clients');
const parametresRoutes = require('./routes/parametres');
const dashboardRoutes = require('./routes/dashboard');
// Ajoutez ici les futures routes (fournisseurs, produits, etc.)

// --- Initialisation de l'application Express ---
const app = express();
app.set('trust proxy', 1);

// --- Application des Middlewares Globaux (l'ordre est important) ---

// 1. Appliquer les options CORS pour la sécurité
app.use(cors(corsOptions));

// 2. Logger toutes les requêtes HTTP entrantes
app.use(httpLogger);

// 3. Appliquer une limite de débit globale pour la protection DoS
app.use(apiLimiter);

// 4. Middlewares pour parser le corps des requêtes
app.use(express.json({ limit: '10mb' })); // Limite la taille du JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Servir les fichiers statiques (uploads)
// Rend le dossier défini dans la config de stockage accessible publiquement
app.use('/uploads', express.static(storageConfig.disks.local.root));


// --- Route de test/santé de l'API ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'L\'API de gestion commerciale est opérationnelle.' 
  });
});


// --- Montage des Routes de l'API ---
// Toutes les routes de l'API sont préfixées par /api
app.use('/api/auth', authRoutes);
app.use('/api/utilisateurs', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/parametres', parametresRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/fournisseurs', fournisseurRoutes);


// --- Middlewares de Gestion des Erreurs (doivent être les derniers) ---
app.use(notFound);
app.use(errorHandler);


// --- Exportation de l'application ---
module.exports = app;