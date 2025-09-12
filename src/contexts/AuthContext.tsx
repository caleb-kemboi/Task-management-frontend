import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { type User } from "../types";
import { parseJwt } from "../utils/jwt";
import { useNavigate } from "react-router-dom";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: { username: string; email: string; password: string; role: string }) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {

        const token = localStorage.getItem("token");
        if (token) {
          const p = parseJwt(token);
          if (p?.exp && p.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
            return;
          }
        }

        const res = await api.get("/auth/me"); 
        setUser(res.data as User);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload?.exp) return;
    const expiresAt = payload.exp * 1000;
    const ms = expiresAt - Date.now();
    if (ms <= 0) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }
    const t = setTimeout(() => {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }, ms);
    return () => clearTimeout(t);
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
      setUser({ id: "", username: res.data.username, email, role: res.data.role } as User);
    } else {
      const me = await api.get("/auth/me");
      setUser(me.data as User);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const register = async (payload: { username: string; email: string; password: string; role: string }) => {
    await api.post("/auth/register", payload);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
};
