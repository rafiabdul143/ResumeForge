import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
   outDir: 'dist',
    emptyOutDir: true, // cleans the wwwroot folder before building
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5258',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
