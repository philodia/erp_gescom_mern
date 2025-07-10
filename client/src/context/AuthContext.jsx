import React, { createContext, useState, useEffect, useCallback } from 'react';

// Importer les services qui contiennent la logique
import authService from '../services/auth';
import storageService from '../services/storage';
import notificationService from '../services/notification';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// 1. Création du Contexte
// On l'exporte pour que le hook useAuth puisse le consommer.
const AuthContext = createContext(null);

// 2. Création du Fournisseur (Provider) de Contexte
export const AuthProvider = ({ children }) => {
    // --- Définition des états ---
    const [token, setToken] = useState(() => storageService.getItem(LOCAL_STORAGE_KEYS.TOKEN));
    const [user, setUser] = useState(() => storageService.getItem(LOCAL_STORAGE_KEYS.USER));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isLoading, setIsLoading] = useState(true);

    // --- Fonctions d'aide internes ---
    const handleLogout = useCallback(() => {
        storageService.clear();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        notificationService.disconnect();
    }, []);

    // --- Effet de bord pour charger l'utilisateur au démarrage ---
    useEffect(() => {
        const verifyTokenAndConnectServices = async () => {
            // On ne vérifie que si un token existe et qu'on n'est pas déjà authentifié (pour éviter des appels inutiles)
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                    storageService.setItem(LOCAL_STORAGE_KEYS.USER, userData);
                    notificationService.connect(userData._id);
                } catch (error) {
                    console.warn("Session invalide ou expirée. Nettoyage...");
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        verifyTokenAndConnectServices();
    }, [token, handleLogout]);

    // --- Fonctions d'Action exposées par le contexte ---
    const handleSetSession = (apiResponse) => {
        storageService.setItem(LOCAL_STORAGE_KEYS.TOKEN, apiResponse.token);
        storageService.setItem(LOCAL_STORAGE_KEYS.USER, apiResponse.user);
        
        setToken(apiResponse.token);
        setUser(apiResponse.user);
        setIsAuthenticated(true);
        
        notificationService.connect(apiResponse.user._id);
    };

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        handleSetSession(data);
        return data;
    };

    const register = async (nom, email, password, role) => {
        const data = await authService.register({ nom, email, password, role });
        handleSetSession(data);
        return data;
    };

    const logout = () => {
        handleLogout();
    };
    
    const updateUserContext = (updatedUserData) => {
        // Mettre à jour l'état local ET le stockage persistant
        const newUser = { ...user, ...updatedUserData };
        setUser(newUser);
        storageService.setItem(LOCAL_STORAGE_KEYS.USER, newUser);
    };

    const value = { user, token, isAuthenticated, isLoading, login, register, logout, updateUserContext };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// On exporte le Contexte par défaut pour qu'il soit utilisé par le hook useAuth
export default AuthContext;