import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['uay-react-tailwind-gantt'], // Force Vite to treat as external
  },
  build: {
    sourcemap: true,
  },
  server: {
    sourcemapIgnoreList: false,
  },
});
