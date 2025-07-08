import { configureStore } from '@reduxjs/toolkit';

// 1. Importer les reducers de chaque "slice" de notre application.
// Un reducer est la partie d'un slice qui sait comment gérer les mises à jour de son état.
import clientsReducer from './slices/clientsSlice';
import fournisseursReducer from './slices/fournisseursSlice'; // <-- Ajouté en prévision
// Nous ajouterons ici d'autres reducers au fur et à mesure :
// import produitsReducer from './slices/produitsSlice';
// import facturesReducer from './slices/documentsSlice';

// 2. Configurer et créer le store global.
export const store = configureStore({
  // L'objet 'reducer' est une carte où chaque clé représente une partie
  // de notre état global, et chaque valeur est le reducer qui la gère.
  reducer: {
    clients: clientsReducer,
    fournisseurs: fournisseursReducer, // <-- Ajouté en prévision
    // produits: produitsReducer,
    // factures: facturesReducer,
    // L'état global de notre application aura donc une forme comme :
    // {
    //   clients: { items: [], status: 'idle', error: null },
    //   fournisseurs: { items: [], status: 'idle', error: null },
    //   ...
    // }
  },

  // L'activation des Redux DevTools est automatique en mode développement
  // avec configureStore, ce qui est un avantage majeur pour le débogage.
});