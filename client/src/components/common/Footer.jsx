import React from 'react';
import Tooltip from '../ui/Tooltip'; // Importer notre composant Tooltip
import config from '../../utils/config'; // Importer notre configuration globale

/**
 * Composant Footer (pied de page) de l'application.
 */
const Footer = () => {
  // Obtenir l'année en cours dynamiquement
  const currentYear = new Date().getFullYear();
  
  // Récupérer le nom de l'application depuis notre configuration centralisée
  const appName = config.app.appName;
  
  // Récupérer la version de l'application depuis le package.json (accessible via les variables d'environnement de React)
  const appVersion = process.env.REACT_APP_VERSION;

  return (
    // Utiliser la nouvelle classe CSS
    <footer className="app-footer">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          Copyright © {currentYear}{" "}
          <a href="https://mon-app.com" target="_blank" rel="noopener noreferrer">
          {appName}
          </a>. Tous droits réservés.
        </div>
        
        {appVersion && (
          <div>
            <Tooltip text="Version de l'application" placement="top">
              <span>
                v{appVersion}
              </span>
            </Tooltip>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;