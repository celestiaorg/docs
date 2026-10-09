import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = 'out/public'
await copyFile('worker/index.js', `${output}/_worker.js`)
// Match the existing public URLs and sitemap, which use trailing slashes.
for (const file of await readdir(output, { recursive: true })) {
  if (!file.endsWith('.html')) continue
  const target = path.join(output, file)
  let html = await readFile(target, 'utf8')
  html = html.replace(/(<link\b[^>]*rel="canonical"[^>]*href=")([^"]+)(")/g, (_, prefix, href, suffix) => {
    const url = new URL(href)
    if (!url.pathname.endsWith('/')) url.pathname += '/'
    return `${prefix}${url.href}${suffix}`
  })
  if (process.env.DOCS_PREVIEW === '1') {
    // Also protects previews served outside Pages, such as local review.
    html = html.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">')
  }
  await writeFile(target, html)
}
if (process.env.DOCS_PREVIEW === '1') {
  await writeFile(`${output}/robots.txt`, 'User-agent: *\nDisallow: /\n')
}
