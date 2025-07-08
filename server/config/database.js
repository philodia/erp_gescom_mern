const mongoose = require('mongoose');
const { logger } = require('../middleware/logging'); // Assurez-vous que le logger est correctement importé

/**
 * Configuration des options de connexion MongoDB optimisées pour Mongoose 6+
 */
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  bufferCommands: false
};

/**
 * Fonction asynchrone pour se connecter à la base de données MongoDB.
 */
const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI; // Assurez-vous que la variable d'environnement est correctement nommée
    if (!dbUri) {
      throw new Error('MONGODB_URI n\'est pas définie dans les variables d\'environnement');
    }
    logger.info('Tentative de connexion à MongoDB...');
    const conn = await mongoose.connect(dbUri, connectionOptions);
    logger.info('====================================================');
    logger.info(`✅ MONGODB CONNECTÉ AVEC SUCCÈS`);
    logger.info(`   - Hôte: ${conn.connection.host}`);
    logger.info(`   - Port: ${conn.connection.port}`);
    logger.info(`   - Base de données: ${conn.connection.name}`);
    logger.info('====================================================');
    return conn;
  } catch (error) {
    logger.error('====================================================');
    logger.error(`❌ ERREUR DE CONNEXION MONGODB`);
    logger.error(`   - Message: ${error.message}`);
    logger.error(`   - URI tentée: ${process.env.MONGODB_URI ? 'Définie' : 'Non définie'}`);
    logger.error('====================================================');
    process.exit(1);
  }
};

/**
 * Fonction pour vérifier l'état de la connexion
 * @returns {boolean} True si connecté, false sinon
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Fonction pour fermer proprement la connexion MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.warn('Connexion MongoDB fermée proprement.');
  } catch (error) {
    logger.error('Erreur lors de la fermeture de la connexion MongoDB:', { error });
    throw error;
  }
};

/**
 * Fonction pour obtenir les informations de connexion
 * @returns {Object} Informations sur la connexion
 */
const getConnectionInfo = () => {
  const { connection } = mongoose;
  return {
    host: connection.host,
    port: connection.port,
    name: connection.name,
    readyState: connection.readyState,
    readyStateLabel: ['Déconnecté', 'Connecté', 'En connexion', 'Déconnexion'][connection.readyState]
  };
};

// Export des fonctions nécessaires
module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  getConnectionInfo
};
