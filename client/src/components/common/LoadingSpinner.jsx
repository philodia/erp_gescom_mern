import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Composant de chargement réutilisable.
 *
 * @param {object} props - Les propriétés du composant.
 * @param {boolean} [props.asOverlay=false] - Si vrai, affiche le spinner en plein écran avec un fond semi-transparent.
 * @param {('sm'|'md'|'lg')} [props.size] - La taille du spinner (petit, moyen, grand).
 * @param {string} [props.text='Chargement...'] - Un texte à afficher sous le spinner (surtout utile en mode overlay).
 * @param {string} [props.className] - Des classes CSS supplémentaires.
 */
const LoadingSpinner = ({ asOverlay = false, size, text = 'Chargement...', className }) => {
  const spinner = (
    <div className={`d-flex flex-column justify-content-center align-items-center ${className || ''}`}>
      <Spinner
        animation="border"
        role="status"
        style={{
          width: size === 'lg' ? '3rem' : size === 'sm' ? '1rem' : '2rem',
          height: size === 'lg' ? '3rem' : size === 'sm' ? '1rem' : '2rem',
        }}
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && asOverlay && <p className="mt-3 text-light">{text}</p>}
    </div>
  );

  if (asOverlay) {
    return (
      <div className="loading-spinner-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;