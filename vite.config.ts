import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),

  publicDir: path.resolve(__dirname, 'frontend/public'),

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,

    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },

    watch: {
      usePolling: true,
      interval: 1000,
    },
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});