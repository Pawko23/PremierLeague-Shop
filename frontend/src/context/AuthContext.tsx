// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { type User, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';

// Typy
interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    isLoading: boolean;
    idToken: string | null;
    // Tylko logowanie e-mail/hasło
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Funkcja logowania E-mail/Hasło
    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Funkcja wylogowania
    const logout = async () => {
        await auth.signOut();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken(true);
                setIdToken(token);
                setUser(currentUser);

                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsAdmin(response.data.role === 'admin');
                } catch {
                    setIsAdmin(false);
                }

            } else {
                setUser(null);
                setIdToken(null);
                setIsAdmin(false);
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);


    return (
        <AuthContext.Provider value={{ user, isAdmin, isLoading, idToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};