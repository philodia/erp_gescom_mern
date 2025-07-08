import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook personnalisé qui sert de point d'entrée pour accéder à l'état
 * et aux actions d'authentification.
 *
 * @returns {object} Un objet contenant :
 *  - L'état d'authentification : user, isAuthenticated, isLoading
 *  - Les actions d'authentification : login, logout, register
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  // Il retourne simplement le contenu du AuthContext, sans l'enrichir.
  return context;
};