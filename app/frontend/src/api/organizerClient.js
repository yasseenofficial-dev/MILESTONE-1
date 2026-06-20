import axios from 'axios';

const organizerClient = axios.create({ baseURL: '/api' });

organizerClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize backend responses: { events: [...] } → { data: [...] }
// so every page can consistently read res.data.data.
// Only skip keys that the auth context reads directly as res.data.[key].
const SKIP_WRAP = new Set(['user', 'token', 'message', 'data']);

organizerClient.interceptors.response.use((response) => {
  const d = response.data;
  if (d && typeof d === 'object' && !Array.isArray(d)) {
    const keys = Object.keys(d);
    if (keys.length === 1 && !SKIP_WRAP.has(keys[0])) {
      response.data = { data: d[keys[0]] };
    }
  }
  return response;
});

export default organizerClient;
