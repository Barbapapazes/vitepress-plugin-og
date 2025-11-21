import type { PageData } from 'vitepress'
import type { ResolvedOptions } from './types.js'
import { createHead } from '@og/core/head.js'
import { joinURL } from 'ufo'

export function addHead(imageName: string, pageData: PageData, options: ResolvedOptions): void {
  pageData.frontmatter.head ||= []
  pageData.frontmatter.head.push(...createHead(joinURL(options.domain, options.outDir, imageName)))
}
