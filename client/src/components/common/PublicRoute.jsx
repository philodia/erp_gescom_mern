import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Importer un spinner pour le feedback visuel

/**
 * Un composant de route pour les pages publiques (Login, Register, etc.).
 * Si l'utilisateur est déjà authentifié, il est automatiquement redirigé
 * vers le tableau de bord pour lui éviter de revoir la page de connexion.
 */
const PublicRoute = () => {
  // Récupérer l'état d'authentification ET l'état de chargement
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Gérer l'état de chargement initial.
  //    Pendant que l'on vérifie le token, on affiche un spinner pour éviter
  //    d'afficher la page de login une fraction de seconde avant une redirection.
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner text="Vérification de la session..." />
      </div>
    );
  }

  // 2. Une fois le chargement terminé, on prend la décision.
  //    Si l'utilisateur est authentifié, on le redirige.
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;