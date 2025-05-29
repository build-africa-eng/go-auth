import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        '@tailwindcss/oxide-linux-x64-musl', // Externalize problematic native module
        'node:fs',
        'node:path',
        'node:module',
        'node:fs/promises',
        'node:url',
        'child_process',
      ],
    },
  },
});
