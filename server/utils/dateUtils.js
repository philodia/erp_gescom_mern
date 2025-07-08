const {
  add,
  sub,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isAfter,
  isBefore,
  differenceInDays,
  parseISO,
} = require('date-fns');

/**
 * Ajoute une certaine durée à une date.
 * @param {Date} date - La date de départ.
 * @param {object} duration - L'objet durée (ex: { days: 30, months: 1 }).
 * @returns {Date} La nouvelle date.
 * @example addDuration(new Date(), { days: 30 }) // Retourne la date dans 30 jours
 */
exports.addDuration = (date, duration) => {
  return add(date, duration);
};

/**
 * Calcule une date d'échéance à partir d'une date de départ et d'un nombre de jours.
 * @param {Date} startDate - La date d'émission.
 * @param {number} days - Le nombre de jours pour l'échéance (ex: 30 pour "Net 30").
 * @returns {Date} La date d'échéance.
 */
exports.calculateDueDate = (startDate, days = 30) => {
  return add(startDate, { days });
};

/**
 * Vérifie si une facture est en retard.
 * @param {Date|string} dueDate - La date d'échéance de la facture.
 * @returns {boolean} True si la facture est en retard, false sinon.
 */
exports.isOverdue = (dueDate) => {
  const dateToCompare = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  // La facture est en retard si la date d'aujourd'hui est APRÈS la date d'échéance.
  return isAfter(startOfDay(new Date()), startOfDay(dateToCompare));
};

/**
 * Calcule le nombre de jours de retard pour une facture.
 * @param {Date|string} dueDate - La date d'échéance.
 * @returns {number} Le nombre de jours de retard (0 si pas en retard).
 */
exports.getOverdueDays = (dueDate) => {
  if (!exports.isOverdue(dueDate)) {
    return 0;
  }
  const dateToCompare = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return differenceInDays(startOfDay(new Date()), startOfDay(dateToCompare));
};

/**
 * Renvoie les dates de début et de fin pour une période donnée.
 * @param {string} period - La période ('today', 'this_month', 'this_year').
 * @param {Date} [refDate=new Date()] - La date de référence pour le calcul.
 * @returns {{startDate: Date, endDate: Date}} Les dates de début et de fin.
 */
exports.getPeriodDates = (period, refDate = new Date()) => {
  switch (period) {
    case 'this_month':
      return {
        startDate: startOfMonth(refDate),
        endDate: endOfMonth(refDate),
      };
    case 'this_year':
      return {
        startDate: startOfYear(refDate),
        endDate: endOfYear(refDate),
      };
    case 'today':
    default:
      return {
        startDate: startOfDay(refDate),
        endDate: endOfDay(refDate),
      };
  }
};

/**
 * Renvoie le début de la journée pour une date donnée (00:00:00).
 * @param {Date} date
 * @returns {Date}
 */
exports.getStartOfDay = (date = new Date()) => {
    return startOfDay(date);
};

/**
 * Renvoie la fin de la journée pour une date donnée (23:59:59.999).
 * @param {Date} date
 * @returns {Date}
 */
exports.getEndOfDay = (date = new Date()) => {
    return endOfDay(date);
};
