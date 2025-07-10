import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

/**
 * Un composant Modal générique et réutilisable qui encapsule react-bootstrap.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Booléen contrôlant la visibilité de la modale.
 * @param {function} props.onClose - Fonction à appeler pour fermer la modale (ex: clic sur la croix ou sur le fond).
 * @param {string|React.ReactNode} props.title - Le titre à afficher dans l'en-tête de la modale.
 * @param {React.ReactNode} props.children - Le contenu principal à afficher dans le corps de la modale.
 * @param {React.ReactNode} [props.footer] - Un élément JSX optionnel pour le pied de page de la modale (généralement des boutons).
 * @param {'sm'|'lg'|'xl'} [props.size] - La taille de la modale.
 * @param {boolean} [props.centered=true] - Si true, la modale est centrée verticalement.
 * @returns {JSX.Element|null}
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size,
  centered = true,
}) => {
  // Ne rien rendre si la modale n'est pas ouverte.
  // Bien que `show` de react-bootstrap gère cela, c'est une sécurité supplémentaire.
  if (!isOpen) {
    return null;
  }
  
  return (
    <BootstrapModal
      show={isOpen}
      onHide={onClose}
      size={size}
      centered={centered}
      backdrop="static" // Empêche la fermeture en cliquant sur le fond par défaut. La croix et le bouton Annuler fonctionneront.
      keyboard={true}   // Permet de fermer avec la touche Échap.
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title as="h5">{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      
      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>
      
      {/* Le pied de page n'est rendu que si la prop 'footer' est fournie */}
      {footer && (
        <BootstrapModal.Footer>
          {footer}
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};

export default Modal;