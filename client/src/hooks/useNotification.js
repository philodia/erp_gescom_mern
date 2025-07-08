import { useEffect } from 'react';
import toast from 'react-hot-toast';
import notificationService from '../services/notification';
import { useAuth } from '../context/AuthContext'; // Pour connaître l'utilisateur

/**
 * Un hook personnalisé pour gérer les notifications en temps réel reçues via WebSocket.
 * Il s'abonne aux événements du serveur et affiche des toasts à l'utilisateur.
 * Ce hook est conçu pour être appelé UNE SEULE FOIS dans un composant de layout principal.
 */
const useNotification = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Ne rien faire si l'utilisateur n'est pas connecté
    if (!user) {
      return;
    }

    // --- Définir les gestionnaires d'événements ---

    const handleNewOrder = (data) => {
      console.log('Notification de nouvelle commande reçue:', data);
      // Afficher un toast de succès
      toast.success(
        (t) => (
          <span>
            <b>Nouvelle commande !</b><br />
            {data.message}
            <button className="btn btn-sm btn-light ms-2" onClick={() => toast.dismiss(t.id)}>
              OK
            </button>
          </span>
        ),
        {
          icon: '📦', // Emoji personnalisé
        }
      );
      // On pourrait aussi déclencher une mise à jour des données Redux ici
      // dispatch(addOrder(data.order));
    };
    
    const handleStockAlert = (data) => {
        console.log('Alerte de stock faible reçue:', data);
        toast.error(
            `Alerte Stock: ${data.produit.nom} est faible (Stock: ${data.produit.quantiteEnStock})`, 
            {
                duration: 8000,
                icon: '⚠️'
            }
        );
    };

    const handleGenericNotification = (data) => {
        toast.info(data.message, { icon: 'ℹ️' });
    };


    // --- S'abonner aux événements ---

    notificationService.on('nouvelle_commande', handleNewOrder);
    notificationService.on('stock_faible', handleStockAlert);
    notificationService.on('notification_generique', handleGenericNotification);


    // --- Fonction de nettoyage ---
    // Cette fonction est cruciale. Elle est appelée lorsque le composant est démonté
    // (ou lorsque `user` change), et elle retire les écouteurs pour éviter les fuites de mémoire.
    return () => {
      notificationService.off('nouvelle_commande');
      notificationService.off('stock_faible');
      notificationService.off('notification_generique');
    };

  }, [user]); // L'effet se redéclenche si l'utilisateur change (connexion/déconnexion)

  // Ce hook n'a pas besoin de retourner quoi que ce soit, car son seul rôle
  // est de déclencher des effets de bord (afficher des toasts).
};

export default useNotification;