import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Keep the existing content metadata authoritative for both order and labels.
export async function sidebarFor(directory, route) {
  const metaPath = path.resolve(directory, '_meta.js')
  if (!existsSync(metaPath)) return []
  const { default: meta } = await import(pathToFileURL(metaPath).href)
  const items = []
  for (const [slug, value] of Object.entries(meta)) {
    const entry = typeof value === 'string' ? { title: value } : value
    if (entry.display === 'hidden') continue
    const item = { text: entry.title ?? slug }
    if (entry.href) {
      items.push({ ...item, link: entry.href, external: /^https?:/.test(entry.href) })
      continue
    }
    const childDirectory = slug === 'index' ? directory : path.join(directory, slug)
    const childRoute = slug === 'index' ? route : `${route}/${slug}`
    if (existsSync(path.join(childDirectory, 'page.mdx'))) item.link = childRoute
    if (slug !== 'index') {
      const children = await sidebarFor(childDirectory, childRoute)
      if (children.length) item.items = children
    }
    if (item.link || item.items) items.push(item)
  }
  return items
}
