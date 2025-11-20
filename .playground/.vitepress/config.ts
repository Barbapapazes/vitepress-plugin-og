import { defineConfig } from 'vitepress'
import { addOgImage } from 'vitepress-plugin-og'

export default defineConfig({
  async transformPageData(pageData) {
    await addOgImage(pageData, {
      domain: 'https://soubiran.dev',
    })
  },
})
