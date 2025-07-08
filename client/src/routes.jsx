import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importer les layouts et les composants de route
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// Importer les pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ClientsList from './pages/clients/ClientsList';
import Entreprise from './pages/parametres/Entreprise';
import NotFound from './pages/NotFound';

// Ajouter ici les imports des futures pages au fur et à mesure
// import FournisseursList from './pages/fournisseurs/FournisseursList';
// import ProduitsList from './pages/produits/ProduitsList';
// import VentesList from './pages/ventes/VentesList';

/**
 * Le composant central qui définit toutes les routes de l'application.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* --- ROUTES PUBLIQUES --- */}
      {/* Routes accessibles sans authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}


      {/* --- ROUTES PRIVÉES / PROTÉGÉES --- */}
      {/* Toutes les routes imbriquées ici nécessiteront une authentification */}
      <Route element={<PrivateRoute />}>
        {/* Toutes les routes ici utiliseront le Layout principal (Header, Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Clients */}
          <Route path="/clients" element={<ClientsList />} />
          {/* <Route path="/clients/ajouter" element={<ClientForm />} /> */}
          {/* <Route path="/clients/modifier/:id" element={<ClientForm />} /> */}
          
          {/* Fournisseurs */}
          {/* <Route path="/fournisseurs" element={<FournisseursList />} /> */}
          
          {/* Produits */}
          {/* <Route path="/produits" element={<ProduitsList />} /> */}

          {/* Ventes */}
          {/* <Route path="/ventes" element={<VentesList />} /> */}
          
          {/* Paramètres */}
          <Route path="/parametres/entreprise" element={<Entreprise />} />
          
          {/* Redirection par défaut après connexion */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>


      {/* --- ROUTE 404 --- */}
      {/* S'affiche si aucune des routes ci-dessus ne correspond */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};

export default AppRoutes;