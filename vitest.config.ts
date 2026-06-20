import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Separate from vite.config.ts: vitest bundles its own vite types which conflict
// with rolldown-vite (vite 8) plugin types under `tsc -b`. Keeping the test config
// here (excluded from tsconfig typechecking) avoids that build-time type clash.
export default defineConfig({
  plugins: [react()],
  // Ensure JSX in test files uses the automatic runtime (no `import React`).
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // The suite has grown large; a few tests dynamically import the full content
    // data set or run axe over big DOMs, which can exceed the 5s default under
    // parallel load. Give them headroom so they don't flake on slow/busy machines.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
