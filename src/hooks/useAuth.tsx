import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser as saveCurrentUser, getUsers } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const login = (email: string, _password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email);
    if (!found) return { success: false, error: 'Invalid email or password' };
    setUser(found);
    saveCurrentUser(found);
    return { success: true };
  };

  const logout = () => { setUser(null); saveCurrentUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
