export function slugifyPath(path: string): string {
  return `${path.replace(/\//g, '-').replace(/\.mdx?$/, '')}.png`
}
