import React from 'react';
import { Button as BootstrapButton, Spinner } from 'react-bootstrap';

/**
 * Un composant Button personnalisé qui encapsule le bouton de react-bootstrap.
 * Il ajoute des fonctionnalités supplémentaires comme un état de chargement et
 * un support facile pour les icônes.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Le contenu du bouton (texte).
 * @param {boolean} [props.isLoading=false] - Si true, le bouton est désactivé et affiche un spinner.
 * @param {React.ComponentType} [props.icon] - Un composant icône (ex: de react-icons) à afficher avant le texte.
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'} [props.variant='primary'] - La couleur du bouton.
 * @param {'sm'|'lg'} [props.size] - La taille du bouton.
 * @param {string} [props.type='button'] - Le type HTML du bouton.
 * @returns {JSX.Element}
 */
const Button = ({ 
  children, 
  isLoading = false, 
  icon: Icon, 
  ...rest 
}) => {
  return (
    <BootstrapButton
      disabled={isLoading}
      {...rest} // Passe toutes les autres props (variant, size, onClick, etc.)
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {/* Si une icône est fournie, on l'affiche */}
          {Icon && <Icon className="me-2" />}
          {children}
        </>
      )}
    </BootstrapButton>
  );
};

export default Button;