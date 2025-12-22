import type { ResolvedOptions } from './types.js'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

const templates = new Map<string, string>()
const baseImages = new Map<string, Promise<Buffer>>()

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function generateOgImage(
  { title }: { title: string },
  output: string,
  options: ResolvedOptions,
): Promise<void> {
  if (existsSync(output)) {
    return
  }

  if (!templates.has(options.ogTemplate)) {
    templates.set(options.ogTemplate, readFileSync(options.ogTemplate, 'utf-8'))
  }
  const ogTemplate = templates.get(options.ogTemplate)!

  if (!baseImages.has(options.ogTemplate)) {
    const baseSvg = ogTemplate.replace(/\{\{([^}]+)\}\}/g, '')
    const baseImageBuffer = sharp(Buffer.from(baseSvg))
      .resize(1200, 630)
      .png()
      .toBuffer()
    baseImages.set(options.ogTemplate, baseImageBuffer)
  }

  mkdirSync(dirname(output), { recursive: true })

  const lines = title
    .trim()
    .split(new RegExp(`(.{0,${options.maxTitleSizePerLine}})(?:\\s|$)`, 'g'))
    .filter(Boolean)

  const data: Record<string, string> = {
    line1: lines[0] ? escapeHtml(lines[0]) : '',
    line2: lines[1] ? escapeHtml(lines[1]) : '',
    line3: lines[2] ? escapeHtml(lines[2]) : '',
  }

  const textOnlySvg = createTextLayerSvg(ogTemplate, data)

  const textLayerBuffer = await sharp(Buffer.from(textOnlySvg))
    .resize(1200, 630)
    .png()
    .toBuffer()

  const baseImageBuffer = await baseImages.get(options.ogTemplate)!
  await sharp(baseImageBuffer)
    .composite([{
      input: textLayerBuffer,
      blend: 'over',
    }])
    .png()
    .toFile(output)
}

function createTextLayerSvg(template: string, data: Record<string, string>): string {
  // Extract only <text> elements that contain {{xxx}} placeholders
  const textElements = template.match(/<text[^>]*>[\s\S]*?<\/text>/g) || []
  const textWithPlaceholders = textElements.filter(element => /\{\{[^}]+\}\}/.test(element))

  // Replace placeholders with actual data
  const processedText = textWithPlaceholders.map(element =>
    element.replace(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || ''),

  )

  // Create a new SVG with only text elements that had placeholders
  const svgHeader = template.match(/<svg[^>]*>/)?.[0] || '<svg>'
  const textSvg = `${svgHeader}${processedText.join('')}</svg>`

  return textSvg
}
