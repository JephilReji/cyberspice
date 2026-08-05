import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../api/auth";

type User = AuthResponse["user"];

interface AuthContextValue {
  user: User | null;
  token: string | null;
  setAuth: (data: AuthResponse) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "cyberspice_token";
const USER_KEY = "cyberspice_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  function setAuth(data: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
