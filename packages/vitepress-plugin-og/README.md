# vitepress-plugin-og

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![pkg.pr.new](https://pkg.pr.new/badge/Barbapapazes/vitepress-plugin-og)](https://pkg.pr.new/~/Barbapapazes/vitepress-plugin-og)

Automatically generate Open Graph images for your VitePress pages.

- 🖼️ Generates OG images from an SVG template
- 🚀 Integrates with VitePress
- 🧩 Bring your own SVG template

## Installation

```bash
pnpm add -D vitepress-plugin-og
```

## Usage

Add the plugin to your VitePress configuration file (`.vitepress/config.ts`):

```ts
import { defineConfig } from 'vitepress'
import { addOgImage } from 'vitepress-plugin-og'

export default defineConfig({
  // ...
  async transformPageData(pageData, context) {
    await addOgImage(pageData, context, {
      domain: 'https://example.com',
      // ...other options
    })
  }
})
```

## Configuration

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `domain` | `string` | **Required** | The domain to use for the generated OG image URLs. |
| `outDir` | `string` | `'og'` | Output directory for the generated OG images (inside `public`). |
| `ogTemplate` | `string` | `'.vitepress/og-template.svg'` | The path to the OG image template file. |
| `maxTitleSizePerLine` | `number` | `30` | Maximum number of characters per line in the title. |

## Template

Create an SVG template at `.vitepress/og-template.svg` (or your configured path). Use `{{line1}}`, `{{line2}}`, and `{{line3}}` placeholders for the title lines.

Example:

```xml
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#1e1e1e" />

  <!-- Title -->
  <text x="60" y="200" font-family="Arial" font-size="80" fill="#ffffff">
    <tspan x="60" dy="0">{{line1}}</tspan>
    <tspan x="60" dy="100">{{line2}}</tspan>
    <tspan x="60" dy="100">{{line3}}</tspan>
  </text>
</svg>
```

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src='https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](../../LICENSE) License © 2025-PRESENT [Estéban Soubiran](https://github.com/barbapapazes)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vitepress-plugin-og/latest.svg?style=flat&colorA=000&colorB=171717
[npm-version-href]: https://npmjs.com/package/vitepress-plugin-og

[npm-downloads-src]: https://img.shields.io/npm/dm/vitepress-plugin-og.svg?style=flat&colorA=000&colorB=171717
[npm-downloads-href]: https://npmjs.com/package/vitepress-plugin-og

[license-src]: https://img.shields.io/npm/l/vitepress-plugin-og.svg?style=flat&colorA=000&colorB=171717
[license-href]: https://npmjs.com/package/vitepress-plugin-og
