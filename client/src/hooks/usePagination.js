import { useState, useMemo } from 'react';
import config from '../utils/config';

/**
 * Un hook personnalisé pour gérer la logique de pagination côté client.
 *
 * @param {Array<any>} data - Le tableau complet des données à paginer.
 * @param {object} [options] - Options de configuration.
 * @param {number} [options.initialPage=1] - La page de départ.
 * @param {number} [options.initialPageSize=10] - Le nombre d'éléments par page par défaut.
 * @returns {object} Un objet contenant les données paginées et les contrôles de pagination.
 */
const usePagination = (data = [], options = {}) => {
  // Récupérer la configuration par défaut
  const { 
    initialPage = config.pagination.defaultPage,
    initialPageSize = config.pagination.defaultPageSize 
  } = options;

  // États pour la page actuelle et le nombre d'éléments par page
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculer le nombre total de pages en utilisant useMemo pour la performance.
  // Ce calcul ne sera refait que si `data` ou `pageSize` changent.
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);
  
  // Calculer les données à afficher pour la page actuelle.
  // useMemo est également crucial ici pour ne pas refaire le 'slice' à chaque re-rendu.
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Fonctions de contrôle de la pagination
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (pageNumber) => {
    const pageNum = Number(pageNumber);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };
  
  const changePageSize = (newPageSize) => {
      setPageSize(Number(newPageSize));
      setCurrentPage(1); // Revenir à la première page lors du changement de taille
  };

  // Déterminer si les boutons "précédent" et "suivant" doivent être actifs
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  return {
    // Données
    paginatedData,
    
    // Informations
    currentPage,
    totalPages,
    totalItems: data.length,
    pageSize,

    // Contrôles
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    
    // États
    canGoNext,
    canGoPrev,
  };
};

export default usePagination;