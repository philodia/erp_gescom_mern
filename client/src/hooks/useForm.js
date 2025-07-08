import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validators'; // On utilise notre utilitaire de validation

/**
 * Un hook personnalisé pour gérer l'état et la validation des formulaires.
 *
 * @param {object} initialValues - Les valeurs initiales du formulaire.
 * @param {object} validationSchema - Le schéma de validation à appliquer.
 * @param {function} onSubmitCallback - La fonction à appeler avec les données valides lors de la soumission.
 * @returns {object} Un objet contenant l'état du formulaire et les fonctions pour le manipuler.
 */
const useForm = (initialValues, validationSchema, onSubmitCallback) => {
  // État pour les valeurs du formulaire
  const [formData, setFormData] = useState(initialValues);
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // État pour savoir si le formulaire est en cours de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Gère les changements de valeur des champs du formulaire.
   * Utilise useCallback pour la performance, afin que la fonction ne soit pas
   * recréée à chaque re-rendu, sauf si setFormData change.
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
    
    // Optionnel : effacer l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  }, [errors]);

  /**
   * Gère la soumission du formulaire.
   * Valide les données et appelle le callback si tout est valide.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(formData, validationSchema);
    setErrors(validationErrors);

    // Si l'objet d'erreurs est vide, le formulaire est valide
    if (Object.keys(validationErrors).length === 0) {
      await onSubmitCallback(formData);
    }
    
    setIsSubmitting(false);
  };

  /**
   * Réinitialise le formulaire à ses valeurs initiales.
   */
  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  // Retourne l'état et les gestionnaires pour que le composant puisse les utiliser
  return {
    formData,
    setFormData, // Exposer setFormData pour des mises à jour manuelles si nécessaire
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useForm;