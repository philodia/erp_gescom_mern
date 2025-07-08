import React from 'react';

// 1. Importer tous les fournisseurs de contexte de l'application
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
//import { PermissionProvider } from './PermissionContext'; // Si vous utilisez l'approche par Contexte

/**
 * AppContext est un composant qui agit comme un "Provider Composer".
 * Il regroupe tous les fournisseurs de contexte de l'application en un seul endroit
 * pour nettoyer le fichier d'entrée principal (index.js ou App.js).
 *
 * L'ordre d'imbrication est important si un contexte dépend d'un autre.
 * Par exemple, PermissionProvider dépend de AuthProvider, il doit donc être
 * à l'intérieur de celui-ci.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Les composants enfants, généralement le reste de l'application.
 * @returns {JSX.Element}
 */
export const AppProvider = ({ children }) => {
  return (
    // On imbrique les providers. Le plus externe est le plus "fondamental".
    // L'ordre peut avoir de l'importance si un provider utilise un hook d'un autre provider.
    // Par exemple, ThemeProvider et AuthProvider sont indépendants.
    // Mais PermissionProvider dépend de AuthProvider.
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          {/* 
            Si vous utilisez l'approche PermissionContext, décommentez la ligne suivante.
            Sinon, si vous utilisez le hook usePermissions autonome, cette ligne n'est pas nécessaire.
          */}
          {/* <PermissionProvider> */}
            {children}
          {/* </PermissionProvider> */}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};