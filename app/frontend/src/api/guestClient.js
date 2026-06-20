import axios from 'axios';

const guestClient = axios.create({ baseURL: '/api' });

guestClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('guest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default guestClient;
