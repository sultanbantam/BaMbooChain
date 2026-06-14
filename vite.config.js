import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/agri': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/market': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('framer-motion') || id.includes('zustand')) return 'vendor-core';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('leaflet')) return 'vendor-map';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            return 'vendor-others';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
