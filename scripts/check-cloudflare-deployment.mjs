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
console.log(`Verified deployed pages, assets, markdown, search and MCP: ${origin}`)
