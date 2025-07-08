/**
 * Ce service agit comme une façade (facade) pour regrouper et ré-exporter
 * diverses fonctions utilitaires de l'application.
 * Cela simplifie les imports dans les composants qui ont besoin de plusieurs
 * types d'utilitaires.
 */

// 1. Importer toutes les fonctions depuis les modules utilitaires spécifiques
import * as formatters from '../utils/formatters';
import * as calculations from '../utils/calculations';
import * as dateUtils from '../utils/dateUtils';
import * as helpers from '../utils/helpers';
import * as permissions from '../utils/permissions';

// 2. Créer un objet unique qui contient toutes ces fonctions
const utilsService = {
  // Fonctions de formatage (formatCurrency, formatDate, etc.)
  ...formatters,
  
  // Fonctions de calcul (calculateLigneTotal, etc.)
  ...calculations,
  
  // Fonctions de manipulation de dates (getRelativeDate, etc.)
  ...dateUtils,
  
  // Fonctions d'aide diverses (classNames, debounce, etc.)
  ...helpers,
  
  // Fonctions et objets de permission (PERMISSIONS)
  // Note: le hook usePermissions ne peut pas être ici car c'est un hook React.
  PERMISSIONS: permissions.PERMISSIONS
};


// 3. Exporter l'objet unique
export default utilsService;