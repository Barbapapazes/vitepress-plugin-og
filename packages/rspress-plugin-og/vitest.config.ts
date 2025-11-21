import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: [
      {
        find: /^@og\/core\/(.*)\.js$/,
        replacement: fileURLToPath(new URL('../core/src/$1.ts', import.meta.url)),
      },
    ],
  },
})
