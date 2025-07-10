import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

/**
 * Un composant de contrôle de pagination réutilisable.
 *
 * @param {object} props
 * @param {number} props.currentPage - La page actuellement affichée.
 * @param {number} props.totalPages - Le nombre total de pages.
 * @param {function(number): void} props.onPageChange - La fonction à appeler lorsqu'une page est cliquée.
 * @param {boolean} [props.alwaysShow=false] - Si false, le composant ne s'affiche pas s'il n'y a qu'une seule page.
 * @returns {JSX.Element|null}
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  alwaysShow = false,
}) => {

  // Ne pas afficher la pagination s'il n'y a qu'une page ou moins
  if (!alwaysShow && totalPages <= 1) {
    return null;
  }

  /**
   * Génère les numéros de page à afficher, avec des ellipses (...) pour les longues listes.
   * @returns {Array<number|string>} Un tableau de numéros de page et/ou d'ellipses.
   */
  const getPaginationItems = () => {
    const items = [];
    const pageNeighbours = 2; // Nombre de pages à afficher de chaque côté de la page actuelle

    // S'il n'y a pas assez de pages pour justifier les ellipses
    if (totalPages <= pageNeighbours * 2 + 1) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Afficher la première page
      items.push(1);
      
      // Ellipse de début
      if (currentPage > pageNeighbours + 1) {
        items.push('...');
      }

      // Pages autour de la page actuelle
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      // Ellipse de fin
      if (currentPage < totalPages - pageNeighbours) {
        items.push('...');
      }

      // Afficher la dernière page
      items.push(totalPages);
    }
    return items;
  };
  
  const paginationItems = getPaginationItems();

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      
      {paginationItems.map((item, index) => {
        if (item === '...') {
          return <BootstrapPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
        }
        
        return (
          <BootstrapPagination.Item
            key={item}
            active={item === currentPage}
            onClick={() => onPageChange(item)}
          >
            {item}
          </BootstrapPagination.Item>
        );
      })}

      <BootstrapPagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </BootstrapPagination>
  );
};

export default Pagination;