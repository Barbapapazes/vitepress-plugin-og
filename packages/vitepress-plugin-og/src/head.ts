import type { PageData } from 'vitepress'
import type { ResolvedOptions } from './types.js'
import { createHead } from '@og/core/head.js'
import { joinURL } from 'ufo'

export function addHead(imageName: string, pageData: PageData, options: ResolvedOptions, base: string): void {
  pageData.frontmatter.head ||= []
  pageData.frontmatter.head.push(...createHead(joinURL(options.domain, base, options.outDir, imageName)))
}
