import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Un composant standardisé pour afficher un indicateur de chargement.
 *
 * @param {object} props
 * @param {boolean} [props.asOverlay=false] - Si true, affiche le spinner en superposition avec un fond semi-transparent.
 * @param {string} [props.text] - Un texte à afficher sous le spinner.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - La taille du spinner. 'md' est une valeur personnalisée.
 * @param {string} [props.variant='primary'] - La couleur du spinner.
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({
  asOverlay = false,
  text = "Chargement...",
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const spinner = (
    <div className={`d-flex flex-column align-items-center ${className || ''}`}>
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        style={{
            width: size === 'lg' ? '3rem' : size === 'sm' ? '1rem' : '2rem',
            height: size === 'lg' ? '3rem' : size === 'sm' ? '1rem' : '2rem',
        }}
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && <div className="mt-2 small">{text}</div>}
    </div>
  );

  if (asOverlay) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          borderRadius: 'var(--border-radius)', // Pour correspondre au parent (ex: une Card)
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;