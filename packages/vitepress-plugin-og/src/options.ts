import type { Options, ResolvedOptions } from './types.js'

export function resolveOptions(userOptions: Options): ResolvedOptions {
  const defaultOptions: ResolvedOptions = {
    domain: '',
    outDir: 'og',
    ogTemplate: '.vitepress/og-template.svg',
    maxTitleSizePerLine: 30,
  }

  const options = {
    ...defaultOptions,
    ...userOptions,
  }

  return options as ResolvedOptions
}
