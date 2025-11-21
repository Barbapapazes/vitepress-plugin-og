export interface Options {
  /**
   * The domain to use for the generated OG image URLs.
   */
  domain: string
  /**
   * Output directory for the generated OG images.
   *
   * @default 'og'
   */
  outDir?: string
  /**
   * Maximum number of characters per line in the title.
   *
   * @default 30
   */
  maxTitleSizePerLine?: number
  /**
   * The path to the OG image template file.
   *
   * @default '.vitepress/og-template.svg' for VitePress
   * @default 'og-template.svg' for Rspress
   */
  ogTemplate?: string
}

export interface ResolvedOptions extends Required<Options> {}
