import assert from 'node:assert/strict'
const origin = new URL(process.argv[2]).origin
async function request(path, options) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(`${origin}${path}`, { ...options, signal: globalThis.AbortSignal.timeout(20000) })
      assert.ok(response.ok, `${path}: HTTP ${response.status}`)
      return response
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }
}
for (const path of ['/', '/learn/TIA/overview', '/build/rpc/node-api', '/operate/getting-started/overview', '/logo-light.svg', '/llms.txt', '/learn/TIA/overview.md', '/mcp-search-index.json']) {
  const response = await request(path)
  assert.ok((await response.text()).length > 0, `${path}: empty response`)
}
// A normal GET does not catch the browser's cross-origin navigation preflight.
const homepage = await (await request('/')).text()
const navigationOrigin = new URL(homepage.match(/<base href="([^"]+)"/)?.[1] || origin).origin
const navigationUrl = `${navigationOrigin}/RSC/R/build/post-retrieve-blob/overview.txt?query=`
const preflight = await fetch(navigationUrl, {
  method: 'OPTIONS',
  headers: { Origin: origin, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'x-waku-router-skip' },
  signal: AbortSignal.timeout(20000),
})
assert.ok(preflight.ok, `Navigation preflight: HTTP ${preflight.status}`)
assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), '*')
assert.ok(preflight.headers.get('Access-Control-Allow-Methods')?.split(',').some(value => value.trim() === 'GET'))
assert.ok(preflight.headers.get('Access-Control-Allow-Headers')?.toLowerCase().split(',').some(value => value.trim() === 'x-waku-router-skip'))
const navigation = await fetch(navigationUrl, {
  headers: { Origin: origin, 'X-Waku-Router-Skip': '[]' },
  signal: AbortSignal.timeout(20000),
})
assert.ok(navigation.ok, `Navigation data: HTTP ${navigation.status}`)
assert.equal(navigation.headers.get('Access-Control-Allow-Origin'), '*')
assert.doesNotMatch(await navigation.text(), /<html/i, 'Navigation data must not be an HTML fallback')
for (const path of ['/', '/build/post-retrieve-blob/client/go/']) {
  const markdownPath = path === '/' ? '/index.md' : `${path.slice(0, -1)}.md`
  const expected = await (await request(markdownPath)).text()
  for (const accept of ['text/html', 'text/markdown', 'text/html']) {
    const response = await request(path, { headers: { Accept: accept } })
    const body = await response.text()
    assert.match(response.headers.get('Content-Type') || '', new RegExp(`^${accept}\\b`))
    assert.ok(response.headers.get('Vary')?.split(',').some(value => value.trim().toLowerCase() === 'accept'), `${path}: missing Vary: Accept`)
    assert.match(response.headers.get('Link') || '', /rel="api-catalog"/)
    assert.match(response.headers.get('Cache-Control') || '', /no-store/)
    if (accept === 'text/markdown') {
      assert.equal(body, expected, `${path}: negotiated Markdown differs from static export`)
      assert.doesNotMatch(body, /<html|<script/i)
    } else assert.match(body, /<html/i)
  }
  const head = await request(path, { method: 'HEAD', headers: { Accept: 'text/markdown' } })
  assert.match(head.headers.get('Content-Type') || '', /^text\/markdown/)
  assert.equal(await head.text(), '')
}
for (const method of ['GET', 'HEAD']) {
  const catalog = await request('/.well-known/api-catalog', { method })
  assert.equal(catalog.headers.get('Content-Type'), 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"')
  if (method === 'GET') assert.ok((await catalog.json()).linkset.length)
}
for (const endpoint of ['/mcp', '/api/mcp']) {
  for (const [method, params] of [
    ['initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'deploy-smoke', version: '1' } }],
    ['tools/list', {}],
    ['tools/call', { name: 'read_page', arguments: { pagePath: '/learn/TIA/overview' } }],
    ['tools/call', { name: 'search_docs', arguments: { query: 'Celestia' } }],
  ]) {
    const response = await request(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const body = await response.json()
    assert.ok(body.result && !body.error && !body.result.isError, `${endpoint}: ${method} failed`)
    if (params.name === 'search_docs') assert.ok(JSON.parse(body.result.content[0].text).length > 0)
  }
}
console.log(`Verified deployed pages, assets, negotiated Markdown, discovery, search and MCP: ${origin}`)
