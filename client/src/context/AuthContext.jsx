import React, { createContext, useState, useEffect, useContext } from 'react';

// Importer les services qui contiennent la logique
import authService from '../services/auth';
import storageService from '../services/storage'; // <-- Importer le service de stockage
import notificationService from '../services/notification'; // <-- Importer le service de notification
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// 1. Création du Contexte
const AuthContext = createContext(null);

// 2. Hook personnalisé pour consommer le contexte (reste inchangé)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

// 3. Création du Fournisseur (Provider) de Contexte
export const AuthProvider = ({ children }) => {
    // --- Définition des états ---
    // Utilise storageService pour initialiser l'état
    const [token, setToken] = useState(storageService.getItem(LOCAL_STORAGE_KEYS.TOKEN));
    const [user, setUser] = useState(storageService.getItem(LOCAL_STORAGE_KEYS.USER));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isLoading, setIsLoading] = useState(true);

    // --- Effet de bord pour charger l'utilisateur au démarrage ---
    useEffect(() => {
        const verifyTokenAndConnectServices = async () => {
            if (token) {
                try {
                    const userData = await authService.getMe();
                    // On ne met à jour l'état que si les données sont valides
                    setUser(userData);
                    setIsAuthenticated(true);
                    // Une fois l'utilisateur vérifié, on connecte les services temps réel
                    notificationService.connect(userData._id);
                } catch (error) {
                    console.warn("Session invalide ou expirée, nettoyage local.");
                    handleLogout(); // Nettoie l'état et le stockage
                }
            }
            setIsLoading(false);
        };

        verifyTokenAndConnectServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Fonctions d'aide internes ---
    const handleSetSession = (apiResponse) => {
        storageService.setItem(LOCAL_STORAGE_KEYS.TOKEN, apiResponse.token);
        storageService.setItem(LOCAL_STORAGE_KEYS.USER, apiResponse.user);
        
        setToken(apiResponse.token);
        setUser(apiResponse.user);
        setIsAuthenticated(true);
        
        // Connecter les services temps réel après une nouvelle connexion
        notificationService.connect(apiResponse.user._id);
    };
    
    const handleLogout = () => {
        storageService.clear(); // Vide tout le stockage de l'app
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        
        // Déconnecter les services temps réel
        notificationService.disconnect();
    };
    
    // --- Fonctions d'Action exposées par le contexte ---
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
    
    // --- Rassembler les valeurs à fournir ---
    const value = { user, token, isAuthenticated, isLoading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;