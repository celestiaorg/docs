import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { sidebarFor } from './vocs-sidebar.mjs'

const output = 'out/public'
const base = (process.env.BASE ?? '').replace(/\/$/, '')
async function filesIn(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await filesIn(name))
    else files.push(name)
  }
  return files
}
const pages = (await filesIn('app')).filter((file) => file.endsWith('/page.mdx'))
for (const page of pages) {
  const route = page.slice(4).replace(/page\.mdx$/, 'index.html')
  assert.ok(existsSync(path.join(output, route)), `Missing exported page: ${route}`)
}
const generated = await filesIn('src/pages')
assert.ok(generated.every((file) => file.endsWith('/index.mdx') || /\/_(layout\.tsx|root\.css)$/.test(file)), 'Implementation files became routes')
for (const section of ['learn', 'build', 'operate']) {
  const check = (items) => {
    for (const item of items) {
      if (item.link?.startsWith('/')) {
        assert.ok(existsSync(path.join('app', item.link, 'page.mdx')), `Missing sidebar page: ${item.link}`)
      }
      if (item.items) check(item.items)
    }
  }
  check(await sidebarFor(`app/${section}`, `/${section}`))
}
const htmlFiles = (await filesIn(output)).filter((file) => file.endsWith('.html'))
const runtimePages = new Set(['404.html', '404.d/index.html', '_root.d/index.html'])
const contentPaths = new Set(pages.map((page) => page.slice(4).replace(/page\.mdx$/, 'index.html')))
for (const file of htmlFiles) {
  const relative = path.relative(output, file)
  assert.ok(contentPaths.has(relative) || runtimePages.has(relative), `Unexpected public route: ${relative}`)
}
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"\s]*)"/g)) {
    const url = match[1]
    if (url.startsWith('//')) continue
    assert.ok(!base || url.startsWith(`${base}/`), `${file}: missing preview base in ${url}`)
    const pathname = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0])
    if (['/mcp', '/api/mcp'].includes(pathname)) continue
    const target = path.join(output, pathname)
    assert.ok(existsSync(target) || existsSync(path.join(target, 'index.html')), `${file}: missing asset/page ${url}`)
  }
}
console.log(`Verified ${pages.length} documentation pages, sidebar destinations, and all exported asset/link paths.`)
