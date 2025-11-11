import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Auth provider that supports receiving profile data via postMessage from a parent
// host (for example a client-panel that embeds this app in an iframe). If no
// profile is provided, falls back to an anonymous demo user to keep the UI working.

type User = {
  id: string;
  name?: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  [k: string]: any;
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
  const [user, setUser] = useState<User | null>(ANON_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Parse allowed parent origins from env var (comma-separated). If not set,
  // we allow any origin but log a warning — in production you should set this.
  const raw = (import.meta as any).env?.VITE_ALLOWED_PARENT_ORIGINS || '';
  const allowedOrigins = raw.split(',').map((s: string) => s.trim()).filter(Boolean);

  useEffect(() => {
    function isAllowedOrigin(origin: string) {
      if (allowedOrigins.length === 0) return true; // permissive fallback
      return allowedOrigins.includes(origin);
    }

    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const { type, payload } = e.data as { type?: string; payload?: any };
      // Only accept messages from allowed origins (if configured)
      if (!isAllowedOrigin(e.origin)) return;

      if (type === 'PROFILE_SYNC' && payload) {
        // payload expected to contain uid/id, displayName/name, email, etc
        const p: any = payload;
        const newUser: User = {
          id: p.uid || p.id || 'remote-user',
          name: p.displayName || p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          email: p.email,
          token: p.token,
          firstName: p.firstName,
          lastName: p.lastName,
          photoURL: p.photoURL,
          ...p,
        };
        setUser(newUser);
        setIsAuthenticated(true);
      }

      if (type === 'REQUEST_PROFILE') {
        // Parent is asking for our current profile — reply with PROFILE_SYNC
        const reply = {
          type: 'PROFILE_SYNC',
          payload: user || ANON_USER,
        };
        try {
          window.parent.postMessage(reply, e.origin);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('message', handler);

    // On mount, proactively ask parent for profile (useful when embedded)
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'REQUEST_PROFILE' }, allowedOrigins.length ? allowedOrigins[0] : '*');
      }
    } catch {
      // ignore
    }

    return () => window.removeEventListener('message', handler);
  }, [allowedOrigins, user]);

  // No-op auth methods kept for compatibility
  const login = async (_email: string, _password: string) => Promise.resolve();
  const signup = async (_name: string, _email: string, _password: string) => Promise.resolve();
  const logout = () => {
    // clear to anonymous
    setUser(ANON_USER);
    setIsAuthenticated(false);
  };

  const value = useMemo<AuthContextType>(() => ({ user, isAuthenticated, login, signup, logout }), [user, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};




// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// // Auth provider that supports receiving profile data via postMessage from a parent
// // host (for example a client-panel that embeds this app in an iframe). If no
// // profile is provided, falls back to an anonymous demo user to keep the UI working.

// type User = {
//   id: string;
//   name?: string;
//   email?: string;
//   token?: string;
//   firstName?: string;
//   lastName?: string;
//   photoURL?: string;
//   [k: string]: any;
// };

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const ANON_USER: User = { id: 'anon', name: 'Founder', email: '' };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(ANON_USER);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   // Parse allowed parent origins from env var (comma-separated). If not set,
//   // we allow any origin but log a warning — in production you should set this.
//   const raw = (import.meta as any).env?.VITE_ALLOWED_PARENT_ORIGINS || '';
//   const allowedOrigins = raw.split(',').map((s: string) => s.trim()).filter(Boolean);

//   useEffect(() => {
//     function isAllowedOrigin(origin: string) {
//       if (allowedOrigins.length === 0) return true; // permissive fallback
//       return allowedOrigins.includes(origin);
//     }

//     const handler = (e: MessageEvent) => {
//       if (!e.data || typeof e.data !== 'object') return;
//       const { type, payload } = e.data as { type?: string; payload?: any };
//       // Only accept messages from allowed origins (if configured)
//       if (!isAllowedOrigin(e.origin)) return;

//       if (type === 'PROFILE_SYNC' && payload) {
//         // payload expected to contain uid/id, displayName/name, email, etc
//         const p: any = payload;
//         const newUser: User = {
//           id: p.uid || p.id || 'remote-user',
//           name: p.displayName || p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
//           email: p.email,
//           token: p.token,
//           firstName: p.firstName,
//           lastName: p.lastName,
//           photoURL: p.photoURL,
//           ...p,
//         };
//         setUser(newUser);
//         setIsAuthenticated(true);
//       }

//       if (type === 'REQUEST_PROFILE') {
//         // Parent is asking for our current profile — reply with PROFILE_SYNC
//         const reply = {
//           type: 'PROFILE_SYNC',
//           payload: user || ANON_USER,
//         };
//         try {
//           window.parent.postMessage(reply, e.origin);
//         } catch {
//           // ignore
//         }
//       }
//     };

//     window.addEventListener('message', handler);

//     // On mount, proactively ask parent for profile (useful when embedded)
//     try {
//       if (window.parent && window.parent !== window) {
//         window.parent.postMessage({ type: 'REQUEST_PROFILE' }, allowedOrigins.length ? allowedOrigins[0] : '*');
//       }
//     } catch {
//       // ignore
//     }

//     return () => window.removeEventListener('message', handler);
//   }, [allowedOrigins, user]);

//   // No-op auth methods kept for compatibility
//   const login = async (_email: string, _password: string) => Promise.resolve();
//   const signup = async (_name: string, _email: string, _password: string) => Promise.resolve();
//   const logout = () => {
//     // clear to anonymous
//     setUser(ANON_USER);
//     setIsAuthenticated(false);
//   };

//   const value = useMemo<AuthContextType>(() => ({ user, isAuthenticated, login, signup, logout }), [user, isAuthenticated]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
//   return ctx;
// };
