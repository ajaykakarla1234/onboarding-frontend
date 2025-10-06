import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/onboarding-frontend/',  // Base path for GitHub Pages deployment
  
  // Add proxy for local development to avoid CORS issues
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        // Don't rewrite paths since we're adding /api to the target URL
        rewrite: (path) => path
      }
    }
  }
})
