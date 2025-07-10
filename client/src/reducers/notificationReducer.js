/**
 * Ce fichier définit les actions et le reducer pour gérer l'état
 * de la liste des notifications.
 */

// 1. Définir et exporter les types d'actions.
//    Cela évite les fautes de frappe et centralise les actions possibles.
export const NOTIFICATION_ACTIONS = Object.freeze({
    ADD: 'add_notification',
    MARK_AS_READ: 'mark_as_read',
    MARK_ALL_AS_READ: 'mark_all_as_read',
    CLEAR_ALL: 'clear_all',
    RESET: 'reset'
});


/**
 * La fonction reducer pour les notifications.
 * C'est une fonction pure : pour un état et une action donnés,
 * elle retourne toujours le même nouvel état.
 *
 * @param {Array<object>} state - L'état actuel (le tableau des notifications).
 * @param {object} action - L'action à effectuer.
 * @param {string} action.type - Le type de l'action (doit être une des clés de NOTIFICATION_ACTIONS).
 * @param {object} [action.payload] - Les données associées à l'action.
 * @returns {Array<object>} Le nouvel état.
 */
export const notificationReducer = (state, action) => {
    switch (action.type) {
        
        case NOTIFICATION_ACTIONS.ADD:
            // Le payload est la nouvelle notification déjà formatée.
            if (!action.payload) return state;
            // Ajoute la nouvelle notification en haut de la liste.
            // Limite la taille de la liste à 50 pour éviter une consommation mémoire infinie.
            return [action.payload, ...state.slice(0, 49)];

        case NOTIFICATION_ACTIONS.MARK_AS_READ:
            if (!action.payload?.id) return state;
            return state.map(notification => 
                notification.id === action.payload.id 
                    ? { ...notification, read: true } 
                    : notification
            );

        case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
            // Ne recrée le tableau que s'il y a des notifications non lues.
            if (state.every(n => n.read)) return state;
            return state.map(notification => 
                notification.read ? notification : { ...notification, read: true }
            );

        case NOTIFICATION_ACTIONS.CLEAR_ALL:
        case NOTIFICATION_ACTIONS.RESET:
            // Retourne un nouveau tableau vide.
            return [];
            
        default:
            // Si une action non reconnue est dispatchée, on lance une erreur
            // pour aider au débogage en développement.
            throw new Error(`Action non gérée dans notificationReducer: ${action.type}`);
    }
};