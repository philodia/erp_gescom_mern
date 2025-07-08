import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserFriends, FaBoxOpen, FaShoppingCart, 
  FaFileInvoiceDollar, FaChartBar, FaCogs, FaBuilding
} from 'react-icons/fa';

// 1. Importer useAuth, qui contient maintenant TOUTE la logique de permission
import { useAuth } from '../../context/AuthContext'; 
// 2. Importer la DÉFINITION des permissions depuis les constantes
import { PERMISSIONS } from '../../utils/constants'; 

/**
 * Le composant Sidebar pour la navigation principale.
 * Affiche dynamiquement les liens en fonction des permissions de l'utilisateur.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Booléen pour contrôler la visibilité sur mobile.
 */
const Sidebar = ({ isOpen }) => {
  // 3. Utiliser notre hook unique. Il fournit la fonction 'can'.
  const { can } = useAuth();

  // Définition des liens de navigation avec une condition de permission
  // Cette partie ne change pas car elle était déjà bien conçue.
  const navLinks = [
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

  const activeLinkClass = 'nav-link active';
  const normalLinkClass = 'nav-link';

  // Le JSX du return ne change pas.
  return (
    <nav className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h5 className="m-0">Menu Principal</h5>
      </div>
      <ul className="list-unstyled components">
        {navLinks.map((item, index) => {
          if (!can(item.permission)) {
            return null; 
          }

          if (item.section) {
            return (
              <li key={`section-${index}`}>
                <h6 className="sidebar-section-header">{item.section}</h6>
                <ul className="list-unstyled">
                  {item.links.map((link) => (
                    <li key={link.to}>
                      <NavLink 
                        to={link.to} 
                        className={({ isActive }) => isActive ? activeLinkClass : normalLinkClass}
                      >
                        <link.icon className="me-2" />
                        <span>{link.text}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            );
          } else {
            return (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => isActive ? activeLinkClass : normalLinkClass}
                >
                  <item.icon className="me-2" />
                  <span>{item.text}</span>
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;