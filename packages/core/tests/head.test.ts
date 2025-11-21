import { describe, expect, it } from 'vitest'
import { createHead, createOgImageHead, createOgImageHeightHead, createOgImageTypeHead, createOgImageWidthHead, createTwitterCardHead, createTwitterImageHead } from '../src/head.js'

describe('createTwitterImageHead', () => {
  it('returns twitter:image meta tag', () => {
    const url = 'https://example.com/og/image.png'
    const result = createTwitterImageHead(url)

    expect(result).toEqual(['meta', { name: 'twitter:image', content: url }])
  })
})

describe('createTwitterCardHead', () => {
  it('returns twitter:card meta tag with summary_large_image', () => {
    const result = createTwitterCardHead()

    expect(result).toEqual(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
  })
})

describe('createOgImageHead', () => {
  it('returns og:image meta tag', () => {
    const url = 'https://example.com/og/image.png'
    const result = createOgImageHead(url)

    expect(result).toEqual(['meta', { property: 'og:image', content: url }])
  })
})

describe('createOgImageWidthHead', () => {
  it('returns og:image:width meta tag with 1200', () => {
    const result = createOgImageWidthHead()

    expect(result).toEqual(['meta', { property: 'og:image:width', content: '1200' }])
  })
})

describe('createOgImageHeightHead', () => {
  it('returns og:image:height meta tag with 630', () => {
    const result = createOgImageHeightHead()

    expect(result).toEqual(['meta', { property: 'og:image:height', content: '630' }])
  })
})

describe('createOgImageTypeHead', () => {
  it('returns og:image:type meta tag with image/png', () => {
    const result = createOgImageTypeHead()

    expect(result).toEqual(['meta', { property: 'og:image:type', content: 'image/png' }])
  })
})

describe('createHead', () => {
  const url = 'https://example.com/og/image.png'
  const head = createHead(url)

  it('returns six meta tags', () => {
    expect(head).toHaveLength(6)

    expect(head).toMatchInlineSnapshot(`
      [
        [
          "meta",
          {
            "content": "https://example.com/og/image.png",
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
            "content": "https://example.com/og/image.png",
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
})
