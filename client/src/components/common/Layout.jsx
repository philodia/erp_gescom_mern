import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

/**
 * Composant de mise en page principal pour les pages protégées de l'application.
 * Il assemble la Sidebar, le Header et le Footer autour du contenu de la page.
 *
 * @param {object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Le contenu de la page actuelle à afficher.
 */
const Layout = ({ children }) => {
  // État pour gérer l'ouverture de la sidebar sur les petits écrans
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Effet pour fermer automatiquement la sidebar lors d'un changement de page (navigation)
  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


  return (
    <div className="layout">
      {/* La Sidebar reçoit l'état d'ouverture et la fonction pour la contrôler */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Conteneur pour le contenu principal, incluant le header et le footer */}
      <div className="main-content">
        {/* Le Header reçoit la fonction pour contrôler la sidebar (pour le bouton burger) */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Le contenu de la page actuelle est rendu ici */}
        <main className="page-container">
          {children}
        </main>

        {/* Le Footer est à la fin */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;