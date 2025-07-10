import React, { createContext, useEffect, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

/**
 * Détermine le thème initial en se basant sur la préférence système de l'utilisateur.
 * Cette fonction n'est appelée que si aucune valeur n'est trouvée dans le localStorage.
 */
const getInitialTheme = () => {
  // `window.matchMedia` est l'API standard pour détecter les préférences utilisateur.
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

// 1. Création du Contexte
const ThemeContext = createContext(null);

// 2. Hook personnalisé pour consommer le contexte
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
};

// 3. Création du Fournisseur (Provider) de Contexte
export const ThemeProvider = ({ children }) => {
  // Le hook useLocalStorage gère l'état et la persistance.
  const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_KEYS.THEME, getInitialTheme);

  // La fonction pour basculer le thème est maintenant mémorisée avec useCallback.
  // Cela garantit qu'elle a une référence stable et ne sera pas recréée à chaque rendu,
  // ce qui est une bonne pratique pour les fonctions passées dans un contexte.
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]); // La dépendance est `setTheme`, qui est garantie stable par React.

  // Effet de bord pour appliquer le thème au DOM.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};