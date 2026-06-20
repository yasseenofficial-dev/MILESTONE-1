import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api':    { target: 'http://localhost:5000', changeOrigin: true },
      '/client': { target: 'http://localhost:5000', changeOrigin: true },
      '/vendor': { target: 'http://localhost:5000', changeOrigin: true }
    }
  }
});
