
import React, { createContext, useState, useEffect,  } from "react";

import api from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };
  const signup = (userData) => setUser(userData);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
