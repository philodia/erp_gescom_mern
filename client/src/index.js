import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { AppProvider } from './context/AppContext'; // <-- Importer notre unique Provider Composer

import App from './App';

// Création de la racine de l'application React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu de l'application
root.render(
  <React.StrictMode>
    {/* 
      1. Le Provider de Redux est au plus haut niveau pour fournir le store global.
      On le renomme avec 'as' pour éviter toute confusion avec d'autres 'Provider'.
    */}
    <ReduxProvider store={store}>
    
      {/* 
        2. Notre AppProvider enveloppe le reste de l'application.
        Il contient lui-même tous les autres contextes (Auth, Theme, Notification, etc.).
      */}
      <AppProvider>
        <App />
      </AppProvider>
      
    </ReduxProvider>
  </React.StrictMode>
);