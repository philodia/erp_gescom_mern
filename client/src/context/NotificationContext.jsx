// --- On importe useCallback ---
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Excellent choix pour les toasts !
import notificationService from '../services/notification'; // Service d'écoute (ex: Socket.IO)
import { useAuth } from './AuthContext';

// 1. Création du Contexte
const NotificationContext = createContext(null);

// 2. Hook personnalisé pour consommer le contexte (le nom est standardisé)
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification doit être utilisé à l\'intérieur d\'un NotificationProvider');
    }
    return context;
};

// 3. Création du Fournisseur (Provider) de Contexte
export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    
    // Le calcul de unreadCount est simple, pas besoin de useMemo pour l'instant.
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        // On définit la fonction de callback à l'intérieur de l'effet
        // pour qu'elle ait accès à la version la plus fraîche de `toast`.
        const handleNewNotification = (data) => {
            const newNotification = {
                id: `notif-${Date.now()}-${Math.random()}`,
                ...data,
                read: false,
                timestamp: new Date(),
            };
            
            // Utiliser une fonction de mise à jour pour garantir l'accès à l'état précédent
            setNotifications(prev => [newNotification, ...prev]);
            
            if (data.type === 'error') toast.error(data.message);
            else if (data.type === 'success') toast.success(data.message);
            else toast.info(data.message);
        };

        notificationService.on('notification', handleNewNotification);

        return () => {
            notificationService.off('notification', handleNewNotification);
        };

    }, [isAuthenticated]); // Dépendance correcte

    // --- CORRECTION: Stabiliser les fonctions avec useCallback ---

    /**
     * Marque une notification spécifique comme lue.
     */
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    }, []); // Aucune dépendance externe, donc tableau vide.

    /**
     * Marque toutes les notifications comme lues.
     */
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []); // Aucune dépendance externe.

    /**
     * Supprime toutes les notifications.
     */
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []); // Aucune dépendance externe.

    // La valeur du contexte est maintenant composée de données et de fonctions stables.
    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};