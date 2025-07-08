import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assurez-vous d'importer depuis le bon endroit

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur est authentifié, on le redirige vers le tableau de bord.
  // Il n'a rien à faire sur la page de connexion.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Sinon, on affiche la page publique demandée (Login, Register, etc.).
  // <Outlet /> est le placeholder pour ces pages.
  return <Outlet />;
};

export default PublicRoute;