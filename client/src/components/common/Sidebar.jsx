import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserFriends, FaBoxOpen, FaShoppingCart, 
  FaFileInvoiceDollar, FaChartBar, FaCogs, FaBuilding
} from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../utils/constants';

// La configuration des liens est statique, on la sort du composant
const NAV_LINKS_CONFIG = [
  { 
    to: '/dashboard', 
    icon: FaTachometerAlt, 
    text: 'Dashboard',
    permission: PERMISSIONS.CAN_VIEW,
  },
  {
    section: 'Gestion Commerciale',
    permission: PERMISSIONS.CAN_MANAGE_SALES,
    links: [
      { to: '/clients', icon: FaUserFriends, text: 'Clients' },
      { to: '/fournisseurs', icon: FaBuilding, text: 'Fournisseurs' },
      { to: '/produits', icon: FaBoxOpen, text: 'Produits & Stock' },
      { to: '/ventes', icon: FaShoppingCart, text: 'Ventes' },
    ],
  },
  {
    section: 'Comptabilité',
    permission: PERMISSIONS.CAN_MANAGE_ACCOUNTING,
    links: [
      { to: '/comptabilite/factures', icon: FaFileInvoiceDollar, text: 'Factures & Devis' },
      { to: '/comptabilite/rapports', icon: FaChartBar, text: 'Rapports Financiers' },
    ],
  },
  { 
    to: '/parametres/entreprise', 
    icon: FaCogs, 
    text: 'Paramètres',
    permission: PERMISSIONS.CAN_MANAGE_SETTINGS,
  },
];


const Sidebar = ({ isOpen }) => {
  const { can } = useAuth();

  const activeLinkClass = 'nav-link active';
  const normalLinkClass = 'nav-link';

  const renderedLinks = useMemo(() => {
    return NAV_LINKS_CONFIG
      .filter(item => can(item.permission))
      .map((item, index) => {
        // Cas 1: C'est une section avec des sous-liens
        if (item.section) {
          return (
            <li key={`section-${index}`}>
              <h6 className="sidebar-section-header">{item.section}</h6>
              <ul className="list-unstyled">
                {item.links.map((link) => ( // Ici, la variable est bien 'link'
                  <li key={link.to}>
                    <NavLink 
                      to={link.to} 
                      className={({ isActive }) => isActive ? activeLinkClass : normalLinkClass}
                      end
                    >
                      <link.icon className="me-2" />
                      <span>{link.text}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        }
        
        // Cas 2: C'est un lien simple (le reste)
        // --- CORRECTION ---
        // La variable à utiliser ici est 'item', pas 'link'
        return (
          <li key={item.to}>
            <NavLink 
              to={item.to} 
              className={({ isActive }) => isActive ? activeLinkClass : normalLinkClass}
              end
            >
              <item.icon className="me-2" />
              <span>{item.text}</span>
            </NavLink>
          </li>
        );
        // --- FIN DE LA CORRECTION ---
      });
  }, [can]);

  return (
    <nav className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h5 className="m-0">Menu Principal</h5>
      </div>
      <ul className="list-unstyled components">
        {renderedLinks}
      </ul>
    </nav>
  );
};

export default Sidebar;