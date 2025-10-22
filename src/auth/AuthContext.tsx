import React, { createContext, useContext, useMemo } from "react";

// Simplified no-auth provider for public/demo mode.
// Provides a default anonymous user and no-op auth methods so the app
// can be embedded/used without requiring login. This keeps profileStorage
// and other database code untouched while removing auth gating.

type User = {
  id: string;
  name: string;
  email: string;
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

const ANON_USER: User = { id: 'anon', name: 'Founder', email: '' };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always treat user as authenticated in the public/demo mode so pages
  // that expect a user can still function. Methods are intentionally
  // no-ops to make future SSO integration straightforward.

  const login = async (_email: string, _password: string) => {
    // no-op: resolve immediately
    return Promise.resolve();
  };

  const signup = async (_name: string, _email: string, _password: string) => {
    // no-op
    return Promise.resolve();
  };

  const logout = () => {
    // no-op
  };

  const value = useMemo<AuthContextType>(() => ({
    user: ANON_USER,
    isAuthenticated: true,
    login,
    signup,
    logout,
  }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
