import React, { createContext, useEffect, useReducer, useMemo, useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';
import notificationService from '../services/notification';
import { useAuth } from '../hooks/useAuth';
import { notificationReducer, NOTIFICATION_ACTIONS } from '../reducers/notificationReducer';

// 1. Création du Contexte
const NotificationContext = createContext(null);

// 2. Définition et Export du Hook de Consommation
/**
 * Hook pour accéder à l'état et aux actions du centre de notifications.
 */
export const useNotificationCenter = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotificationCenter doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

// 3. Création du Fournisseur (Provider) de Contexte
export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, dispatch] = useReducer(notificationReducer, []);
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch({ type: NOTIFICATION_ACTIONS.RESET });
            return;
        }
        
        const handleNewNotification = (data) => {
            const newNotification = {
                id: `notif-${Date.now()}-${Math.random()}`,
                ...data,
                read: false,
                timestamp: new Date(),
            };
            toast[newNotification.type || 'info'](newNotification.message, { id: newNotification.id });
            dispatch({ type: NOTIFICATION_ACTIONS.ADD, payload: newNotification });
        };
        
        notificationService.on('notification', handleNewNotification);
        
        return () => {
            notificationService.off('notification', handleNewNotification);
        };
    }, [isAuthenticated]);

    const markAsRead = useCallback((notificationId) => {
        dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: { id: notificationId } });
    }, []);

    const markAllAsRead = useCallback(() => {
        dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    }, []);

    const clearNotifications = useCallback(() => {
        dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
    }, []);

    const value = useMemo(() => ({
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
    }), [notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};