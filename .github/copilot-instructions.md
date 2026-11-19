# VitePress Plugin OG - Copilot Instructions

## Project Overview
This project is a **VitePress plugin** that automatically generates Open Graph (OG) images for documentation pages. It converts SVG templates into PNG images using `sharp` and injects the necessary `<meta>` tags into the page head.

## Architecture & Key Components
- **Entry Point**: `src/index.ts` exports `addOgImage(pageData, options)`. This is designed to be used within VitePress's `transformPageData` hook.
- **Image Generation** (`src/og.ts`):
  - Uses `sharp` to convert SVG -> PNG.
  - **Standard Dimensions**: 1200x630 pixels.
  - **Template System**: Uses simple string replacement (`{{line1}}`, `{{line2}}`, `{{line3}}`) on SVG templates.
  - **Caching**: Caches SVG template contents in memory (`Map<string, string>`) to avoid repeated file reads.
  - **HTML Escaping**: All user input (titles) is escaped using `escapeHtml()` to prevent SVG injection.
- **Head Injection** (`src/head.ts`): Appends `og:image`, `twitter:image`, and related tags to `pageData.frontmatter.head`.
- **Options** (`src/options.ts`): Manages configuration like `domain`, `outDir` (default: `'og'`), and `maxTitleSizePerLine`.

## Development Workflow
- **Package Manager**: `pnpm` (v10+). Always use `pnpm` for installing dependencies.
- **Build Tool**: `tsdown` (Rollup-based). Run `pnpm run build` to compile TypeScript to JavaScript.
- **Linting**: `eslint` with `@antfu/eslint-config`. Run `pnpm run lint` to check, `pnpm run lint:fix` to auto-fix.
- **Testing**: Currently no automated tests. Manual testing can be done via the `.playground` directory.
- **Node Version**: Requires Node.js >=20.

## Coding Conventions
- **TypeScript**: Use explicit types for function parameters and return values. Avoid `any` types.
- **Imports**:
  - Use `node:` prefix for Node.js built-in modules (e.g., `import { join } from 'node:path'`).
  - Use `.js` extension in relative imports even for TypeScript files (e.g., `from './types.js'`).
  - Group imports: external dependencies first, then internal modules.
- **Code Style**:
  - Follow `@antfu/eslint-config` rules (no semicolons, single quotes, 2-space indentation).
  - Use `interface` over `type` for object types.
  - Prefer `const` over `let`, avoid `var`.
- **Error Handling**:
  - Do not throw errors for missing page titles; log a warning using `console.warn` and skip generation to prevent build failures.
  - Gracefully handle file system errors (e.g., missing templates, permission issues).
- **Async/Await**: Use `async/await` for asynchronous operations. Avoid callback patterns.
- **Dependencies**:
  - `vitepress` is a `peerDependency` (not bundled with the plugin).
  - `sharp` and `ufo` are direct dependencies.
  - Avoid adding unnecessary dependencies; prefer standard Node.js APIs.

## Specific Patterns
- **Title Wrapping**: Titles are split into multiple lines (up to 3) based on `maxTitleSizePerLine` using a regex in `src/og.ts`: `.split(new RegExp(`(.{0,${options.maxTitleSizePerLine}})(?:\\s|$)`, 'g'))`.
- **Path Handling**: Output paths are derived from the markdown file path, replacing slashes with dashes (e.g., `guide/getting-started.md` becomes `guide-getting-started.png`).
- **Caching**: Template files are read once and cached in a `Map` to optimize build performance.
- **Image Skipping**: If an OG image already exists, skip regeneration (`existsSync(output)`).

## Security Considerations
- **SVG Injection Prevention**: All title text is escaped using `escapeHtml()` before insertion into SVG templates to prevent malicious SVG content.
- **File System Safety**:
  - Always use `mkdirSync` with `{ recursive: true }` when creating directories.
  - Validate file paths to prevent directory traversal attacks.
- **Input Validation**: Validate user options (e.g., ensure `domain` is a valid URL format).

## Development & Testing
- **Playground**: The `.playground` directory contains a sample VitePress site for manual testing:
  - Run `cd .playground && pnpm install && pnpm run dev` to test the plugin locally.
  - Make changes to the plugin source, rebuild (`pnpm run build` in root), and restart the playground dev server.
- **No Automated Tests**: This project currently has no unit or integration tests. Changes should be manually verified using the playground.

## Common Tasks
- **Adding a new option**:
  1. Add to `Options` interface in `src/types.ts`.
  2. Add default value in `src/options.ts`.
  3. Use in relevant logic (usually `src/og.ts` or `src/head.ts`).
  4. Update README.md documentation.
- **Changing image generation logic**: Modify `generateOgImage()` in `src/og.ts`.
- **Changing meta tag injection**: Modify `addHead()` in `src/head.ts`.

## Troubleshooting
- **"Cannot generate OG image for page without title"**: This is expected for index pages or pages without titles. The plugin skips generation and logs a warning.
- **Sharp installation issues**: Ensure Node.js version is >=20. Sharp requires native binaries that may need recompilation on some systems.
- **Template not found**: Ensure the `ogTemplate` path is relative to the VitePress project root (not the plugin root).
