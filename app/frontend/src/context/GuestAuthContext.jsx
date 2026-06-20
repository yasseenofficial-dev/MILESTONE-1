import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const GuestAuthContext = createContext(null);

export function GuestAuthProvider({ children }) {
  const [guestUser, setGuestUser] = useState(() => {
    const s = localStorage.getItem('guest_user');
    return s ? JSON.parse(s) : null;
  });

  async function guestLogin(email, password) {
    const res = await axios.post('/api/guest/login', { email, password });
    localStorage.setItem('guest_token', res.data.token);
    localStorage.setItem('guest_user', JSON.stringify(res.data.user));
    setGuestUser(res.data.user);
    return res.data.user;
  }

  function guestLogout() {
    localStorage.removeItem('guest_token');
    localStorage.removeItem('guest_user');
    setGuestUser(null);
  }

  return (
    <GuestAuthContext.Provider value={{ guestUser, guestLogin, guestLogout, isGuestAuthenticated: Boolean(guestUser) }}>
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() { return useContext(GuestAuthContext); }
