import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3500, // Set a higher value of chunk
  },
})
