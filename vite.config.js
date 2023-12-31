import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
  // build: {
  //   chunkSizeWarningLimit: 3500, // Set a higher value of chunk
  // },
  build: {
    outDir:"dist",
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
        output:{
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return id.toString().split('node_modules/')[1].split('/')[0].toString();
                }
            }
        }
    }
}
})
