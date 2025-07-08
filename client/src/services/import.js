import api from './api';

/**
 * Ce service gère les appels API pour l'importation de données en masse
 * depuis des fichiers (CSV, Excel, etc.).
 */

/**
 * Envoie un fichier au backend pour importer une liste de clients.
 *
 * @param {File} file - L'objet Fichier sélectionné par l'utilisateur.
 * @param {function} onUploadProgress - Une fonction de callback pour suivre la progression de l'upload.
 * @returns {Promise<object>} La réponse de l'API, contenant un résumé de l'importation.
 */
const importClients = async (file, onUploadProgress) => {
  // FormData est l'objet natif du navigateur pour envoyer des fichiers.
  const formData = new FormData();
  // Le nom du champ ('file' ici) doit correspondre à celui attendu par le middleware Multer sur le backend.
  formData.append('file', file);

  try {
    const response = await api.post('/clients/import', formData, {
      // Il est CRUCIAL de définir cet en-tête pour que le backend comprenne
      // qu'il reçoit des données de formulaire avec un fichier.
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Passer la fonction de callback à Axios pour le suivi de la progression.
      onUploadProgress,
    });
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error("Erreur lors de l'importation des clients :", error);
    const errorMessage = error.response?.data?.message || 'Échec de l\'importation.';
    return { success: false, error: errorMessage, details: error.response?.data?.errors };
  }
};


/**
 * Envoie un fichier au backend pour importer une liste de produits.
 *
 * @param {File} file - L'objet Fichier.
 * @param {function} onUploadProgress - La fonction de callback de progression.
 * @returns {Promise<object>} La réponse de l'API.
 */
const importProduits = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/produits/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Erreur lors de l'importation des produits :", error);
        const errorMessage = error.response?.data?.message || 'Échec de l\'importation.';
        return { success: false, error: errorMessage, details: error.response?.data?.errors };
    }
};


// Exporter les fonctions dans un objet.
const importService = {
  importClients,
  importProduits,
};

export default importService;