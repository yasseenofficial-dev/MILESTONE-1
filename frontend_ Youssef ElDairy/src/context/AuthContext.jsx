import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('popeyez_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('popeyez_token');
    if (!token) return;
    api.get('/auth/me').then((res) => {
      setUser(res.data.user);
      localStorage.setItem('popeyez_user', JSON.stringify(res.data.user));
    }).catch(() => logout());
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('popeyez_token', res.data.token);
      localStorage.setItem('popeyez_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('popeyez_token');
    localStorage.removeItem('popeyez_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
