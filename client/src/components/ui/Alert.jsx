import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import {
  FaCheckCircle,   // Icône pour le succès
  FaTimesCircle,   // Icône pour l'erreur
  FaExclamationTriangle, // Icône pour l'avertissement
  FaInfoCircle     // Icône pour l'information
} from 'react-icons/fa';

/**
 * Un composant Alert personnalisé qui affiche des messages avec des icônes
 * et des couleurs appropriées en fonction du type de message.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Le message à afficher dans l'alerte.
 * @param {'success'|'danger'|'warning'|'info'|'primary'} [props.variant='info'] - Le type d'alerte, qui détermine la couleur et l'icône.
 * @param {boolean} [props.dismissible=false] - Si true, ajoute un bouton pour fermer l'alerte.
 * @param {function} [props.onClose] - La fonction à appeler lorsque l'alerte est fermée.
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 * @returns {JSX.Element|null}
 */
const Alert = ({ 
  children, 
  variant = 'info', 
  dismissible, 
  onClose, 
  className, 
  ...rest 
}) => {

  // Mappe les variants à leurs icônes correspondantes
  const ICONS = {
    success: FaCheckCircle,
    danger: FaTimesCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
    primary: FaInfoCircle, // On peut utiliser la même icône pour plusieurs variants
  };

  // Sélectionne l'icône en fonction du variant.
  // La variable 'Icon' commencera par une majuscule pour être utilisable comme un composant JSX.
  const Icon = ICONS[variant];

  // Ne rien afficher si l'alerte n'a pas de contenu.
  if (!children) {
    return null;
  }

  return (
    <BootstrapAlert
      variant={variant}
      dismissible={dismissible}
      onClose={onClose}
      className={`d-flex align-items-center ${className || ''}`}
      {...rest}
    >
      {/* Affiche l'icône uniquement si elle est définie pour le variant */}
      {Icon && <Icon className="me-2 flex-shrink-0" style={{ fontSize: '1.2rem' }} />}
      <div>{children}</div>
    </BootstrapAlert>
  );
};

export default Alert;