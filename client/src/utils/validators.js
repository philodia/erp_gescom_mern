/**
 * Ce module fournit des fonctions de validation pour les formulaires côté client.
 * Il permet de vérifier les données avant de les soumettre à l'API.
 */

/**
 * Valide une valeur par rapport à un ensemble de règles.
 *
 * @param {any} value - La valeur à valider.
 * @param {object} rules - Un objet de règles de validation.
 * @returns {string|null} Un message d'erreur si la validation échoue, sinon null.
 */
const validateField = (value, rules) => {
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

  // Vous pouvez ajouter d'autres règles ici (isUrl, isSameAs, etc.)

  return null; // Pas d'erreur
};


/**
 * Valide un objet de données complet par rapport à un schéma de validation.
 *
 * @param {object} data - L'objet de données du formulaire (ex: { nom: 'test', email: '' }).
 * @param {object} schema - L'objet décrivant les règles pour chaque champ.
 * @returns {object} Un objet contenant les erreurs. Est vide s'il n'y a pas d'erreur.
 */
export const validateForm = (data, schema) => {
  const errors = {};

  for (const fieldName in schema) {
    if (Object.hasOwnProperty.call(data, fieldName)) {
      const error = validateField(data[fieldName], schema[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    }
  }

  return errors;
};


// --- Schémas de validation pré-définis pour nos formulaires ---

export const clientValidationSchema = {
  nom: {
    required: { message: 'Le nom du client est obligatoire.' },
    minLength: { value: 2, message: 'Le nom doit faire au moins 2 caractères.' }
  },
  email: {
    // Non requis, mais si fourni, doit être un email valide
    isEmail: { message: 'Veuillez entrer une adresse email valide.' }
  },
  type: {
    required: { message: 'Le type est obligatoire.' }
  }
};

export const loginValidationSchema = {
    email: {
        required: { message: 'L\'email est obligatoire.' },
        isEmail: { message: 'Adresse email invalide.' }
    },
    password: {
        required: { message: 'Le mot de passe est obligatoire.' }
    }
};

export const produitValidationSchema = {
    nom: {
        required: { message: 'Le nom du produit est obligatoire.' },
    },
    reference: {
        required: { message: 'La référence est obligatoire.' },
    },
    prixVente: {
        required: { message: 'Le prix de vente est obligatoire.' },
        isNumber: { message: 'Le prix doit être un nombre.' },
        isPositive: { message: 'Le prix doit être positif.'}
    }
};