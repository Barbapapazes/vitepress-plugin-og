import { defineConfig } from 'vitepress'
import { addOgImage } from 'vitepress-plugin-og'

export default defineConfig({
  srcDir: 'src',

  async transformPageData(pageData, ctx) {
    await addOgImage(pageData, ctx, {
      domain: 'https://soubiran.dev',
    })
  },
})
