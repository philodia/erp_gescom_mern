import { getNestedValue } from './helpers'; // Importer notre helper

/**
 * Ce module fournit des fonctions de validation pour les formulaires côté client.
 */

/**
 * Valide une valeur par rapport à un ensemble de règles.
 * (Cette fonction reste inchangée, elle est déjà générique)
 */
const validateField = (value, rules) => {
  // --- AMÉLIORATION: Gérer le cas où le champ n'est pas requis ---
  // Si le champ n'est pas requis et qu'il est vide, on arrête la validation ici.
  if (!rules.required && (value === null || value === undefined || value === '')) {
      return null;
  }
    
  if (rules.required && (value === null || value === undefined || value === '')) {
    return rules.required.message || 'Ce champ est obligatoire.';
  }

  if (rules.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message || `Doit contenir au moins ${rules.minLength.value} caractères.`;
  }

  if (rules.maxLength && value.length > rules.maxLength.value) {
    return rules.maxLength.message || `Ne doit pas dépasser ${rules.maxLength.value} caractères.`;
  }

  if (rules.isEmail && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return rules.isEmail.message || 'Adresse email invalide.';
  }
  
  if (rules.isNumber && isNaN(Number(value))) {
    return rules.isNumber.message || 'Doit être un nombre.';
  }

  if (rules.isPositive && Number(value) <= 0) {
      return rules.isPositive.message || 'Doit être un nombre positif.';
  }

  return null; // Pas d'erreur
};


/**
 * Valide un objet de données complet par rapport à un schéma de validation.
 * Gère maintenant les schémas avec des clés imbriquées (ex: 'adresse.ville').
 *
 * @param {object} data - L'objet de données du formulaire.
 * @param {object} schema - L'objet décrivant les règles pour chaque champ.
 * @returns {object} Un objet contenant les erreurs.
 */
export const validateForm = (data, schema) => {
  const errors = {};

  for (const fieldName in schema) {
    // Utiliser notre helper `getNestedValue` pour récupérer la valeur,
    // même si elle est dans un objet imbriqué.
    const value = getNestedValue(data, fieldName);
    
    // Récupérer les règles pour ce champ.
    const rules = schema[fieldName];
    
    // Valider le champ.
    const error = validateField(value, rules);
    
    if (error) {
      // Stocker l'erreur. Pour les champs imbriqués, on pourrait aussi
      // construire un objet d'erreur imbriqué, mais un objet plat est plus simple à gérer.
      errors[fieldName] = error;
    }
  }

  return errors;
};


// --- Schémas de validation pré-définis ---

export const clientValidationSchema = { /* ... reste inchangé ... */ };
export const loginValidationSchema = { /* ... reste inchangé ... */ };
export const produitValidationSchema = { /* ... reste inchangé ... */ };

// On peut maintenant créer un schéma pour les paramètres
export const parametresValidationSchema = {
    nomEntreprise: {
        required: { message: "Le nom de l'entreprise est obligatoire." }
    },
    email: {
        isEmail: { message: "L'adresse email est invalide." }
    },
    'adresse.ville': { // Utilisation de la notation pointée
        required: { message: "La ville est obligatoire." }
    }
};