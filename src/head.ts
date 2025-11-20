import type { PageData } from 'vitepress'
import type { ResolvedOptions } from './types.js'
import { joinURL } from 'ufo'

export function addHead(imageName: string, pageData: PageData, options: ResolvedOptions): void {
  const imageUrl = joinURL(options.domain, options.outDir, imageName)

  pageData.frontmatter.head ||= []

  pageData.frontmatter.head.push(['meta', { name: 'twitter:image', content: imageUrl }])
  pageData.frontmatter.head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])

  pageData.frontmatter.head.push(['meta', { property: 'og:image', content: imageUrl }])
  pageData.frontmatter.head.push(['meta', { property: 'og:image:width', content: '1200' }])
  pageData.frontmatter.head.push(['meta', { property: 'og:image:height', content: '630' }])
  pageData.frontmatter.head.push(['meta', { property: 'og:image:type', content: 'image/png' }])
}
