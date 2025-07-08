import api from './api';
import { saveAs } from 'file-saver';

/**
 * Ce service gère les appels API pour générer et télécharger des fichiers
 * depuis le backend (PDF, Excel, etc.).
 */

/**
 * Gère le téléchargement d'un fichier binaire depuis l'API.
 *
 * @param {Promise<AxiosResponse>} apiCall - L'appel API (ex: api.get(...)).
 * @param {string} defaultFilename - Le nom de fichier par défaut si le serveur ne le fournit pas.
 */
const downloadFile = async (apiCall, defaultFilename) => {
  try {
    const response = await apiCall;
    
    // Récupérer le nom du fichier depuis les en-têtes de la réponse
    const contentDisposition = response.headers['content-disposition'];
    let filename = defaultFilename;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    
    // Créer un Blob à partir des données de la réponse
    // Le 'responseType' doit être 'blob' ou 'arraybuffer' dans la config de l'appel api.
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
    // Utiliser file-saver pour déclencher le téléchargement
    saveAs(blob, filename);
    
    return { success: true };
    
  } catch (error) {
    console.error(`Erreur lors du téléchargement du fichier :`, error);
    // On pourrait essayer de lire le message d'erreur si la réponse est en JSON
    let errorMessage = 'Impossible de télécharger le fichier.';
    if (error.response && error.response.data instanceof Blob) {
      try {
        const errorJson = await error.response.data.text();
        const errorObj = JSON.parse(errorJson);
        errorMessage = errorObj.message || errorMessage;
      } catch (e) {
        // L'erreur n'est pas en JSON, on garde le message par défaut
      }
    } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};


/**
 * Télécharge une facture au format PDF.
 * @param {string} factureId - L'ID de la facture à télécharger.
 */
const exportFacturePDF = (factureId) => {
  const apiCall = api.get(`/documents/facture/${factureId}/pdf`, {
    responseType: 'blob', // Important: dit à axios de traiter la réponse comme un fichier binaire
  });
  return downloadFile(apiCall, `facture-${factureId}.pdf`);
};

/**
 * Exporte une liste de clients au format Excel.
 * @param {object} [filters] - Filtres optionnels pour l'export.
 */
const exportClientsExcel = (filters = {}) => {
  const apiCall = api.get('/clients/export/excel', {
    params: filters, // Passe les filtres en query params
    responseType: 'blob',
  });
  const defaultFilename = `export-clients-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return downloadFile(apiCall, defaultFilename);
};

// Ajoutez d'autres fonctions d'export ici...
// const exportRapportVentesPDF = (period) => { ... };


// Exporter les fonctions dans un objet
const exportService = {
  exportFacturePDF,
  exportClientsExcel,
};

export default exportService;