import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';

/**
 * Un composant Card personnalisé qui standardise l'affichage des cartes dans l'application.
 * Il offre une API simplifiée pour ajouter un titre, une icône et un pied de page.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Le contenu principal de la carte, qui sera placé dans Card.Body.
 * @param {string|React.ReactNode} [props.title] - Le titre à afficher dans l'en-tête (Card.Header).
 * @param {React.ComponentType} [props.icon] - Une icône (de react-icons) à afficher à côté du titre.
 * @param {React.ReactNode} [props.footer] - Le contenu à afficher dans le pied de page (Card.Footer), idéal pour les boutons d'action.
 * @param {string} [props.className] - Des classes CSS supplémentaires à appliquer à l'élément Card principal.
 * @returns {JSX.Element}
 */
const Card = ({
  children,
  title,
  icon: Icon,
  footer,
  className,
  ...rest // Pour passer d'autres props directement au composant Card de Bootstrap
}) => {
  return (
    <BootstrapCard className={`shadow-sm ${className || ''}`} {...rest}>
      {/* Affiche l'en-tête uniquement si un titre est fourni */}
      {title && (
        <BootstrapCard.Header as="h5" className="d-flex align-items-center">
          {Icon && <Icon className="me-2" />}
          {title}
        </BootstrapCard.Header>
      )}

      {/* Le corps de la carte contient toujours les enfants */}
      <BootstrapCard.Body>
        {children}
      </BootstrapCard.Body>

      {/* Affiche le pied de page uniquement si du contenu est fourni */}
      {footer && (
        <BootstrapCard.Footer className="text-end">
          {footer}
        </BootstrapCard.Footer>
      )}
    </BootstrapCard>
  );
};

export default Card;