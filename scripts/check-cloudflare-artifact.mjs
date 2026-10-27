import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
const output = 'out/public'
const origin = process.env.VOCS_BASE_URL || 'https://docs.celestia.org'
const preview = process.env.DOCS_PREVIEW === '1'
assert.ok((await readFile(`${output}/_worker.js`, 'utf8')).includes('async fetch'))
const routes = JSON.parse(await readFile(`${output}/_routes.json`, 'utf8'))
assert.deepEqual(routes, JSON.parse(await readFile('public/_routes.json', 'utf8')), 'Missing source routing configuration')
assert.equal(routes.version, 1)
assert.deepEqual(routes.include, ['/*'])
assert.ok(routes.include.length + routes.exclude.length <= 100)
assert.ok(routes.exclude.every(rule => rule.startsWith('/') && rule.length <= 100))
// Pages wildcards match across path segments, unlike filesystem globs.
const exclusions = routes.exclude.map(rule => new RegExp(`^${rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*')}$`))
const bypassesWorker = pathname => exclusions.some(rule => rule.test(pathname))
for (const pathname of ['/', '/build/rpc/node-api/', '/mcp', '/api/mcp', '/mcp/server-card', '/.well-known/api-catalog']) {
  assert.equal(bypassesWorker(pathname), false, `${pathname}: must invoke the Worker`)
}
const homepage = await readFile(`${output}/index.html`, 'utf8')
assert.ok(homepage.includes(`<base href="${origin}"`), 'Missing homepage navigation origin')
for (const file of await readdir(output, { recursive: true })) {
  if (file !== '_worker.js' && (await stat(`${output}/${file}`)).isFile()) {
    const inertAsset = /\.(?:js|css|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|wasm|pdf)$/.test(file)
      || /^assets\/.*\.json$/.test(file)
    assert.equal(bypassesWorker(`/${file}`), inertAsset, `${file}: incorrect Worker routing`)
  }
  if (file.endsWith('.js')) {
    const script = await readFile(`${output}/${file}`, 'utf8')
    assert.ok(!script.includes('Could not resolve "mermaid"'), `${file}: missing Mermaid dependency causes a browser reload loop`)
  }
  if (!file.endsWith('.html')) continue
  const html = await readFile(`${output}/${file}`, 'utf8')
  for (const match of html.matchAll(/<base href="([^"]+)"/g)) {
    assert.equal(new URL(match[1]).origin, origin, `${file}: wrong navigation origin`)
  }
  for (const match of html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)) {
    assert.equal(new URL(match[1]).origin, origin, `${file}: wrong canonical origin`)
    assert.ok(new URL(match[1]).pathname.endsWith('/'), `${file}: canonical must preserve trailing slash`)
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
