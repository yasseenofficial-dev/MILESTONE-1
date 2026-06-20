import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("venueOwnerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getProfile()
      .then(setOwner)
      .catch(() => {
        localStorage.removeItem("venueOwnerToken");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, owner: loggedInOwner } = await api.login({ email, password });
    localStorage.setItem("venueOwnerToken", token);
    setOwner(loggedInOwner);
  }

  async function register(payload) {
    const { token, owner: newOwner } = await api.register(payload);
    localStorage.setItem("venueOwnerToken", token);
    setOwner(newOwner);
  }

  function logout() {
    localStorage.removeItem("venueOwnerToken");
    setOwner(null);
  }

  return (
    <AuthContext.Provider value={{ owner, setOwner, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
