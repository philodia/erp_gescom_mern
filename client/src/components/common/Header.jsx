import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Hooks & Contextes ---
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNotificationCenter } from '../../context/NotificationContext';

// --- Constantes & Utilitaires ---
import { PERMISSIONS } from '../../utils/constants';
import { capitalizeFirstLetter } from '../../utils/formatters';

// --- UI Components ---
import { Navbar, Form, InputGroup } from 'react-bootstrap';
import { 
  FaBars, FaBell, FaSun, FaMoon, FaUserCircle, FaCog, 
  FaSignOutAlt, FaBook, FaTrash, FaCheck
} from 'react-icons/fa';
import Dropdown from '../ui/Dropdown';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';

/**
 * Composant Header principal de l'application.
 * Gère la navigation, les actions utilisateur, les notifications et le changement de thème.
 * @param {object} { toggleSidebar } - Fonction pour contrôler la sidebar sur mobile.
 */
const Header = ({ toggleSidebar }) => {
  // --- Utilisation des Hooks ---
  const { user, logout, can } = useAuth(); 
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotificationCenter();
  const navigate = useNavigate();
  
  const isDarkTheme = theme === 'dark';

  // --- Fonctions de Rappel (Callbacks) ---
  // On mémorise les fonctions avec useCallback pour stabiliser leurs références,
  // ce qui est une bonne pratique pour les passer en dépendances à useMemo.
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const navigateTo = useCallback((path) => {
    navigate(path);
  }, [navigate]);


  // --- Mémorisation des Items de Menu ---
  const userDropdownItems = useMemo(() => {
    const items = [
      { label: 'Mon Profil', onClick: () => navigateTo('/profil'), icon: FaUserCircle }
    ];
    if (can(PERMISSIONS.CAN_MANAGE_SETTINGS)) {
      items.push({ label: 'Paramètres', onClick: () => navigateTo('/parametres/entreprise'), icon: FaCog });
    }
    items.push({ isSeparator: true }, { 
      label: 'Déconnexion', 
      onClick: handleLogout,
      icon: FaSignOutAlt 
    });
    return items;
  }, [can, navigateTo, handleLogout]);

  const notificationDropdownItems = useMemo(() => {
    const baseItems = [
        { isHeader: true, label: `Notifications (${unreadCount})` },
        { isSeparator: true },
    ];
    
    const notificationList = notifications.length === 0 
        ? [{ label: "Aucune nouvelle notification", disabled: true }]
        : notifications.slice(0, 5).map(n => ({
            label: n.message,
            icon: FaBook,
            onClick: () => n.link && navigateTo(n.link)
        }));

    const actionItems = [
        { isSeparator: true },
        { label: 'Marquer tout comme lu', icon: FaCheck, onClick: markAllAsRead, disabled: unreadCount === 0 },
        { label: 'Effacer tout', icon: FaTrash, onClick: clearNotifications, disabled: notifications.length === 0 }
    ];
    
    return [...baseItems, ...notificationList, ...actionItems];
  }, [notifications, unreadCount, markAllAsRead, clearNotifications, navigateTo]);


  // --- Rendu JSX ---
  return (
    <Navbar expand="lg" className="app-header px-3" sticky="top">
      <Button variant="outline-secondary" onClick={toggleSidebar} className="d-lg-none me-2">
        <FaBars />
      </Button>

      <Form className="d-none d-md-flex me-auto">
        <InputGroup>
          <Form.Control type="text" placeholder="Rechercher..." />
        </InputGroup>
      </Form>
      
      <div className="d-flex align-items-center ms-auto">
        <Tooltip text={isDarkTheme ? "Passer au thème clair" : "Passer au thème sombre"}>
          <Button variant="link" className="text-secondary" onClick={toggleTheme}>
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </Button>
        </Tooltip>

        <Dropdown
            align="end"
            items={notificationDropdownItems}
            trigger={
              <Tooltip text="Notifications">
                  <Button variant="link" className="text-secondary position-relative">
                      <FaBell />
                      {unreadCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                      )}
                  </Button>
              </Tooltip>
            }
        />
        
        <div className="ms-3">
          <Dropdown
            align="end"
            items={userDropdownItems}
            trigger={
              <div className="d-flex align-items-center cursor-pointer">
                {user?.avatarUrl && !user.avatarUrl.endsWith('default.png') ? 
                    <img src={user.avatarUrl} alt={user?.nom || 'Avatar'} className="rounded-circle me-2" style={{width: '24px', height: '24px', objectFit: 'cover'}} /> :
                    <FaUserCircle size="1.5rem" className="me-2 text-secondary" />
                }
                <div className="d-none d-lg-block">
                  <div className="fw-bold">{user?.nom || 'Utilisateur'}</div>
                  <div className="small text-muted">{user?.role ? capitalizeFirstLetter(user.role) : ''}</div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Navbar>
  );
};

export default Header;