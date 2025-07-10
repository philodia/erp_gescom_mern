import React from 'react';
// --- CORRECTION: 'useLocation' est supprimé de l'import ---
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Un composant de route pour les pages publiques (Login, Register, etc.).
 * Si l'utilisateur est déjà authentifié, il est automatiquement redirigé
 * vers le tableau de bord.
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // --- CORRECTION: La variable 'location' est supprimée ---
  // const location = useLocation(); 

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner text="Vérification de la session..." size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;