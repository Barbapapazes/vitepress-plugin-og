import type { PageIndexInfo, RspressPlugin } from '@rspress/shared'
import type { Options } from './types.js'
import { join } from 'node:path'
import { createOgImageHead, createOgImageHeightHead, createOgImageTypeHead, createOgImageWidthHead, createTwitterCardHead, createTwitterImageHead } from '@og/core/head.js'
import { generateOgImage } from '@og/core/og.js'
import { slugifyPath } from '@og/core/utils.js'
import { joinURL } from 'ufo'
import { resolveOptions } from './options.js'

export default function (userOptions: Options): RspressPlugin {
  const options = resolveOptions(userOptions)

  const images = new Map<string, { title: string, imageName: string, imageUrl: string }>()

  const headCreators = [
    (url: string) => createTwitterImageHead(url),
    () => createTwitterCardHead(),
    (url: string) => createOgImageHead(url),
    () => createOgImageWidthHead(),
    () => createOgImageHeightHead(),
    () => createOgImageTypeHead(),
  ]

  return {
    name: 'rspress-plugin-og',
    config(config) {
      const originalHead = config.head || []
      config.head = [
        ...originalHead,
        ...headCreators.map(creator => (route: any) => {
          const imageInfo = images.get(route.routePath)
          if (!imageInfo) {
            return
          }
          return creator(imageInfo.imageUrl)
        }),
      ]

      return config
    },
    extendPageData: (pageData: PageIndexInfo) => {
      const title = pageData.frontmatter.title || pageData.title
      if (!title) {
        console.warn(`[rspress-plugin-og] Cannot generate OG image for page without title: ${pageData._relativePath}`)
        return
      }

      const imageName = slugifyPath(pageData._relativePath)

      images.set(pageData.routePath, {
        title: pageData.frontmatter.title || pageData.title,
        imageName,
        imageUrl: joinURL(options.domain, options.outDir, imageName),
      })
    },
    async beforeBuild(config) {
      await Promise.all(
        Array.from(images.entries()).map(([_, { title, imageName }]) =>
          generateOgImage({ title }, join(config.root ?? '', options.outDir, imageName), options)),
      )
    },
  }
}
