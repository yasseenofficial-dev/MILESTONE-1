import { createContext, useContext, useEffect, useState } from 'react';
import organizerClient from '../api/organizerClient';

const OrganizerAuthContext = createContext(null);

export function OrganizerAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ys_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    organizerClient.get('/auth/profile').then((res) => {
      setUser(res.data.user);
      localStorage.setItem('ys_user', JSON.stringify(res.data.user));
    }).catch(() => logout());
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await organizerClient.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('ys_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally { setLoading(false); }
  }

  async function register(data) {
    setLoading(true);
    try {
      const res = await organizerClient.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('ys_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally { setLoading(false); }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('ys_user');
    setUser(null);
  }

  const isAuthenticated = Boolean(user);

  return (
    <OrganizerAuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </OrganizerAuthContext.Provider>
  );
}

export function useOrganizerAuth() { return useContext(OrganizerAuthContext); }
