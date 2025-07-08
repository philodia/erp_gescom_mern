const http = require('http');
const dotenv = require('dotenv');
const { Server } = require("socket.io");
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');
const { connectDB } = require('./config/database'); // Corrected import of connectDB
const { logger } = require('./middleware/logging'); // Import your logger
const notificationService = require('./services/notificationService');

// Initialize HTTP server
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize notification service with 'io' instance
notificationService.init(io);

// Handle WebSocket client connections
io.on('connection', (socket) => {
  logger.info(`Nouvelle connexion WebSocket: ${socket.id}`);

  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    logger.info(`Utilisateur ${userId} a rejoint sa room WebSocket.`);
  });

  socket.on('disconnect', () => {
    logger.info(`Déconnexion WebSocket: ${socket.id}`);
  });
});

// Function to start the server
const startServer = async () => {
  try {
    logger.info('Démarrage du serveur...');

    // 1. Connect to the database
    await connectDB();

    // 2. Start listening on the HTTP server
    server.listen(PORT, () => {
      logger.info('====================================================');
      logger.info(`🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS 🚀`);
      logger.info(`   - Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`   - En écoute sur le port: ${PORT}`);
      logger.info(`   - URL du serveur: http://localhost:${PORT}`);
      logger.info('✅ Serveur prêt à recevoir des requêtes!');
      logger.info('====================================================');
    });
  } catch (error) {
    logger.error(`❌ Échec du démarrage du serveur: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

// Start the server
startServer();

// Function for graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.warn(`Signal ${signal} reçu. Fermeture gracieuse du serveur...`);

  // Close the HTTP server so it no longer accepts new connections
  server.close(async () => {
    logger.info('Serveur HTTP fermé.');
    // Add logic to close database connection if needed
    // For example: await disconnectDB();
    process.exit(0);
  });

  // Force shutdown if server doesn't close in time
  setTimeout(() => {
    logger.error('Impossible de fermer les connexions à temps, arrêt forcé.');
    process.exit(1);
  }, 10000); // 10 seconds
};

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejet de promesse non géré !', { reason, promise });
  gracefulShutdown('unhandledRejection');
});

// Capture uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Exception non capturée !', { message: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

// Capture system termination signals (e.g., Ctrl+C, `docker stop`)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
