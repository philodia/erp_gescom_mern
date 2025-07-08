import { io } from 'socket.io-client';
import config from '../utils/config';

class NotificationService {
  socket = null;

  /**
   * Établit la connexion avec le serveur Socket.IO.
   * Doit être appelée après la connexion de l'utilisateur.
   * @param {string} userId - L'ID de l'utilisateur connecté pour rejoindre sa room personnelle.
   */
  connect(userId) {
    // Si une connexion existe déjà, on la déconnecte d'abord pour repartir sur une base saine.
    if (this.socket) {
      this.disconnect();
    }

    console.log("Tentative de connexion au service de notification...");

    // Se connecter au serveur WebSocket, en utilisant l'URL de l'API sans le '/api'
    const socketUrl = config.api.baseURL.replace('/api', '');
    this.socket = io(socketUrl, {
      reconnection: true,           // Tente de se reconnecter automatiquement
      reconnectionDelay: 1000,      // Délai avant la première tentative de reconnexion
      reconnectionAttempts: 5,      // Nombre maximum de tentatives
    });

    // --- Gérer les événements de cycle de vie du socket ---

    this.socket.on('connect', () => {
      console.log(`✅ Connecté au service de notification avec l'ID: ${this.socket.id}`);
      // Une fois connecté, on rejoint la room personnelle de l'utilisateur
      if (userId) {
        this.joinUserRoom(userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`🔌 Déconnecté du service de notification: ${reason}`);
    });
    
    this.socket.on('connect_error', (error) => {
      console.error(`❌ Erreur de connexion au service de notification:`, error.message);
    });
  }

  /**
   * Se déconnecte du serveur Socket.IO.
   * Doit être appelée lors de la déconnexion de l'utilisateur.
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Service de notification déconnecté.');
    }
  }

  /**
   * Émet un événement vers le serveur.
   * @param {string} eventName - Le nom de l'événement.
   * @param {any} data - Les données à envoyer.
   */
  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    } else {
      console.error('Impossible d\'émettre l\'événement: le socket n\'est pas connecté.');
    }
  }

  /**
   * Écoute un événement venant du serveur.
   * @param {string} eventName - Le nom de l'événement à écouter.
   * @param {function} callback - La fonction à exécuter lorsque l'événement est reçu.
   */
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    } else {
      console.error('Impossible d\'écouter l\'événement: le socket n\'est pas connecté.');
    }
  }

  /**
   * Retire un écouteur d'événement.
   * @param {string} eventName - Le nom de l'événement.
   */
  off(eventName) {
    if (this.socket) {
        this.socket.off(eventName);
    }
  }

  /**
   * Demande au serveur de rejoindre la room personnelle de l'utilisateur.
   * @param {string} userId - L'ID de l'utilisateur.
   */
  joinUserRoom(userId) {
    this.emit('join_user_room', userId);
  }
}

// Exporter une instance unique (singleton) du service
const notificationService = new NotificationService();
export default notificationService;