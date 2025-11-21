import type { Options as CoreOptions } from '@og/core/types.js'

export interface Options extends CoreOptions {
  /**
   * The path to the OG image template file.
   *
   * @default 'og-template.svg'
   */
  ogTemplate?: string
}

export interface ResolvedOptions extends Required<Options> {}
