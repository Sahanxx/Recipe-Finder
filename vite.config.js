import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Must match your repo name exactly (case-sensitive)
  base: '/Recipe-Finder/',
});
