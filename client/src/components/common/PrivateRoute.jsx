import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Importer notre hook unifié
import LoadingSpinner from './LoadingSpinner';

/**
 * Ce composant "gardien" protège les routes qui nécessitent une authentification.
 *
 * - Affiche un spinner pendant la vérification initiale de la session.
 * - Si l'utilisateur est authentifié, il affiche la page demandée.
 * - Si l'utilisateur n'est pas authentifié, il le redirige vers la page de connexion,
 *   en mémorisant l'URL de provenance pour une redirection future.
 */
const PrivateRoute = () => {
  // 1. Utiliser notre hook `useAuth` qui fournit un état garanti et cohérent.
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 2. Pendant que le AuthContext vérifie le token, on affiche un indicateur.
  //    C'est crucial pour éviter un "flash" de la page de login.
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <LoadingSpinner text="Vérification de la session..." size="lg" />
      </div>
    );
  }

  // 3. Une fois la vérification terminée, on prend la décision de routage.
  if (!isAuthenticated) {
    // L'utilisateur n'est pas connecté, on le redirige.
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location }} 
      />
    );
  }

  // L'utilisateur est authentifié, on affiche la page protégée demandée.
  return <Outlet />;
};

export default PrivateRoute;