import { 
  add,  
  isAfter, 
  isBefore, 
  isToday, 
  isYesterday,
  parseISO,
  format,
  differenceInDays,
} from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la locale française pour les noms de jours/mois

/**
 * Formate une date dans une chaîne de caractères lisible en utilisant date-fns.
 *
 * @param {string|Date|number} dateInput - La date à formater.
 * @param {string} [formatStr='dd/MM/yyyy'] - Le format de sortie (ex: 'dd LLL yyyy', 'PPP').
 * @returns {string} La date formatée.
 */
export const formatDate = (dateInput, formatStr = 'dd/MM/yyyy') => {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, formatStr, { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Calcule la date d'échéance à partir d'une date de début.
 * @param {Date|number} startDate - La date de départ.
 * @param {number} [days=30] - Le nombre de jours pour l'échéance.
 * @returns {Date}
 */
export const calculateDueDate = (startDate, days = 30) => {
  return add(startDate, { days });
};

/**
 * Vérifie si une date est dans le futur.
 * @param {Date|number} date
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  return isAfter(date, new Date());
};

/**
 * Vérifie si une date est dans le passé.
 * @param {Date|number} date
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  return isBefore(date, new Date());
};

/**
 * Vérifie si une date est aujourd'hui.
 * @param {Date|number} date
 * @returns {boolean}
 */
export const isDateToday = (date) => {
  return isToday(date);
};

/**
 * Calcule la différence en jours entre deux dates.
 * @param {Date|number} dateLeft - La date la plus récente.
 * @param {Date|number} dateRight - La date la plus ancienne.
 * @returns {number} Le nombre de jours de différence.
 */
export const getDaysDifference = (dateLeft, dateRight) => {
    return differenceInDays(dateLeft, dateRight);
};


/**
 * Fournit une représentation textuelle relative d'une date (ex: "Aujourd'hui", "Hier", "Il y a 5 jours").
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const getRelativeDate = (dateInput) => {
    if (!dateInput) return '';
    try {
        const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
        const now = new Date();
        const daysDiff = differenceInDays(now, date);

        if (isToday(date)) return "Aujourd'hui";
        if (isYesterday(date)) return "Hier";
        if (daysDiff > 0 && daysDiff < 7) return `Il y a ${daysDiff} jours`;
        if (daysDiff === 1) return `Il y a 1 jour`;
        
        // Pour les dates futures
        const futureDaysDiff = differenceInDays(date, now);
        if (futureDaysDiff === 0) return "Aujourd'hui";
        if (futureDaysDiff === 1) return "Demain";
        if (futureDaysDiff > 1 && futureDaysDiff < 7) return `Dans ${futureDaysDiff} jours`;
        
        return formatDate(date, 'dd/MM/yyyy'); // Format par défaut pour les dates plus anciennes/futures
    } catch (error) {
        return 'Date invalide';
    }
};