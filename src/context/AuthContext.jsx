import React, { createContext, useContext, useState } from 'react';
import {getUserRole, getUserName} from '../utils/auth';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return { username: getUserName(), role: getUserRole() };
    });

    const login = async (username, password) => {
        await authService.login(username, password);
        setUser({ username: getUserName(), role: getUserRole() });
    };

    const register = async (username, email, password) => {
        await authService.register(username, email, password);
        setUser({ username: getUserName(), role: getUserRole() });
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdminOrMod }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);