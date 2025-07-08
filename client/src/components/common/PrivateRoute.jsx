import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Ce composant agit comme un "gardien" pour les routes protégées.
 * Il vérifie l'état d'authentification de l'utilisateur en utilisant le hook useAuth.
 */
const PrivateRoute = () => {
  // 1. Récupérer l'état d'authentification et l'état de chargement depuis notre contexte.
  const { isAuthenticated, isLoading } = useAuth();

  // 2. Gérer l'état de chargement initial. C'est CRUCIAL.
  //    Pendant que l'application vérifie si le token est valide (au premier chargement),
  //    'isLoading' est à 'true'. On ne doit rien afficher pour éviter une redirection
  //    prématurée vers la page de login (le "flicker effect").
  if (isLoading) {
    // On peut retourner un spinner de chargement global ou simplement null.
    // Un spinner est souvent une meilleure expérience utilisateur.
    return <div>Chargement de l'application...</div>; 
  }

  // 3. Une fois le chargement terminé, on prend la décision.
  //    Si l'utilisateur est authentifié, on rend le composant <Outlet />.
  //    Sinon, on le redirige vers la page de connexion avec le composant <Navigate />.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;