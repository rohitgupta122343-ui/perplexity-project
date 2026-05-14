import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://perplexity-project-vay7.onrender.com/', // apna backend port
        changeOrigin: true,
        secure: false
      }
    }
  }
})