import type { PageIndexInfo, RspressPlugin } from '@rspress/shared'
import type { Options } from './types.js'
import { join } from 'node:path'
import { createOgImageHead, createOgImageHeightHead, createOgImageTypeHead, createOgImageWidthHead, createTwitterCardHead, createTwitterImageHead } from '@og/core/head.js'
import { generateOgImage } from '@og/core/og.js'
import { joinURL } from 'ufo'
import { resolveOptions } from './options.js'

export default function (userOptions: Options): RspressPlugin {
  const options = resolveOptions(userOptions)

  const images = new Map<string, { title: string, imageName: string, imageUrl: string }>()

  return {
    name: 'rspress-plugin-og',
    config(config) {
      const originalHead = config.head || []
      config.head = [
        ...originalHead,
        (route) => {
          const imageInfo = images.get(route.routePath)
          if (!imageInfo) {
            return
          }
          return createTwitterImageHead(imageInfo.imageUrl)
        },
        (route) => {
          if (!images.get(route.routePath)) {
            return
          }
          return createTwitterCardHead()
        },
        (route) => {
          const imageInfo = images.get(route.routePath)
          if (!imageInfo) {
            return
          }
          return createOgImageHead(imageInfo.imageUrl)
        },
        (route) => {
          if (!images.get(route.routePath)) {
            return
          }
          return createOgImageWidthHead()
        },
        (route) => {
          if (!images.get(route.routePath)) {
            return
          }
          return createOgImageHeightHead()
        },
        (route) => {
          if (!images.get(route.routePath)) {
            return
          }
          return createOgImageTypeHead()
        },
      ]

      return config
    },
    extendPageData: (pageData: PageIndexInfo) => {
      const title = pageData.frontmatter.title || pageData.title
      if (!title) {
        console.warn(`[rspress-plugin-og] Cannot generate OG image for page without title: ${pageData._relativePath}`)
        return
      }

      const imageName = `${pageData._relativePath.replace(/\//g, '-').replace(/\.md$/, '')}.png`

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
