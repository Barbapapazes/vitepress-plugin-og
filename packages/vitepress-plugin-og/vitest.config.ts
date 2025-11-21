import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@og/core/head.js': fileURLToPath(new URL('../core/src/head', import.meta.url)),
    },
  },
})
