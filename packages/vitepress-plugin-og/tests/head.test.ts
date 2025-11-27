import type { PageData } from 'vitepress'
import type { ResolvedOptions } from '../src/types.js'
import { expect, it } from 'vitest'
import { addHead } from '../src/head.js'

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

  addHead('test-page.png', pageData, options, '/')

  expect(pageData.frontmatter.head).toMatchInlineSnapshot(`
    [
      [
        "meta",
        {
          "content": "https://example.com/og/test-page.png",
          "name": "twitter:image",
        },
      ],
      [
        "meta",
        {
          "content": "summary_large_image",
          "name": "twitter:card",
        },
      ],
      [
        "meta",
        {
          "content": "https://example.com/og/test-page.png",
          "property": "og:image",
        },
      ],
      [
        "meta",
        {
          "content": "1200",
          "property": "og:image:width",
        },
      ],
      [
        "meta",
        {
          "content": "630",
          "property": "og:image:height",
        },
      ],
      [
        "meta",
        {
          "content": "image/png",
          "property": "og:image:type",
        },
      ],
    ]
  `)
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

  addHead('test-page.png', pageData as any, options, '/')

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

  addHead('test-page.png', pageData, options, '/')

  expect(pageData.frontmatter.head).toMatchInlineSnapshot(`
    [
      [
        "meta",
        {
          "content": "https://example.com/custom-images/test-page.png",
          "name": "twitter:image",
        },
      ],
      [
        "meta",
        {
          "content": "summary_large_image",
          "name": "twitter:card",
        },
      ],
      [
        "meta",
        {
          "content": "https://example.com/custom-images/test-page.png",
          "property": "og:image",
        },
      ],
      [
        "meta",
        {
          "content": "1200",
          "property": "og:image:width",
        },
      ],
      [
        "meta",
        {
          "content": "630",
          "property": "og:image:height",
        },
      ],
      [
        "meta",
        {
          "content": "image/png",
          "property": "og:image:type",
        },
      ],
    ]
  `)
})

it('should include base path in URL construction', () => {
  const pageData: PageData = {
    frontmatter: {},
  } as PageData

  const options: ResolvedOptions = {
    domain: 'https://example.com',
    outDir: 'og',
    ogTemplate: '.vitepress/og-template.svg',
    maxTitleSizePerLine: 30,
  }

  addHead('test-page.png', pageData, options, '/docs/')

  expect(pageData.frontmatter.head).toMatchInlineSnapshot(`
    [
      [
        "meta",
        {
          "content": "https://example.com/docs/og/test-page.png",
          "name": "twitter:image",
        },
      ],
      [
        "meta",
        {
          "content": "summary_large_image",
          "name": "twitter:card",
        },
      ],
      [
        "meta",
        {
          "content": "https://example.com/docs/og/test-page.png",
          "property": "og:image",
        },
      ],
      [
        "meta",
        {
          "content": "1200",
          "property": "og:image:width",
        },
      ],
      [
        "meta",
        {
          "content": "630",
          "property": "og:image:height",
        },
      ],
      [
        "meta",
        {
          "content": "image/png",
          "property": "og:image:type",
        },
      ],
    ]
  `)
})
