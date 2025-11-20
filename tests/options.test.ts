import type { Options } from '../src/types.js'
import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/options.js'

describe('resolveOptions', () => {
  it('should return default options when only domain is provided', () => {
    const userOptions: Options = {
      domain: 'https://example.com',
    }

    const resolved = resolveOptions(userOptions)

    expect(resolved).toEqual({
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: '.vitepress/og-template.svg',
      maxTitleSizePerLine: 30,
    })
  })

  it('should override default outDir when provided', () => {
    const userOptions: Options = {
      domain: 'https://example.com',
      outDir: 'custom-og',
    }

    const resolved = resolveOptions(userOptions)

    expect(resolved.outDir).toBe('custom-og')
  })

  it('should override default ogTemplate when provided', () => {
    const userOptions: Options = {
      domain: 'https://example.com',
      ogTemplate: 'custom-template.svg',
    }

    const resolved = resolveOptions(userOptions)

    expect(resolved.ogTemplate).toBe('custom-template.svg')
  })

  it('should override default maxTitleSizePerLine when provided', () => {
    const userOptions: Options = {
      domain: 'https://example.com',
      maxTitleSizePerLine: 50,
    }

    const resolved = resolveOptions(userOptions)

    expect(resolved.maxTitleSizePerLine).toBe(50)
  })

  it('should merge all custom options with defaults', () => {
    const userOptions: Options = {
      domain: 'https://custom.com',
      outDir: 'images',
      ogTemplate: 'my-template.svg',
      maxTitleSizePerLine: 40,
    }

    const resolved = resolveOptions(userOptions)

    expect(resolved).toEqual({
      domain: 'https://custom.com',
      outDir: 'images',
      ogTemplate: 'my-template.svg',
      maxTitleSizePerLine: 40,
    })
  })
})
