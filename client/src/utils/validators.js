import { getNestedValue } from './helpers';

/**
 * Valide une valeur par rapport à un ensemble de règles.
 */
const validateField = (value, rules) => {
  if (!rules.required && (value === null || value === undefined || value === '')) {
      return null;
  }
  if (rules.required && (value === null || value === undefined || value === '')) {
    return rules.required.message || 'Ce champ est obligatoire.';
  }
  if (rules.minLength && String(value).length < rules.minLength.value) {
    return rules.minLength.message || `Doit contenir au moins ${rules.minLength.value} caractères.`;
  }
  if (rules.maxLength && String(value).length > rules.maxLength.value) {
    return rules.maxLength.message || `Ne doit pas dépasser ${rules.maxLength.value} caractères.`;
  }
  if (rules.isEmail && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return rules.isEmail.message || 'Adresse email invalide.';
  }
  if (rules.isNumber && (isNaN(Number(value)) || String(value).trim() === '')) {
    return rules.isNumber.message || 'Doit être un nombre.';
  }
  if (rules.isPositive && Number(value) <= 0) {
      return rules.isPositive.message || 'Doit être un nombre positif.';
  }
  return null;
};

/**
 * Valide un objet de données complet par rapport à un schéma de validation.
 */
export const validateForm = (data, schema) => {
  const errors = {};
  for (const fieldName in schema) {
    const value = getNestedValue(data, fieldName);
    const rules = schema[fieldName];
    const error = validateField(value, rules);
    if (error) {
      errors[fieldName] = error;
    }
  }
  return errors;
};


// --- Schémas de validation pré-définis ---

export const loginValidationSchema = {
    email: {
        required: { message: 'L\'email est obligatoire.' },
        isEmail: { message: 'Adresse email invalide.' }
    },
    password: {
        required: { message: 'Le mot de passe est obligatoire.' }
    }
};

export const clientValidationSchema = {
  nom: {
    required: { message: 'Le nom du client est obligatoire.' },
    minLength: { value: 2, message: 'Le nom doit faire au moins 2 caractères.' }
  },
  email: {
    isEmail: { message: 'Veuillez entrer une adresse email valide.' }
  },
  type: {
    required: { message: 'Le type est obligatoire.' }
  }
};

// --- NOUVEAU SCHÉMA AJOUTÉ ---
export const fournisseurValidationSchema = {
  nom: {
    required: { message: 'Le nom du fournisseur est obligatoire.' },
  },
  email: {
    isEmail: { message: 'L\'email principal est invalide.' }
  },
  // Validation d'un champ imbriqué
  'contactPrincipal.email': {
    isEmail: { message: 'L\'email du contact est invalide.' }
  },
  evaluation: {
    isNumber: { message: 'L\'évaluation doit être un nombre.' }
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

export const parametresValidationSchema = {
    nomEntreprise: {
        required: { message: "Le nom de l'entreprise est obligatoire." }
    },
    email: {
        isEmail: { message: "L'adresse email est invalide." }
    },
};