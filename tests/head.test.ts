import type { PageData } from 'vitepress'
import type { ResolvedOptions } from '../src/types.js'
import { describe, expect, it } from 'vitest'
import { addHead } from '../src/head.js'

describe('addHead', () => {
  it('should add OG image meta tags to page head', () => {
    const pageData: PageData = {
      frontmatter: {},
    } as PageData

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData, options)

    expect(pageData.frontmatter.head).toBeDefined()
    expect(pageData.frontmatter.head).toHaveLength(6)
  })

  it('should construct correct image URL with domain and outDir', () => {
    const pageData: PageData = {
      frontmatter: {},
    } as PageData

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData, options)

    const ogImageMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.property === 'og:image',
    )

    expect(ogImageMeta).toBeDefined()
    expect(ogImageMeta?.[1].content).toBe('https://example.com/og/test-page.png')
  })

  it('should add twitter:card and twitter:image meta tags', () => {
    const pageData: PageData = {
      frontmatter: {},
    } as PageData

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData, options)

    const twitterImageMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.name === 'twitter:image',
    )
    const twitterCardMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.name === 'twitter:card',
    )

    expect(twitterImageMeta).toBeDefined()
    expect(twitterImageMeta?.[1].content).toBe('https://example.com/og/test-page.png')
    expect(twitterCardMeta).toBeDefined()
    expect(twitterCardMeta?.[1].content).toBe('summary_large_image')
  })

  it('should add og:image dimensions and type', () => {
    const pageData: PageData = {
      frontmatter: {},
    } as PageData

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData, options)

    const widthMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.property === 'og:image:width',
    )
    const heightMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.property === 'og:image:height',
    )
    const typeMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.property === 'og:image:type',
    )

    expect(widthMeta?.[1].content).toBe('1200')
    expect(heightMeta?.[1].content).toBe('630')
    expect(typeMeta?.[1].content).toBe('image/png')
  })

  it('should preserve existing head entries', () => {
    const pageData = {
      frontmatter: {
        head: [
          ['meta', { name: 'description', content: 'Test description' }],
        ],
      },
    }

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData as any, options)

    expect(pageData.frontmatter.head).toHaveLength(7) // 1 existing + 6 new
    expect(pageData.frontmatter.head?.[0]).toEqual(['meta', { name: 'description', content: 'Test description' }])
  })

  it('should handle custom outDir in URL construction', () => {
    const pageData: PageData = {
      frontmatter: {},
    } as PageData

    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'custom-images',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    }

    addHead('test-page.png', pageData, options)

    const ogImageMeta = pageData.frontmatter.head?.find(
      ([tag, attrs]: [string, Record<string, string>]) => tag === 'meta' && attrs.property === 'og:image',
    )

    expect(ogImageMeta?.[1].content).toBe('https://example.com/custom-images/test-page.png')
  })
})
