import React, { createContext, useContext, useState, useEffect } from 'react';
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
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data.data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        setUser(userData);
        navigate('/');
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
