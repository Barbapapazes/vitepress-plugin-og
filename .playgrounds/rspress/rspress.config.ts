import * as path from 'node:path'
import og from 'rspress-plugin-og'
import { defineConfig } from 'rspress/config'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  plugins: [og({
    domain: 'https://example.com',
  })],
})
