import React, { createContext, useEffect, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'; // Importer notre hook magique
import { LOCAL_STORAGE_KEYS } from '../utils/constants'; // Importer nos clés de stockage

/**
 * Détermine le thème initial de manière intelligente.
 * Cette fonction est maintenant appelée seulement si useLocalStorage ne trouve rien.
 */
const getInitialTheme = () => {
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
  // --- Utilisation de useLocalStorage pour gérer l'état du thème ---
  // Le hook gère lui-même la lecture initiale et la sauvegarde automatique.
  // On lui passe la clé et la fonction pour déterminer la valeur initiale si rien n'est stocké.
  const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_KEYS.THEME, getInitialTheme);

  // --- Fonction pour basculer le thème ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Effet de bord pour mettre à jour le DOM ---
  // Cet effet ne s'occupe plus que de la manipulation du DOM.
  // La persistance est gérée par le hook useLocalStorage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Rassembler les valeurs à fournir ---
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