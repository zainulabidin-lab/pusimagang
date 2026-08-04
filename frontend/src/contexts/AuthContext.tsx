import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: any;
    login: (token: string, userData: any) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data.data);
                } catch (error) {
                    sessionStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: any) => {
        sessionStorage.setItem('token', token);
        setUser(userData);
        navigate('/');
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            sessionStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        let timeoutId: number;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            // 15 minutes = 15 * 60 * 1000 = 900000 ms
            timeoutId = window.setTimeout(() => {
                if (user) {
                    logout();
                    alert("Sesi Anda telah berakhir secara otomatis karena tidak ada aktivitas selama 15 menit.");
                }
            }, 900000);
        };

        const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
        
        const handleActivity = () => resetTimer();

        if (user) {
            events.forEach(e => window.addEventListener(e, handleActivity));
            resetTimer();
        }

        return () => {
            events.forEach(e => window.removeEventListener(e, handleActivity));
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [user, logout]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
