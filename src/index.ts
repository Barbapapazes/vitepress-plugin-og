import type { PageData } from 'vitepress'
import type { Options } from './types.js'
import { join } from 'node:path'
import { addHead } from './head.js'
import { generateOgImage } from './og.js'
import { resolveOptions } from './options.js'

export async function addOgImage(pageData: PageData, userOptions: Options): Promise<void> {
  const options = resolveOptions(userOptions)

  const imageName = `${pageData.filePath.replace(/\//g, '-').replace(/\.md$/, '')}.png`
  const imagePath = join('public', options.outDir, imageName)

  const title = pageData.frontmatter.title || pageData.title
  if (!title) {
    console.warn(`[vitepress-plugin-og] Cannot generate OG image for page without title: ${pageData.filePath}`)
    return
  }

  await generateOgImage({ title }, imagePath, options)

  addHead(imageName, pageData, options)
}
