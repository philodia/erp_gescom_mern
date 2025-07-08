import { 
    validateForm,
    clientValidationSchema,
    loginValidationSchema,
    produitValidationSchema,
    // Importer d'autres schémas au fur et à mesure de leur création
} from '../utils/validators';

/**
 * Service de validation pour les formulaires.
 * Fournit une interface simple pour valider des ensembles de données spécifiques
 * en utilisant les schémas de validation prédéfinis.
 */

/**
 * Valide les données d'un formulaire de connexion.
 * @param {object} credentials - L'objet contenant l'email et le mot de passe.
 * @returns {object} Un objet d'erreurs. Vide si la validation réussit.
 */
const validateLogin = (credentials) => {
    return validateForm(credentials, loginValidationSchema);
};

/**
 * Valide les données d'un formulaire client.
 * @param {object} clientData - Les données du client.
 * @returns {object} Un objet d'erreurs.
 */
const validateClient = (clientData) => {
    return validateForm(clientData, clientValidationSchema);
};

/**
 * Valide les données d'un formulaire produit.
 * @param {object} produitData - Les données du produit.
 * @returns {object} Un objet d'erreurs.
 */
const validateProduit = (produitData) => {
    return validateForm(produitData, produitValidationSchema);
};

// ... Ajoutez ici d'autres fonctions de validation pour chaque formulaire
// const validateFournisseur = (fournisseurData) => { ... };


// Exporter les fonctions dans un objet
const validationService = {
    validateLogin,
    validateClient,
    validateProduit,
    // validateFournisseur,
};

export default validationService;