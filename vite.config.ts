import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/phrases/')) return 'data-phrases'
          if (id.includes('/src/data/vocabulary/')) return 'data-vocabulary'
          if (id.includes('/src/data/grammar/')) return 'data-grammar'
          if (id.includes('/src/data/idioms/')) return 'data-idioms'
          if (id.includes('/src/data/toeic/')) return 'data-toeic'
        },
      },
    },
  },
})
