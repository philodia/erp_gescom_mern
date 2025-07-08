const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware pour protéger les routes.
 * Vérifie la présence et la validité d'un token JWT dans le header Authorization.
 * Si le token est valide, attache les informations de l'utilisateur à req.user.
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Vérifier si le header 'Authorization' existe et commence par 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraire le token (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Vérifier et décoder le token en utilisant le secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Récupérer l'utilisateur depuis la base de données avec l'ID du token
      //    On exclut le mot de passe pour des raisons de sécurité.
      req.user = await User.findById(decoded.id).select('-password');

      // Si l'utilisateur associé au token n'existe plus
      if (!req.user) {
          return res.status(401).json({ message: 'Non autorisé, l\'utilisateur n\'existe plus.' });
      }

      // 5. Passer au prochain middleware/contrôleur
      next();
    } catch (error) {
      // Si le token est invalide (malformé, expiré, etc.)
      console.error(error);
      return res.status(401).json({ message: 'Non autorisé, le token a échoué.' });
    }
  }

  // Si le header 'Authorization' est manquant ou mal formaté
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni.' });
  }
};

/**
 * Middleware de gestion des rôles (autorisation).
 * À utiliser APRES le middleware 'protect'.
 * @param {...string} roles - Liste des rôles autorisés à accéder à la route.
 * @returns Un middleware Express.
 * 
 * @example
 * // Seuls les 'Admin' et 'Comptable' peuvent accéder à cette route.
 * router.get('/rapport-financier', protect, authorize('Admin', 'Comptable'), getRapportFinancier);
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Le middleware 'protect' a déjà ajouté 'req.user'.
    if (!req.user || !roles.includes(req.user.role)) {
      // L'utilisateur est bien authentifié (il a un token valide), mais n'a pas le bon rôle.
      // Le code de statut 403 Forbidden est plus approprié que 401 Unauthorized.
      return res.status(403).json({ 
        message: `Accès refusé. Le rôle '${req.user.role}' n'est pas autorisé pour cette ressource.` 
      });
    }
    // Si l'utilisateur a l'un des rôles requis, on continue.
    next();
  };
};