export function createTwitterImageHead(imageUrl: string): [string, Record<string, string>] {
  return ['meta', { name: 'twitter:image', content: imageUrl }]
}

export function createTwitterCardHead(): [string, Record<string, string>] {
  return ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
}

export function createOgImageHead(imageUrl: string): [string, Record<string, string>] {
  return ['meta', { property: 'og:image', content: imageUrl }]
}

export function createOgImageWidthHead(): [string, Record<string, string>] {
  return ['meta', { property: 'og:image:width', content: '1200' }]
}

export function createOgImageHeightHead(): [string, Record<string, string>] {
  return ['meta', { property: 'og:image:height', content: '630' }]
}

export function createOgImageTypeHead(): [string, Record<string, string>] {
  return ['meta', { property: 'og:image:type', content: 'image/png' }]
}

export function createHead(imageUrl: string): [string, Record<string, string>][] {
  return [
    createTwitterImageHead(imageUrl),
    createTwitterCardHead(),
    createOgImageHead(imageUrl),
    createOgImageWidthHead(),
    createOgImageHeightHead(),
    createOgImageTypeHead(),
  ]
}
