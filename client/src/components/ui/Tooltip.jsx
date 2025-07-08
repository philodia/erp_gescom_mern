import React from 'react';
import { Tooltip as BootstrapTooltip, OverlayTrigger } from 'react-bootstrap';

/**
 * Un composant Tooltip qui enveloppe un élément enfant et affiche une infobulle au survol.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - L'élément sur lequel l'infobulle doit apparaître.
 * @param {string|React.ReactNode} props.text - Le contenu de l'infobulle.
 * @param {'top'|'right'|'bottom'|'left'} [props.placement='top'] - La position de l'infobulle par rapport à l'élément.
 * @param {string} [props.id] - Un ID unique pour l'infobulle, requis pour l'accessibilité. Si non fourni, un ID aléatoire est généré.
 * @returns {JSX.Element|React.ReactNode}
 */
const Tooltip = ({ children, text, placement = 'top', id }) => {
  // Ne pas rendre le wrapper si le texte de l'infobulle ou l'enfant est manquant.
  if (!text || !children) {
    return children;
  }

  // Génère un ID aléatoire si aucun n'est fourni, pour assurer le fonctionnement.
  const tooltipId = id || `tooltip-${Math.random().toString(36).substring(2, 9)}`;

  // Crée l'élément de l'infobulle
  const renderTooltip = (props) => (
    <BootstrapTooltip id={tooltipId} {...props}>
      {text}
    </BootstrapTooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 250, hide: 400 }} // Délai pour une meilleure UX
      overlay={renderTooltip}
    >
      {/* L'enfant doit être un élément qui peut accepter une 'ref'.
          react-bootstrap s'en occupe pour la plupart des composants,
          mais pour des éléments HTML natifs, il faut parfois les wrapper.
          Ici, on wrappe dans un span pour garantir la compatibilité. */}
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default Tooltip;