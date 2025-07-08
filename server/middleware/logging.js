const winston = require('winston');
const morgan = require('morgan');

// --- Configuration de Winston pour un logging d'application structuré ---

// Définir les niveaux de logs
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Choisir le niveau de log en fonction de l'environnement
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Définir les couleurs pour chaque niveau (utile en développement)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Définir le format des logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // En développement, on veut des logs colorés et plus simples
  process.env.NODE_ENV === 'development'
    ? winston.format.colorize({ all: true })
    : winston.format.uncolorize(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Définir où les logs doivent être écrits (les "transports")
const transports = [
  // Toujours logger dans la console
  new winston.transports.Console(),
  // En production, logger les erreurs et avertissements dans des fichiers séparés
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Créer l'instance du logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});


// --- Configuration de Morgan pour le logging des requêtes HTTP ---

// Le format 'combined' est un format standard d'Apache, très complet.
// On peut aussi définir un format personnalisé.
// On utilise le stream de Winston pour que Morgan écrive ses logs via Winston.
const httpLogger = morgan(
  // Format: :method :url :status :response-time ms - :res[content-length]
  ':method :url :status :res[content-length] - :response-time ms', 
  {
    stream: {
      // Configure Morgan pour utiliser le niveau 'http' de Winston.
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = {
  logger,       // Pour le logging d'application (ex: logger.error('...'))
  httpLogger,   // Middleware pour les requêtes HTTP
};