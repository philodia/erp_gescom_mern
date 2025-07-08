import { useState, useEffect } from 'react';

/**
 * Un hook personnalisé qui "débounce" une valeur.
 * Il ne met à jour la valeur retournée qu'après un certain délai
 * sans que la valeur d'entrée n'ait changé.
 * C'est très utile pour des opérations coûteuses comme les appels API
 * dans une barre de recherche.
 *
 * @param {any} value - La valeur à "débouncer" (ex: le texte d'un input).
 * @param {number} [delay=500] - Le délai en millisecondes.
 * @returns {any} La valeur "débouncée".
 */
const useDebounce = (value, delay = 500) => {
  // 1. État pour stocker la valeur "débouncée"
  const [debouncedValue, setDebouncedValue] = useState(value);

  // 2. useEffect pour gérer le délai
  useEffect(
    () => {
      // Met en place un minuteur (timer) qui mettra à jour la valeur "débouncée"
      // après le délai spécifié.
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Fonction de nettoyage de l'effet.
      // Elle est appelée chaque fois que la valeur d'entrée (`value`) ou le délai (`delay`) change.
      // Elle annule le minuteur précédent, empêchant ainsi la mise à jour si
      // l'utilisateur continue de taper.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // L'effet ne se redéclenche que si la valeur ou le délai change.
  );

  // 3. Retourne la valeur "débouncée"
  return debouncedValue;
};

export default useDebounce;