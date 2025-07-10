import React from 'react';
import Modal from './Modal'; // On réutilise notre composant Modal de base
import Button from '../ui/Button';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

/**
 * Un dialogue de confirmation générique.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Booléen pour contrôler la visibilité.
 * @param {function} props.onClose - Fonction pour fermer le dialogue.
 * @param {function} props.onConfirm - Fonction à exécuter si l'utilisateur confirme.
 * @param {string} [props.title='Confirmation'] - Le titre du dialogue.
 * @param {React.ReactNode} [props.children] - Le message ou le contenu du dialogue.
 * @param {string} [props.confirmText='Confirmer'] - Le texte du bouton de confirmation.
 * @param {string} [props.cancelText='Annuler'] - Le texte du bouton d'annulation.
 * @param {'primary'|'danger'|'warning'} [props.variant='primary'] - Le style/couleur du bouton de confirmation.
 * @param {boolean} [props.isConfirming=false] - Si true, affiche un spinner sur le bouton de confirmation.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  children,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'primary',
  isConfirming = false,
}) => {
  // Déterminer l'icône en fonction de la variante
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <FaTrash className="me-2" />;
      case 'warning':
        return <FaExclamationTriangle className="me-2" />;
      default:
        return null;
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
        {cancelText}
      </Button>
      <Button
        variant={variant}
        onClick={onConfirm}
        isLoading={isConfirming}
        icon={getIcon()}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      {/* Contenu par défaut si aucun enfant n'est fourni */}
      {children || <p>Êtes-vous sûr de vouloir effectuer cette action ?</p>}
    </Modal>
  );
};

export default ConfirmDialog;