// src/context/AuthContext.js — Global admin auth state
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking stored token

  // On mount: check if a token is stored and validate it
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const stored = localStorage.getItem("adminUser");
    if (token && stored) {
      setUser(JSON.parse(stored));
      // Optionally verify token is still valid with the server
      api.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => logout()) // token expired or invalid
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login: store token and user in localStorage
  const login = (userData) => {
    localStorage.setItem("adminToken", userData.token);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
