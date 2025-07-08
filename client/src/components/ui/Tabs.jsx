import React from 'react';
import { Tabs as BootstrapTabs, Tab as BootstrapTab } from 'react-bootstrap';

/**
 * Un composant Tabs personnalisé qui simplifie la création d'onglets.
 * Il est piloté par un tableau de configuration et gère l'état de l'onglet actif.
 *
 * @param {object} props
 * @param {Array<{ eventKey: string, title: string, content: React.ReactNode, icon?: React.ComponentType, disabled?: boolean }>} props.tabs - Le tableau de configuration des onglets.
 * @param {string} props.defaultActiveKey - La clé de l'onglet à afficher par défaut. Si non fournie, le premier onglet sera actif.
 * @param {'tabs'|'pills'} [props.variant='tabs'] - L'apparence des onglets.
 * @param {boolean} [props.unmountOnExit=true] - Si true, le contenu des onglets inactifs est retiré du DOM, ce qui peut améliorer les performances.
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 * @returns {JSX.Element}
 */
const Tabs = ({ 
  tabs = [], 
  defaultActiveKey,
  variant = 'tabs',
  unmountOnExit = true,
  className,
  ...rest
}) => {
  // L'état de l'onglet actif est géré par le composant BootstrapTabs lui-même.
  // `defaultActiveKey` est utilisé pour définir l'onglet initial.
  const activeKey = defaultActiveKey || (tabs.length > 0 ? tabs[0].eventKey : '');

  if (tabs.length === 0) {
    return null; // Ne rien afficher si aucun onglet n'est fourni
  }

  return (
    <BootstrapTabs
      defaultActiveKey={activeKey}
      variant={variant}
      unmountOnExit={unmountOnExit}
      className={`custom-tabs ${className || ''}`}
      {...rest}
    >
      {tabs.map(({ eventKey, title, content, icon: Icon, disabled }) => (
        <BootstrapTab
          key={eventKey}
          eventKey={eventKey}
          title={
            <span className="d-flex align-items-center">
              {Icon && <Icon className="me-2" />}
              {title}
            </span>
          }
          disabled={disabled || false}
        >
          {/* Le contenu est rendu ici lorsque l'onglet est actif */}
          <div className="p-3 border border-top-0">
            {content}
          </div>
        </BootstrapTab>
      ))}
    </BootstrapTabs>
  );
};

export default Tabs;