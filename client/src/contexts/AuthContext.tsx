import { createContext, useContext, useState, ReactNode } from 'react';
import type { AuthUser } from '../api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromStorage(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [token, setToken] = useState<string | null>(stored.token);
  const [user, setUser] = useState<AuthUser | null>(stored.user);

  function signIn(newToken: string, newUser: AuthUser) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userId', String(newUser.id));
    setToken(newToken);
    setUser(newUser);
  }

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
