import type { ResolvedOptions } from '../src/types.js'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { generateOgImage } from '../src/og.js'

describe('generateOgImage', () => {
  const testDir = '/tmp/vitepress-plugin-og-test'
  const templatePath = join(testDir, 'template.svg')
  const outputPath = join(testDir, 'output.png')

  beforeEach(() => {
    // Create test directory and template
    mkdirSync(testDir, { recursive: true })

    // Create a minimal SVG template
    const svgTemplate = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="50" y="100">{{line1}}</text>
  <text x="50" y="200">{{line2}}</text>
  <text x="50" y="300">{{line3}}</text>
</svg>`

    writeFileSync(templatePath, svgTemplate)
  })

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should generate an OG image file', async () => {
    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: templatePath,
      maxTitleSizePerLine: 30,
    }

    await generateOgImage({ title: 'Test Title' }, outputPath, options)

    expect(existsSync(outputPath)).toBe(true)
  })

  it('should not regenerate if output already exists', async () => {
    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: templatePath,
      maxTitleSizePerLine: 30,
    }

    // Create a dummy output file
    writeFileSync(outputPath, 'existing')
    const originalContent = readFileSync(outputPath, 'utf-8')

    await generateOgImage({ title: 'Test Title' }, outputPath, options)

    // File should remain unchanged
    const newContent = readFileSync(outputPath, 'utf-8')
    expect(newContent).toBe(originalContent)
  })

  it('should escape HTML characters in title', async () => {
    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: templatePath,
      maxTitleSizePerLine: 50,
    }

    // Title with HTML characters that need escaping
    const titleWithHtml = 'Title with <tags> & "quotes"'

    await generateOgImage({ title: titleWithHtml }, outputPath, options)

    expect(existsSync(outputPath)).toBe(true)
  })

  it('should create output directory if it does not exist', async () => {
    const nestedOutputPath = join(testDir, 'nested', 'dir', 'output.png')
    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: templatePath,
      maxTitleSizePerLine: 30,
    }

    await generateOgImage({ title: 'Test Title' }, nestedOutputPath, options)

    expect(existsSync(nestedOutputPath)).toBe(true)
  })

  it('should handle empty title gracefully', async () => {
    const options: ResolvedOptions = {
      domain: 'https://example.com',
      outDir: 'og',
      ogTemplate: templatePath,
      maxTitleSizePerLine: 30,
    }

    await generateOgImage({ title: '' }, outputPath, options)

    expect(existsSync(outputPath)).toBe(true)
  })
})
