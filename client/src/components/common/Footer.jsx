import React from 'react';

/**
 * Composant Footer (pied de page) de l'application.
 */
const Footer = () => {
  // Obtenir l'année en cours dynamiquement
  const currentYear = new Date().getFullYear();
  // Récupérer la version de l'application depuis le package.json (accessible via les variables d'environnement de React)
  const appVersion = process.env.REACT_APP_VERSION;

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>ERP Commercial Sénégal</strong> © {currentYear}. Tous droits réservés.
          </div>
          {appVersion && (
            <div>
              Version: {appVersion}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;