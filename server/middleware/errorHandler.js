/**
 * Ce module contient les middlewares de gestion des erreurs pour l'application.
 */

/**
 * Middleware pour gérer les routes non trouvées (404).
 * Ce middleware est appelé si aucune autre route ne correspond à la requête.
 *
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction pour passer au prochain middleware.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error); // Passe l'erreur au gestionnaire d'erreurs global
};

/**
 * Middleware de gestion des erreurs global.
 * C'est le dernier middleware à être appelé. Il doit avoir 4 arguments.
 *
 * @param {Error} err - L'objet d'erreur.
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction pour passer au prochain middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Parfois, une erreur peut arriver avec un code de statut 200, ce qui est illogique.
  // Si c'est le cas, on le définit par défaut à 500 (Erreur Interne du Serveur).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Gérer des erreurs spécifiques de Mongoose pour des messages plus clairs
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Ressource non trouvée. L\'ID fourni est invalide.';
  }

  // Gérer les erreurs de validation de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Concatène tous les messages d'erreur de validation
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }
  
  // Gérer les erreurs de clé dupliquée de MongoDB (ex: email unique)
  if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `La valeur pour le champ '${field}' existe déjà. Elle doit être unique.`;
  }

  // Envoie la réponse d'erreur formatée
  res.status(statusCode).json({
    success: false,
    message: message,
    // En mode développement, on inclut la "stack trace" pour le débogage.
    // En production, on la cache pour des raisons de sécurité.
    stack: process.env.NODE_ENV === 'production' ? '🔒' : err.stack,
  });
};

module.exports = { notFound, errorHandler };