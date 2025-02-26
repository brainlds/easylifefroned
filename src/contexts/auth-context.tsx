import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    username: string;
    isGuest?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 检查是否已经登录
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            // 如果没有登录，自动以游客身份登录
            handleGuestLogin();
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleGuestLogin = () => {
        const guestUser = {
            username: '游客',
            isGuest: true
        };
        setUser(guestUser);
        localStorage.setItem('user', JSON.stringify(guestUser));
    };

    const login = async (username: string, password: string) => {
        // 这里可以添加实际的登录逻辑
        if (password === '123') {
            const userData = { username, isGuest: false };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            throw new Error('密码错误');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        handleGuestLogin(); // 登出后自动切换到游客模式
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// 添加一个空导出使文件成为模块
export { }; 