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
          // TOEIC データはページごとに個別ファイル(part1-listening 等)を import している。
          // 以前は全 TOEIC を 1 チャンク(data-toeic, ~130kB gz)に集約していたため、
          // Part を 1 つ開くだけで全 Part 分のデータを過剰 DL していた。
          // per-file 分割にして、各ページが実際に使うデータだけを読み込むようにする。
          const toeic = id.match(/\/src\/data\/toeic\/([^/.]+)/)
          if (toeic) return `data-toeic-${toeic[1]}`
        },
      },
    },
  },
})
