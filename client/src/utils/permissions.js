import { useAuth } from '../context/AuthContext';
import { ROLES } from './constants';

/**
 * Hiérarchie des permissions.
 */
export const PERMISSIONS = {
    CAN_VIEW: [ROLES.VENDEUR, ROLES.COMMERCIAL, ROLES.COMPTABLE, ROLES.ADMIN],
    CAN_MANAGE_SALES: [ROLES.COMMERCIAL, ROLES.ADMIN],
    CAN_MANAGE_ACCOUNTING: [ROLES.COMPTABLE, ROLES.ADMIN],
    CAN_MANAGE_PURCHASES: [ROLES.COMMERCIAL, ROLES.ADMIN],
    CAN_MANAGE_SETTINGS: [ROLES.ADMIN],
};

/**
 * Hook personnalisé pour vérifier les autorisations de l'utilisateur connecté.
 * @returns {object} Un objet avec le rôle de l'utilisateur et les fonctions de vérification.
 */
export const usePermissions = () => {
  // Le hook dépend de useAuth pour obtenir l'utilisateur.
  const { user } = useAuth();
  const userRole = user ? user.role : null;

  /**
   * Vérifie si le rôle de l'utilisateur actuel a une permission donnée.
   * @param {string[]} allowedRoles - Un tableau de rôles autorisés.
   * @returns {boolean} True si l'utilisateur a la permission.
   */
  const can = (allowedRoles) => {
    if (!userRole) return false;
    if (userRole === ROLES.ADMIN) return true; // L'admin peut tout faire
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