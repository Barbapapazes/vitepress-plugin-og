import type { ResolvedOptions } from './types.js'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

const templates = new Map<string, string>()
const baseImages = new Map<string, Buffer>()

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
    const baseImageBuffer = await sharp(Buffer.from(baseSvg))
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

  const baseImageBuffer = baseImages.get(options.ogTemplate)!
  await sharp(baseImageBuffer)
    .composite([{
      input: textLayerBuffer,
      blend: 'over',
    }])
    .png()
    .toFile(output)
}

function createTextLayerSvg(template: string, data: Record<string, string>): string {
  let textSvg = template.replace(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || '')

  textSvg = textSvg

    .replace(/<rect[^>]*\/>/g, '')
    .replace(/<rect[^>]*>[\s\S]*?<\/rect>/g, '')

    .replace(/<pattern[^>]*>[\s\S]*?<\/pattern>/g, '')

    .replace(/<linearGradient[^>]*>[\s\S]*?<\/linearGradient>/g, '')

    .replace(/<clipPath[^>]*>[\s\S]*?<\/clipPath>/g, '')

    .replace(/<image[^>]*\/>/g, '')
    .replace(/<image[^>]*>[\s\S]*?<\/image>/g, '')

  textSvg = textSvg.replace(
    /<svg([^>]*)>/,
    '<svg$1 style="background: transparent;">',
  )

  return textSvg
}
