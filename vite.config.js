import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/opay-api': {
        target: 'https://sandboxapi.opaycheckout.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opay-api/, '')
      }
    }
  }
})
