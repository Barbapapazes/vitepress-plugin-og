import type { PageData, TransformPageContext } from 'vitepress'
import type { Options } from './types.js'
import { join } from 'node:path'
import { generateOgImage } from '@og/core/og.js'
import { slugifyPath } from '@og/core/utils.js'
import { addHead } from './head.js'
import { resolveOptions } from './options.js'

export async function addOgImage(pageData: PageData, context: TransformPageContext, userOptions: Options): Promise<void> {
  const options = resolveOptions(userOptions)

  const imageName = slugifyPath(pageData.filePath)
  const imagePath = join(context.siteConfig.srcDir, 'public', options.outDir, imageName)

  const title = pageData.frontmatter.title || pageData.title
  if (!title) {
    console.warn(`[vitepress-plugin-og] Cannot generate OG image for page without title: ${pageData.filePath}`)
    return
  }

  await generateOgImage({ title }, imagePath, options)

  addHead(imageName, pageData, options)
}
