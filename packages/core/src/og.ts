import type { ResolvedOptions } from './types.js'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

const templates = new Map<string, string>()

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

  const svg = ogTemplate.replace(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || '')

  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(output)
}
