import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Contextes et Hooks ---
// Les chemins d'import sont maintenant corrects et cohérents.
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { usePermissions } from '../../context/PermissionContext'; // CORRECTION: 'Can' est retiré

// --- Constantes ---
import { PERMISSIONS } from '../../utils/constants';

// --- UI ---
import { Navbar, Form, InputGroup } from 'react-bootstrap';
import { 
  FaBars, FaBell, FaSun, FaMoon, FaUserCircle, FaCog, 
  FaSignOutAlt, FaBook, FaTrash, FaCheck
} from 'react-icons/fa';
import Dropdown from '../ui/Dropdown';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotification();
  const { can } = usePermissions();
  const navigate = useNavigate();
  
  const isDarkTheme = theme === 'dark';

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const navigateToProfile = useCallback(() => navigate('/profil'), [navigate]);
  const navigateToSettings = useCallback(() => navigate('/parametres/entreprise'), [navigate]);

  const userDropdownItems = useMemo(() => {
    const items = [
      {
        label: 'Mon Profil',
        onClick: navigateToProfile,
        icon: FaUserCircle,
      }
    ];

    if (can(PERMISSIONS.CAN_MANAGE_SETTINGS)) {
      items.push({
        label: 'Paramètres',
        onClick: navigateToSettings,
        icon: FaCog,
      });
    }

    items.push(
      { isSeparator: true },
      {
        label: 'Déconnexion',
        onClick: handleLogout,
        icon: FaSignOutAlt,
      }
    );

    return items;
  }, [can, navigateToProfile, navigateToSettings, handleLogout]);

  const notificationDropdownItems = useMemo(() => {
    const items = [
        { isHeader: true, label: `Notifications (${unreadCount})` },
        { isSeparator: true },
    ];
    
    if (notifications.length === 0) {
        items.push({ label: "Aucune nouvelle notification", disabled: true });
    } else {
        notifications.slice(0, 5).forEach(n => items.push({
            label: n.message,
            icon: FaBook,
            // onClick: () => navigate(n.link)
        }));
    }

    items.push(
        { isSeparator: true },
        { label: 'Marquer tout comme lu', icon: FaCheck, onClick: markAllAsRead, disabled: unreadCount === 0 },
        { label: 'Effacer tout', icon: FaTrash, onClick: clearNotifications, disabled: notifications.length === 0 }
    );
    
  // CORRECTION: 'navigate' est retiré des dépendances car non utilisé dans le hook.
  }, [notifications, unreadCount, markAllAsRead, clearNotifications]);


  return (
    <Navbar expand="lg" className="app-header px-3" sticky="top">
      <Button 
        variant="outline-secondary" 
        onClick={toggleSidebar} 
        className="d-lg-none me-2"
      >
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
                <FaUserCircle size="1.5rem" className="me-2 text-secondary" />
                <div className="d-none d-lg-block">
                  <div className="fw-bold">{user?.nom || 'Utilisateur'}</div>
                  <div className="small text-muted">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</div>
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