import { useState, useCallback } from 'react';

/**
 * Un hook personnalisé pour gérer les appels API de manière simple et réutilisable.
 * Il encapsule les états de chargement, d'erreur et de données pour un appel API spécifique.
 *
 * @param {function} apiFunc - La fonction du service API à exécuter (ex: clientService.getClients).
 * @returns {{
 *   data: any | null,
 *   error: string | null,
 *   isLoading: boolean,
 *   request: (...args: any[]) => Promise<any>
 * }} - Un objet contenant les données, l'erreur, l'état de chargement, et la fonction pour lancer la requête.
 */
const useApi = (apiFunc) => {
  // État pour stocker les données reçues de l'API
  const [data, setData] = useState(null);
  // État pour stocker le message d'erreur
  const [error, setError] = useState(null);
  // État pour savoir si la requête est en cours
  const [isLoading, setIsLoading] = useState(false);

  // La fonction pour exécuter l'appel API.
  // On utilise useCallback pour mémoriser la fonction et éviter des re-render inutiles.
  // Elle peut accepter des arguments qui seront passés à la fonction apiFunc.
  const request = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null); // Réinitialiser les erreurs précédentes
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result; // Retourner le résultat en cas de succès
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Une erreur est survenue.';
        setError(errorMessage);
        throw err; // Lancer l'erreur pour que le code appelant puisse la gérer aussi (ex: avec .catch())
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc] // La fonction se recrée uniquement si apiFunc change
  );

  return { data, error, isLoading, request };
};

export default useApi;