import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
const output = 'out/public'
const origin = process.env.VOCS_BASE_URL || 'https://docs.celestia.org'
const preview = process.env.DOCS_PREVIEW === '1'
assert.ok((await readFile(`${output}/_worker.js`, 'utf8')).includes('async fetch'))
const homepage = await readFile(`${output}/index.html`, 'utf8')
assert.ok(homepage.includes(`<base href="${origin}"`), 'Missing homepage navigation origin')
for (const file of await readdir(output, { recursive: true })) {
  if (!file.endsWith('.html')) continue
  const html = await readFile(`${output}/${file}`, 'utf8')
  for (const match of html.matchAll(/<base href="([^"]+)"/g)) {
    assert.equal(new URL(match[1]).origin, origin, `${file}: wrong navigation origin`)
  }
  for (const match of html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)) {
    assert.equal(new URL(match[1]).origin, origin, `${file}: wrong canonical origin`)
  }
  assert.equal(html.includes('name="robots" content="noindex, nofollow"'), preview, `${file}: wrong indexing policy`)
}
const index = await readFile(`${output}/llms.txt`, 'utf8')
assert.ok(index.includes(`${origin}/learn/`), 'LLM index has wrong origin')
assert.ok(index.includes("Documentation MCP tools are available on this deployment at `/api/mcp`"), 'Missing MCP discovery')
const sitemap = await readFile(`${output}/sitemap.xml`, 'utf8')
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
assert.ok(locations.length > 0, 'Empty sitemap')
for (const [, location] of locations) assert.equal(new URL(location).origin, origin, 'Wrong sitemap origin')
const robots = await readFile(`${output}/robots.txt`, 'utf8')
assert.equal(/^Disallow: \/$/m.test(robots), preview, 'Wrong robots policy')
console.log(`Verified Cloudflare artifact: ${origin} (preview=${preview})`)
