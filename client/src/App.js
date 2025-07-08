import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes'; // Importer notre composant de routes

// Importer les styles globaux une seule fois ici
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';

function App() {
  return (
    // Le Provider de contexte global
    <AppProvider>
      {/* Le routeur du navigateur */}
      <BrowserRouter>
        {/* Le composant qui gère toute la logique de routage */}
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;