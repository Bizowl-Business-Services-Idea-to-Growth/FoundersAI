import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  /**
   * Optional auth token (demo only). In a real app this would come from your backend.
   * We add it so components that expect a token (e.g. Profile) can proceed.
   */
  token?: string;
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
    // hydrate from localStorage & inject token if missing
    try {
      const storedUser = localStorage.getItem(LS_USER_KEY);
      const storedAuth = localStorage.getItem(LS_AUTH_KEY);
      if (storedUser && storedAuth === "true") {
        let parsed: User = JSON.parse(storedUser);
        if (!parsed.token) {
          // create a pseudo token for existing sessions (demo purpose only)
            parsed = { ...parsed, token: crypto.randomUUID() };
            localStorage.setItem(LS_USER_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch {
      // ignore hydration errors
    }
  }, []);

  // Simulated async login/signup for demo purposes
  const login = async (email: string, _password: string) => {
    // fake delay
    await new Promise((r) => setTimeout(r, 400));
    const existing = localStorage.getItem(LS_USER_KEY);
    let parsed: User | null = existing ? JSON.parse(existing) : { id: crypto.randomUUID(), name: email.split("@")[0] || "Founder", email };
    if (parsed && !parsed.token) {
      parsed.token = crypto.randomUUID();
    }
    localStorage.setItem(LS_USER_KEY, JSON.stringify(parsed));
    localStorage.setItem(LS_AUTH_KEY, "true");
    setUser(parsed);
    setIsAuthenticated(true);
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = { id: crypto.randomUUID(), name: name || email.split("@")[0] || "Founder", email, token: crypto.randomUUID() };
    localStorage.setItem(LS_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LS_AUTH_KEY, "true");
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.setItem(LS_AUTH_KEY, "false");
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
