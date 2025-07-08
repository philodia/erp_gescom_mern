// On utilise une approche de "late initialization"
// L'instance de socket.io sera injectée après sa création dans server.js
let io = null;

class NotificationService {
  /**
   * Initialise le service avec l'instance de Socket.IO.
   * Doit être appelé une seule fois au démarrage du serveur.
   * @param {object} socketIoInstance - L'instance de Socket.IO créée dans server.js.
   */
  init(socketIoInstance) {
    if (!io) {
      io = socketIoInstance;
      console.log('✅ Service de notification initialisé.');
    }
  }

  /**
   * Envoie une notification à tous les utilisateurs connectés.
   * @param {string} eventName - Le nom de l'événement à émettre (ex: 'nouvelle_commande').
   * @param {object} data - Les données de la notification.
   */
  sendToAll(eventName, data) {
    if (!io) {
      console.error('Le service de notification n\'a pas été initialisé.');
      return;
    }
    io.emit(eventName, data);
    console.log(`📢 Notification envoyée à tous: ${eventName}`);
  }

  /**
   * Envoie une notification à un utilisateur spécifique.
   * @param {string} userId - L'ID de l'utilisateur destinataire.
   * @param {string} eventName - Le nom de l'événement à émettre.
   * @param {object} data - Les données de la notification.
   */
  sendToUser(userId, eventName, data) {
    if (!io) {
      console.error('Le service de notification n\'a pas été initialisé.');
      return;
    }
    // 'to' envoie le message uniquement aux sockets qui ont rejoint cette "room"
    io.to(userId).emit(eventName, data);
    console.log(`🎯 Notification envoyée à l'utilisateur ${userId}: ${eventName}`);
  }

  /**
   * Envoie une notification à tous les utilisateurs ayant un rôle spécifique.
   * C'est une méthode de haut niveau qui nécessite que l'on puisse mapper les rôles aux userIds.
   * Pour l'instant, on va simuler l'envoi à tous les admins par exemple.
   * Pour une vraie implémentation, il faudrait une gestion des sockets/rôles plus fine.
   *
   * @param {string} role - Le rôle destinataire (ex: 'Admin', 'Comptable').
   * @param {string} eventName - Le nom de l'événement.
   * @param {object} data - Les données.
   */
  sendToRole(role, eventName, data) {
    if (!io) {
      console.error('Le service de notification n\'a pas été initialisé.');
      return;
    }
    // Pour une implémentation simple, on peut émettre vers une "room" de rôle.
    // Les clients devraient rejoindre la room de leur rôle à la connexion.
    io.to(`role_${role}`).emit(eventName, data);
    console.log(`🎭 Notification envoyée au rôle ${role}: ${eventName}`);
  }
}

module.exports = new NotificationService();
