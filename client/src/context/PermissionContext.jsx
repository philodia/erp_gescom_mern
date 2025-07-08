import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext'; // On dépend du AuthContext pour connaître l'utilisateur
import { ROLES, PERMISSIONS } from '../utils/constants'; // Importer les définitions

// 1. Création du Contexte
const PermissionContext = createContext(null);

// 2. Hook personnalisé pour consommer le contexte
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions doit être utilisé à l\'intérieur d\'un PermissionProvider');
  }
  return context;
};

// 3. Création du Fournisseur (Provider) de Contexte
export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();
  const userRole = user ? user.role : null;

  /**
   * Vérifie si le rôle de l'utilisateur actuel est inclus dans la liste
   * des rôles autorisés pour une permission donnée.
   *
   * @param {string[]} allowedRoles - Un tableau de rôles autorisés (généralement depuis l'objet PERMISSIONS).
   * @returns {boolean} True si l'utilisateur a la permission, sinon false.
   */
  const can = (allowedRoles) => {
    if (!userRole) return false;
    if (userRole === ROLES.ADMIN) return true; // L'admin peut tout faire
    if (!Array.isArray(allowedRoles)) return false; // S'assurer que c'est un tableau

    return allowedRoles.includes(userRole);
  };
  
  // Raccourcis booléens pour un accès facile
  const isAdmin = userRole === ROLES.ADMIN;
  const isComptable = userRole === ROLES.COMPTABLE;
  const isCommercial = userRole === ROLES.COMMERCIAL;
  
  // Rassembler les valeurs à fournir
  const value = {
    userRole,
    can,
    isAdmin,
    isComptable,
    isCommercial,
    // On expose aussi l'objet de configuration des permissions
    PERMISSIONS,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Exporter l'objet de configuration pour qu'il soit accessible si besoin
export { PERMISSIONS };