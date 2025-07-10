import React, { useState, useEffect, useCallback } from 'react'; // Importer useCallback
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importer les composants du layout
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Composant de mise en page principal pour les pages protégées de l'application.
 * Il agit comme une "coquille" (shell) qui assemble la Sidebar, le Header et le Footer
 * autour du contenu de la page, qui est rendu via <Outlet />.
 */
const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // --- AMÉLIORATION: Utiliser useCallback pour stabiliser la référence de la fonction ---
  // La fonction ne sera recréée que si ses dépendances (ici, aucune) changent.
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []); // Tableau de dépendances vide car la fonction ne dépend d'aucune prop ou état externe.

  // Effet pour fermer automatiquement la sidebar lors d'un changement de page
  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-wrapper">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="main-content-wrapper">
        <Header toggleSidebar={toggleSidebar} />

        <main className="main-content">
          <Outlet />
        </main>
        
        <Footer />
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
          },
        }}
      />
    </div>
  );
};

export default Layout;