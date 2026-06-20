import axios from 'axios';

// Youssef Day-of module — uses /api/dayof as base (re-namespaced from /api)
const api = axios.create({ baseURL: '/api/dayof' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('popeyez_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
