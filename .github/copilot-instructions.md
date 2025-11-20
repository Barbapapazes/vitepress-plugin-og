# VitePress Plugin OG - Copilot Instructions

## Project Overview
This project is a **VitePress plugin** that automatically generates Open Graph (OG) images for documentation pages. It converts SVG templates into PNG images using `sharp` and injects the necessary `<meta>` tags into the page head.

## Architecture & Key Components
- **Entry Point**: `src/index.ts` exports `addOgImage(pageData, options)`. This is designed to be used within VitePress's `transformPageData` hook.
- **Image Generation** (`src/og.ts`):
  - Uses `sharp` to convert SVG -> PNG.
  - **Standard Dimensions**: 1200x630 pixels.
  - **Template System**: Uses simple string replacement (`{{line1}}`, `{{line2}}`) on SVG templates.
  - **Caching**: Caches SVG template contents in memory (`Map<string, string>`) to avoid repeated file reads.
- **Head Injection** (`src/head.ts`): Appends `og:image`, `twitter:image`, and related tags to `pageData.frontmatter.head`.
- **Options** (`src/options.ts`): Manages configuration like `domain`, `outDir` (default: `'og'`), and `maxTitleSizePerLine`.

## Development Workflow
- **Package Manager**: `pnpm` (v10+).
- **Build Tool**: `tsdown` (Rollup-based). Run `pnpm run build`.
- **Linting**: `eslint` with `@antfu/eslint-config`. Run `pnpm run lint`.
- **Node Version**: Requires Node.js >=20.

## Coding Conventions
- **Imports**: Use `node:` prefix for Node.js built-in modules (e.g., `import { join } from 'node:path'`).
- **Error Handling**: Do not throw errors for missing page titles; log a warning using `console.warn` and skip generation to prevent build failures.
- **File Operations**: Use `replace_string_in_file` for edits.
- **Dependencies**: `vitepress` is a `peerDependency`. `sharp` and `ufo` are direct dependencies.

## Specific Patterns
- **Title Wrapping**: Titles are split into multiple lines (up to 3) based on `maxTitleSizePerLine` using a regex in `src/og.ts`.
- **Path Handling**: Output paths are derived from the markdown file path, replacing slashes with dashes.
