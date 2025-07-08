import { useState, useCallback } from 'react';

/**
 * Un hook personnalisé pour gérer l'état d'une fenêtre modale.
 *
 * @param {boolean} [initialState=false] - L'état initial de la modale (ouverte ou fermée).
 * @param {any} [initialData=null] - Les données initiales à passer à la modale.
 * @returns {object} Un objet contenant l'état de la modale et les fonctions pour la contrôler.
 */
const useModal = (initialState = false, initialData = null) => {
  // État pour la visibilité de la modale
  const [isOpen, setIsOpen] = useState(initialState);
  
  // État pour stocker les données à afficher dans la modale (ex: l'objet à modifier)
  const [modalData, setModalData] = useState(initialData);

  /**
   * Ouvre la modale et peut y passer des données.
   * Utilise useCallback pour la performance.
   */
  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  /**
   * Ferme la modale et réinitialise les données.
   * Utilise useCallback pour la performance.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // On peut ajouter un petit délai pour que les données ne disparaissent pas
    // brutalement pendant l'animation de fermeture de la modale.
    setTimeout(() => {
      setModalData(null);
    }, 300); // 300ms est généralement la durée de l'animation de fondu de Bootstrap
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    modalData,
  };
};

export default useModal;