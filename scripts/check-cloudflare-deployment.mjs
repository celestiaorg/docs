import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
const origin = new URL(process.argv[2]).origin
async function request(path, options, expectedStatus = 200) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(`${origin}${path}`, { ...options, signal: globalThis.AbortSignal.timeout(20000) })
      assert.equal(response.status, expectedStatus, `${path}: HTTP ${response.status}`)
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
for (const route of ['/build/developers', '/about', '/contact', '/privacy', '/build/rpc/authentication', '/build/rpc/clients', '/build/mcp', '/learn/TIA/paying-for-blobspace', '/build/post-retrieve-blob/overview']) {
  const html = await (await request(`${route}/`)).text()
  assert.match(html, /<h1\b/)
  const markdown = await (await request(`${route}.md`)).text()
  assert.ok(markdown.length > 500, `${route}: insufficient content`)
  const negotiated = await request(`${route}/`, { headers: { Accept: 'text/markdown' } })
  assert.match(negotiated.headers.get('Content-Type'), /^text\/markdown/)
  assert.equal(await negotiated.text(), markdown)
}
for (const [path, target] of [['/developers', '/build/developers/'], ['/developers/', '/build/developers/'], ['/developers.md', '/build/developers.md'], ['/build/rpc/node-api/authentication', '/build/rpc/authentication/'], ['/docs', '/build/developers/'], ['/pricing', '/learn/TIA/paying-for-blobspace/'], ['/pricing/', '/learn/TIA/paying-for-blobspace/'], ['/pricing.md', '/learn/TIA/paying-for-blobspace.md']]) {
  const redirect = await request(path, { redirect: 'manual' }, 301)
  assert.equal(new URL(redirect.headers.get('Location'), origin).pathname, target, path)
}
const card = await request('/mcp/server-card')
assert.equal(card.headers.get('Content-Type'), 'application/mcp-server-card+json')
assert.equal(new URL((await card.json()).remotes[0].url).pathname, '/mcp')
assert.ok((await (await request('/.well-known/ai-catalog.json')).json()).entries.some(entry => entry.type === 'application/mcp-server-card+json'))
for (const path of ['/llms.md', '/llms-full.txt', '/build/llms.txt', '/learn/llms.txt', '/operate/llms.txt', '/SKILL.md']) {
  assert.ok((await (await request(path)).text()).length > 100, path)
}
for (const path of ['/.well-known/ard.json', '/.well-known/ai-catalog.json', '/.well-known/agent-skills/index.json', '/.well-known/poppy.json']) {
  const response = await request(path)
  assert.match(response.headers.get('Content-Type'), /application\/json/)
  assert.ok(await response.json(), path)
}
const skills = await (await request('/.well-known/agent-skills/index.json')).json()
for (const skill of skills.skills) {
  const response = await request(new URL(skill.url).pathname)
  assert.match(response.headers.get('Content-Type'), /^text\/markdown/)
  const body = await response.text()
  assert.equal(`sha256:${createHash('sha256').update(body).digest('hex')}`, skill.digest)
}
for (const method of ['GET', 'HEAD']) {
  for (const accept of ['text/html', 'text/markdown', 'application/json', 'application/problem+json']) {
    const response = await request('/__agent-readiness-missing-page', { method, headers: { Accept: accept } }, 404)
    assert.ok(response.headers.get('Vary')?.includes('Accept'))
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store')
    const type = accept.startsWith('application/') ? 'application/problem+json' : accept
    assert.ok(response.headers.get('Content-Type')?.startsWith(type))
    const body = await response.text()
    if (method === 'HEAD') assert.equal(body, '')
    else if (accept === 'text/markdown') assert.match(body, /^# Page not found\n[\s\S]+\]\(\/llms.txt\)/)
    else if (accept.startsWith('application/')) {
      const error = JSON.parse(body)
      assert.equal(error.status, 404)
      assert.equal(error.code, 'NOT_FOUND')
      assert.ok(error.detail && error.hint)
    } else assert.match(body, /<html/i)
  }
}
for (const method of ['GET', 'POST']) {
  const response = await request('/api/__agent-readiness-missing', { method }, method === 'GET' ? 404 : 405)
  assert.equal((await response.json()).code, method === 'GET' ? 'NOT_FOUND' : 'METHOD_NOT_ALLOWED')
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
    assert.equal(response.headers.get('Cache-Control'), accept === 'text/html' ? 'private, no-cache' : 'private, no-store')
    if (accept === 'text/markdown') {
      assert.equal(body, expected, `${path}: negotiated Markdown differs from static export`)
      assert.doesNotMatch(body, /<html|<script/i)
    } else assert.match(body, /<html/i)
  }
  const head = await request(path, { method: 'HEAD', headers: { Accept: 'text/markdown' } })
  assert.match(head.headers.get('Content-Type') || '', /^text\/markdown/)
  assert.equal(await head.text(), '')
}
const spec = await (await request('/openapi.json')).json()
assert.equal(spec.swagger, '2.0')
assert.ok(spec.paths['/blob/v1/params'].get)
assert.ok(spec.produces.includes('application/json'))
for (const operation of Object.values(spec.paths).flatMap(Object.values)) {
  assert.ok(operation.responses['200'].schema, operation.operationId)
  assert.equal(operation.responses.default.schema.$ref, '#/definitions/rpcStatus')
}
const security = await (await request('/.well-known/security.txt')).text()
assert.match(security, /^Contact: mailto:security@celestia\.org$/m)
assert.ok(Date.parse(security.match(/^Expires: (.+)$/m)?.[1]) > Date.now())
const sitemap = await (await request('/sitemap.xml')).text()
assert.match(sitemap, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/)
assert.ok([...sitemap.matchAll(/<loc>/g)].length > 50)
for (const href of ['/about/', '/contact/', '/privacy/', '/build/developers/', 'https://celestia.org/tos/']) {
  assert.ok(homepage.includes(`href="${href}"`), `Missing trust link: ${href}`)
}
for (const method of ['GET', 'HEAD']) {
  const catalog = await request('/.well-known/api-catalog', { method })
  assert.equal(catalog.headers.get('Content-Type'), 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"')
  if (method === 'GET') {
    const { linkset } = await catalog.json()
    assert.ok(linkset.length)
    for (const item of linkset.flatMap(link => link.item || [])) {
      const response = await request(new URL(item.href).pathname)
      assert.match(response.headers.get('Content-Type'), /application\/json/)
      const contract = await response.json()
      assert.ok(contract.paths || contract.methods?.length, item.href)
    }
  }
}
for (const endpoint of ['/mcp', '/api/mcp']) {
  const invalidMethod = await request(endpoint, {}, 405)
  assert.equal(invalidMethod.headers.get('Allow'), 'POST, DELETE, OPTIONS')
  assert.match((await invalidMethod.json()).error.data.hint, /POST JSON-RPC/)
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
