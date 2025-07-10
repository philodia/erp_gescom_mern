import { ROLES } from './constants';

/**
 * Fonction de logique pure qui détermine les capacités d'un utilisateur.
 * @param {object|null} user - L'objet utilisateur.
 * @returns {object} Un objet avec le rôle et les fonctions de vérification.
 */
export const getUserPermissions = (user) => {
  const userRole = user?.role || null;

  const can = (allowedRoles) => {
    if (!userRole) return false;
    if (userRole === ROLES.ADMIN) return true;
    if (!Array.isArray(allowedRoles)) return false;
    return allowedRoles.includes(userRole);
  };

  return {
    userRole,
    can,
    isAdmin: userRole === ROLES.ADMIN,
    isComptable: userRole === ROLES.COMPTABLE,
    isCommercial: userRole === ROLES.COMMERCIAL,
    isVendeur: userRole === ROLES.VENDEUR,
  };
};