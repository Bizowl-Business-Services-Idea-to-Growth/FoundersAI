import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from './apiClient';

type User = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_USER_KEY = "fa_user";
const LS_AUTH_KEY = "fa_isAuthenticated";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = localStorage.getItem(LS_USER_KEY);
        const storedAuth = localStorage.getItem(LS_AUTH_KEY);
        if (!storedUser || storedAuth !== 'true') return;
        const parsed: User = JSON.parse(storedUser);
        // Validate token with backend
        try {
          await api.me(parsed.token);
          setUser(parsed);
          setIsAuthenticated(true);
        } catch {
          // invalid/expired token -> clear
          localStorage.removeItem(LS_USER_KEY);
          localStorage.removeItem(LS_AUTH_KEY);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Simulated async login/signup for demo purposes
  const login = async (email: string, password: string) => {
    const { access_token } = await api.login(email, password);
    // fetch profile via /auth/me
    const me: any = await api.me(access_token);
    const userData: User = {
      id: me.id,
      name: me.name,
      email: me.email,
      token: access_token,
    };
    localStorage.setItem(LS_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(LS_AUTH_KEY, 'true');
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (name: string, email: string, password: string) => {
    const created: any = await api.signup(name, email, password);
    // After signup, automatically login using same credentials
    await login(email, password);
    return created;
  };

  const logout = () => {
    localStorage.removeItem(LS_USER_KEY);
    localStorage.removeItem(LS_AUTH_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated, login, signup, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
