import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
// --- L'import de PERMISSIONS est supprimé car il n'est pas utilisé ici ---

/**
 * Hook personnalisé pour gérer la logique de permissions.
 * Il vérifie si le rôle de l'utilisateur actuel est inclus
 * dans la liste des rôles autorisés pour une permission donnée.
 *
 * @returns {{can: (permission: string[]) => boolean, userRole: string}} 
 * Un objet contenant la fonction `can` et le rôle de l'utilisateur.
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role || null;

  /**
   * Vérifie si l'utilisateur actuellement connecté a une permission spécifique.
   * @param {string[]} requiredPermission - La permission à vérifier.
   * C'est un tableau de rôles autorisés qui vient du fichier constants.js
   * (ex: PERMISSIONS.CAN_MANAGE_SETTINGS).
   */
  const can = useCallback((requiredPermission) => {
    if (!userRole || !requiredPermission) {
      return false;
    }

    // Normaliser la casse pour une comparaison robuste, en supposant que
    // les rôles dans la BDD sont en minuscule et dans les constantes en "TitleCase".
    const normalizedUserRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    
    return requiredPermission.includes(normalizedUserRole);

  }, [userRole]);

  return { can, userRole };
};