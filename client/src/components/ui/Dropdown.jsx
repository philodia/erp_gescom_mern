import React from 'react';
import { Dropdown as BootstrapDropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa'; // Une icône par défaut pour le déclencheur

/**
 * Un composant Dropdown personnalisé, idéal pour les menus d'actions.
 * Il accepte un déclencheur personnalisé et une liste d'éléments de menu.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.trigger] - Le composant qui déclenche l'ouverture du dropdown. Par défaut, une icône "trois points".
 * @param {Array<{label: string, onClick: function, icon?: React.ComponentType, isSeparator?: boolean, isHeader?: boolean, disabled?: boolean}>} props.items - Le tableau des éléments du menu.
 * @param {'end'|'start'|'down'|'up'|'left'|'right'} [props.align='end'] - L'alignement du menu. 'end' est courant pour les menus d'actions.
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 * @returns {JSX.Element}
 */
const Dropdown = ({
  trigger,
  items = [],
  align = 'end',
  className,
  ...rest
}) => {

  // Déclencheur par défaut si aucun n'est fourni
  const defaultTrigger = (
    <button className="btn btn-link text-secondary p-0">
      <FaEllipsisV />
    </button>
  );

  return (
    <BootstrapDropdown className={className} align={align} {...rest}>
      <BootstrapDropdown.Toggle as="div" className="dropdown-toggle-no-caret">
        {trigger || defaultTrigger}
      </BootstrapDropdown.Toggle>

      <BootstrapDropdown.Menu>
        {items.map((item, index) => {
          // Gérer les séparateurs
          if (item.isSeparator) {
            return <BootstrapDropdown.Divider key={`divider-${index}`} />;
          }

          // Gérer les en-têtes de section
          if (item.isHeader) {
            return <BootstrapDropdown.Header key={`header-${index}`}>{item.label}</BootstrapDropdown.Header>;
          }

          // Gérer les éléments de menu cliquables
          return (
            <BootstrapDropdown.Item
              key={item.label + index}
              onClick={item.onClick}
              disabled={item.disabled || false}
            >
              {item.icon && <item.icon className="me-2" />}
              {item.label}
            </BootstrapDropdown.Item>
          );
        })}
      </BootstrapDropdown.Menu>
    </BootstrapDropdown>
  );
};

export default Dropdown;