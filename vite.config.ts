import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// BASE_PATH: "/" com domínio próprio, "/kitprojetista-site/" no github.io (o workflow decide).
// SITE_URL: endereço completo do site, usado nos links de compartilhamento (og:image etc.).
const base = process.env.BASE_PATH || '/';
const siteUrl = (process.env.SITE_URL || 'https://kitprojetista.com.br').replace(/\/$/, '');

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: { order: 'pre', handler: (html) => html.replace(/%SITE_URL%/g, siteUrl) },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
