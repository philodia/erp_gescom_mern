import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getUserPermissions } from '../utils/permissions';

/**
 * Hook personnalisé qui sert de point d'entrée UNIQUE pour accéder à toutes les
 * informations et capacités de l'utilisateur connecté.
 *
 * Il combine l'état d'authentification (depuis AuthContext) avec la logique
 * de permissions pour fournir une API complète et simple à utiliser.
 *
 * @returns {object} Un objet complet sur l'état et les capacités de l'utilisateur.
 */
export const useAuth = () => {
  // 1. Récupérer la valeur du contexte.
  //    Elle peut être `null` si le hook est appelé en dehors du Provider.
  const authContext = useContext(AuthContext);

  // 2. Si le hook est appelé en dehors du Provider, on lance une erreur claire.
  if (authContext === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  // 3. Calculer les permissions basées sur l'utilisateur actuel du contexte.
  const permissions = getUserPermissions(authContext.user);

  // 4. Retourner l'objet combiné.
  //    Pas besoin de valeurs par défaut ici, car si on arrive jusqu'à cette ligne,
  //    cela signifie que `authContext` n'est pas null et contient déjà toutes
  //    les propriétés (user, isAuthenticated, isLoading, login, etc.)
  //    fournies par le AuthProvider.
  return {
    ...authContext,
    ...permissions,
  };
};