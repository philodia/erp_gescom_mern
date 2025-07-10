import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Importer les composants de structure de route ---
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute'; // Importer la route publique

// --- Importer toutes les pages ---

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword';

// Pages principales
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Pages Clients
import ClientsList from './pages/clients/ClientsList';
import ClientAdd from './pages/clients/ClientAdd';
import ClientDetail from './pages/clients/ClientDetail';
import ClientEdit from './pages/clients/ClientEdit'; // On va créer ce composant

// Pages Paramètres
import Entreprise from './pages/parametres/Entreprise';

// (Ajouter les futurs imports ici)


/**
 * Le composant central qui définit toutes les routes de l'application.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* --- ROUTES PUBLIQUES --- */}
      {/* Enveloppées dans PublicRoute pour rediriger les utilisateurs déjà connectés */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Route>


      {/* --- ROUTES PRIVÉES / PROTÉGÉES --- */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          {/* Dashboard (page d'accueil par défaut pour les utilisateurs connectés) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Module Clients */}
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/ajouter" element={<ClientAdd />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/modifier/:id" element={<ClientEdit />} />
          
          {/* Module Fournisseurs (à venir) */}
          {/* <Route path="/fournisseurs" element={<FournisseursList />} /> */}
          
          {/* Module Produits (à venir) */}
          {/* <Route path="/produits" element={<ProduitsList />} /> */}

          {/* Module Ventes (à venir) */}
          {/* <Route path="/ventes" element={<VentesList />} /> */}
          
          {/* Module Paramètres */}
          <Route path="/parametres/entreprise" element={<Entreprise />} />
          
          {/* Redirection par défaut pour la racine de l'application */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>


      {/* --- ROUTE 404 (Catch-all) --- */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};

export default AppRoutes;