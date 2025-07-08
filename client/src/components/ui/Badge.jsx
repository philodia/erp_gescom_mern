import React from 'react';
import { Badge as BootstrapBadge } from 'react-bootstrap';

/**
 * Un composant Badge personnalisé qui mappe des statuts ou des types
 * à des couleurs Bootstrap spécifiques.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Le texte à afficher dans le badge.
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'|string} [props.variant='secondary'] - La couleur du badge. Peut être un variant Bootstrap direct ou un statut personnalisé.
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 * @returns {JSX.Element|null}
 */
const Badge = ({ children, variant = 'secondary', className, ...rest }) => {
  // Mapper des statuts textuels à des couleurs Bootstrap
  const getVariant = (status) => {
    // On convertit en minuscules et sans espaces pour une comparaison robuste
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase().replace(/\s/g, '') : '';
    
    switch (normalizedStatus) {
      // Statuts de facture/paiement
      case 'payée':
      case 'payee':
      case 'paid':
        return 'success';
      case 'enattente':
      case 'pending':
        return 'warning';
      case 'annulée':
      case 'annulee':
      case 'cancelled':
      case 'enretard':
      case 'overdue':
        return 'danger';
      case 'brouillon':
      case 'draft':
        return 'secondary';
      case 'partiellementpayée':
      case 'partiallypaid':
        return 'info';
        
      // Statuts de rôle utilisateur
      case 'admin':
        return 'primary';
      case 'comptable':
        return 'info';
      case 'commercial':
        return 'success';
      case 'vendeur':
        return 'secondary';
        
      // Types de tiers
      case 'client':
        return 'primary';
      case 'prospect':
        return 'warning';

      // Par défaut, on utilise la variante fournie ou 'secondary'
      default:
        return variant;
    }
  };

  // Ne rien afficher si le badge n'a pas de contenu
  if (!children) {
    return null;
  }

  return (
    <BootstrapBadge 
      bg={getVariant(children)} // On utilise la prop `bg` pour une meilleure compatibilité avec Bootstrap 5
      className={className}
      {...rest}
    >
      {children}
    </BootstrapBadge>
  );
};

export default Badge;