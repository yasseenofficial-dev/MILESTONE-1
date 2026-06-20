import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/venueOwnerApi.js';

const VenueOwnerAuthContext = createContext(null);

export function VenueOwnerAuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('venueOwnerToken');
    if (!token) { setLoading(false); return; }
    api.getProfile().then(setOwner).catch(() => {
      localStorage.removeItem('venueOwnerToken');
    }).finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, owner: loggedIn } = await api.login({ email, password });
    localStorage.setItem('venueOwnerToken', token);
    setOwner(loggedIn);
  }

  async function register(payload) {
    const { token, owner: newOwner } = await api.register(payload);
    localStorage.setItem('venueOwnerToken', token);
    setOwner(newOwner);
  }

  function logout() {
    localStorage.removeItem('venueOwnerToken');
    setOwner(null);
  }

  return (
    <VenueOwnerAuthContext.Provider value={{ owner, setOwner, loading, login, register, logout }}>
      {children}
    </VenueOwnerAuthContext.Provider>
  );
}

export function useVenueOwnerAuth() { return useContext(VenueOwnerAuthContext); }
