import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import worker from './index.js'

function assets(files = {}) {
  const requests = []
  return {
    requests,
    ASSETS: {
      async fetch(request) {
        const pathname = new URL(request.url ?? request).pathname
        requests.push(pathname)
        return pathname in files
          ? new Response(files[pathname])
          : new Response('Not found', { status: 404 })
      },
    },
  }
}

function rpc(body, pathname = '/api/mcp') {
  return new Request(`https://docs.example${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

for (const pathname of ['/api/mcp', '/api/mcp/', '/mcp', '/mcp/']) {
  test(`initialize works at ${pathname}`, async () => {
    const env = assets()
    const response = await worker.fetch(rpc({
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2025-06-18' },
    }, pathname), env)
    assert.equal(response.status, 200)
    assert.equal((await response.json()).result.serverInfo.name, 'celestia-docs')
    assert.equal(env.requests.length, 0)
  })
}

test('search uses one asset request even with hundreds of pages', async () => {
  const index = Array.from({ length: 300 }, (_, i) => ({
    pagePath: `/page-${i}`, text: i === 299 ? '# Fibre\nMonitor the server.' : 'Unrelated',
  }))
  const env = assets({ '/mcp-search-index.json': JSON.stringify(index) })
  const response = await worker.fetch(rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'search_docs', arguments: { query: 'FIBRE' } },
  }), env)
  const result = (await response.json()).result
  assert.deepEqual(JSON.parse(result.content[0].text), [{ path: '/page-299', snippet: '# Fibre' }])
  assert.deepEqual(env.requests, ['/mcp-search-index.json'])
})

test('read_page returns markdown and reports missing pages', async () => {
  const env = assets({ '/build/rpc/node-api.md': '# Node API' })
  for (const [pagePath, missing] of [['/build/rpc/node-api/', false], ['/missing', true]]) {
    const response = await worker.fetch(rpc({ jsonrpc: '2.0', id: 3, method: 'tools/call',
      params: { name: 'read_page', arguments: { pagePath } },
    }), env)
    const result = (await response.json()).result
    assert.equal(Boolean(result.isError), missing)
    if (!missing) assert.equal(result.content[0].text, '# Node API')
  }
})

test('malformed requests produce JSON-RPC errors; notifications return 202', async () => {
  const env = assets()
  for (const message of [null, 'invalid', {}, { id: 1, method: 'ping' }]) {
    const response = await worker.fetch(rpc(message), env)
    assert.equal((await response.json()).error.code, -32600)
  }
  const response = await worker.fetch(rpc({ jsonrpc: '2.0', method: 'notifications/initialized' }), env)
  assert.equal(response.status, 202)
})

test('non-MCP routes pass through to static assets', async () => {
  const env = assets({ '/learn/example': 'static page' })
  const response = await worker.fetch(new Request('https://docs.example/learn/example'), env)
  assert.equal(await response.text(), 'static page')
})

test('generated search index covers the current documentation', async () => {
  const index = JSON.parse(await readFile('out/public/mcp-search-index.json', 'utf8'))
  assert.ok(index.length > 50)
  assert.ok(index.some(({ pagePath }) => pagePath.replace(/\/$/, '') === '/operate/consensus-validators/fibre'))
  assert.ok(!index.some(({ pagePath }) => pagePath.includes('/components/')))
})
