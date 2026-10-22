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
          ? (files[pathname] instanceof Response ? new Response(files[pathname].body ? await files[pathname].clone().arrayBuffer() : null, files[pathname]) : new Response(files[pathname]))
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

test('preview navigation permits the Waku router preflight header', async () => {
  const response = await worker.fetch(new Request('https://pr-2658.docs.pages.dev/RSC/R/build/post-retrieve-blob/overview.txt?query=', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://deployment.docs.pages.dev',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'x-waku-router-skip',
    },
  }), assets())
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*')
  assert.ok(response.headers.get('Access-Control-Allow-Methods').split(',').map(value => value.trim()).includes('GET'))
  assert.ok(response.headers.get('Access-Control-Allow-Headers').toLowerCase().split(',').map(value => value.trim()).includes('x-waku-router-skip'))
})

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

test('read_page without pagePath returns an argument error', async () => {
  const response = await worker.fetch(rpc({ jsonrpc: '2.0', id: 4, method: 'tools/call',
    params: { name: 'read_page', arguments: {} },
  }), assets({ '/index.md': '# Home' }))
  assert.equal((await response.json()).error.code, -32602)
})

test('empty batches are invalid requests', async () => {
  const response = await worker.fetch(rpc([]), assets())
  assert.equal(response.status, 400)
  assert.equal((await response.json()).error.code, -32600)
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

for (const pathname of ['/', '/learn/TIA/overview/']) {
  test(`negotiates HTML and Markdown at ${pathname} without mixing representations`, async () => {
    const mdPath = pathname === '/' ? '/index.md' : '/learn/TIA/overview.md'
    const env = assets({
      [pathname]: new Response('<h1>Celestia</h1>', { headers: { 'Content-Type': 'text/html', Vary: 'Accept-Encoding', Link: '</logo.svg>; rel="preload"' } }),
      [mdPath]: '# Celestia',
    })
    for (const [accept, markdown] of [
      ['text/html', false], ['text/markdown', true], ['text/html', false],
      ['text/markdown;q=0, text/html', false], ['text/markdown;q=0.5, text/html', false],
      ['text/markdown;q=1, text/html;q=0.5', true], ['*/*', false],
      ['TEXT/MARKDOWN; q=1', true], ['text/markdown;q=invalid', false],
    ]) {
      const response = await worker.fetch(new Request(`https://docs.example${pathname}`, { headers: { Accept: accept } }), env)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('Content-Type'), markdown ? /^text\/markdown/ : /^text\/html/)
      assert.match(response.headers.get('Vary'), /Accept/)
      assert.equal(response.headers.get('Cache-Control'), markdown ? 'private, no-store' : 'private, no-cache')
      assert.match(response.headers.get('Link'), /rel="api-catalog"/)
      if (!markdown) {
        assert.match(response.headers.get('Vary'), /Accept-Encoding/)
        assert.match(response.headers.get('Link'), /rel="preload"/)
      }
      assert.equal(await response.text(), markdown ? '# Celestia' : '<h1>Celestia</h1>')
    }
    for (const accept of ['text/markdown', 'text/html']) {
      const response = await worker.fetch(new Request(`https://docs.example${pathname}`, { method: 'HEAD', headers: { Accept: accept } }), env)
      assert.equal(await response.text(), '')
      assert.match(response.headers.get('Content-Type'), new RegExp('^' + accept))
    }
  })
}

test('Markdown ignores HTML conditional headers and byte ranges', async () => {
  const env = { ASSETS: { async fetch(request) {
    assert.equal(request.headers.get('If-None-Match'), null)
    assert.equal(request.headers.get('If-Modified-Since'), null)
    assert.equal(request.headers.get('Range'), null)
    assert.equal(request.headers.get('If-Range'), null)
    return new URL(request.url).pathname === '/index.md'
      ? new Response('# Docs')
      : new Response('<h1>Docs</h1>', { headers: { 'Content-Type': 'text/html' } })
  } } }
  const response = await worker.fetch(new Request('https://docs.example/', { headers: {
    Accept: 'text/markdown', 'If-None-Match': '"html"', 'If-Modified-Since': 'Wed, 01 Jan 2025 00:00:00 GMT', Range: 'bytes=0-5', 'If-Range': '"html"',
  } }), env)
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '# Docs')
})

test('preserves redirects, errors and non-HTML assets; catalog type applies only on success', async () => {
  for (const status of [200, 404, 500]) {
    const env = assets({ '/.well-known/api-catalog': new Response('{}', { status }) })
    const response = await worker.fetch(new Request('https://docs.example/.well-known/api-catalog'), env)
    assert.equal(response.status, status)
    if (status === 200) assert.equal(response.headers.get('Content-Type'), 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"')
    else assert.doesNotMatch(response.headers.get('Content-Type'), /linkset/)
  }
  for (const [path, response] of [
    ['/guide', new Response(null, { status: 301, headers: { Location: '/guide/' } })],
    ['/error', new Response('Unavailable', { status: 503, headers: { 'Content-Type': 'text/html' } })],
    ['/image.svg', new Response('<svg/>', { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } })],
    ['/missing.md', new Response('<h1>HTML fallback</h1>', { headers: { 'Content-Type': 'text/html' } })],
    ['/fallback/', new Response('<h1>HTML</h1>', { headers: { 'Content-Type': 'text/html' } })],
  ]) {
    const env = assets({ [path]: response })
    const result = await worker.fetch(new Request(`https://docs.example${path}`, { headers: { Accept: 'text/markdown' } }), env)
    assert.equal(result.status, response.status)
    assert.equal(result.headers.get('Content-Type'), response.headers.get('Content-Type'))
    assert.equal(result.headers.get('Location'), response.headers.get('Location'))
    assert.equal(await result.text(), await response.text())
    if (path.endsWith('.svg')) assert.equal(result.headers.get('Cache-Control'), 'public, max-age=3600')
  }
})

test('missing resources negotiate Markdown and problem JSON without stale entity headers', async () => {
  for (const sourceType of ['text/html', 'text/plain']) {
    const env = assets({ '/missing': new Response('Missing', { status: 404, headers: {
      'Content-Type': sourceType, ETag: '"html"', 'Content-Length': '7',
      'Last-Modified': 'Wed, 01 Jan 2025 00:00:00 GMT', Vary: 'Accept-Encoding',
    } }) })
    for (const [accept, type] of [
      ['text/markdown', 'text/markdown'],
      ['application/json', 'application/problem+json'],
      ['application/problem+json', 'application/problem+json'],
      ['text/markdown;q=0.5, application/json', 'application/problem+json'],
      ['application/json;q=0.5, text/markdown', 'text/markdown'],
      ['text/html', sourceType],
      ['text/markdown;q=0, application/json;q=0', sourceType],
      ['text/markdown;q=0.5, text/html', sourceType],
      ['*/*', sourceType],
    ]) {
      for (const method of ['GET', 'HEAD']) {
        const response = await worker.fetch(new Request('https://docs.example/missing', {
          method, headers: { Accept: accept },
        }), env)
        assert.equal(response.status, 404)
        assert.ok(response.headers.get('Content-Type').startsWith(type))
        assert.equal(response.headers.get('Vary'), 'Accept-Encoding, Accept')
        assert.equal(response.headers.get('Cache-Control'), 'private, no-store')
        if (type !== sourceType) {
          for (const name of ['ETag', 'Content-Length', 'Last-Modified']) assert.equal(response.headers.get(name), null)
        }
        const body = await response.text()
        if (method === 'HEAD') assert.equal(body, '')
        else if (type === 'text/markdown') assert.match(body, /^# Page not found\n[\s\S]+\[documentation index\]\(\/llms.txt\)/)
        else if (type === 'application/problem+json') {
          const problem = JSON.parse(body)
          assert.equal(problem.type, 'about:blank')
          assert.equal(problem.status, response.status)
          assert.equal(problem.code, 'NOT_FOUND')
          assert.ok(problem.detail.length > 20 && problem.hint.includes('/llms.txt'))
        } else assert.equal(body, 'Missing')
      }
    }
  }
})

test('unknown API routes return JSON errors for GET and POST while existing assets remain available', async () => {
  for (const method of ['GET', 'POST']) {
    const response = await worker.fetch(new Request('https://docs.example/api/missing', { method }), assets())
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('Content-Type'), 'application/problem+json')
    assert.equal((await response.json()).code, 'NOT_FOUND')
  }
  const response = await worker.fetch(new Request('https://docs.example/api/example.json'), assets({ '/api/example.json': '{"ok":true}' }))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
})

test('Pages asset method errors retain HTTP 405 and become problem JSON', async () => {
  const env = assets({ '/api/missing': new Response('Method not allowed', {
    status: 405, headers: { 'Content-Type': 'text/html', Allow: 'GET, HEAD, OPTIONS' },
  }) })
  const response = await worker.fetch(new Request('https://docs.example/api/missing', { method: 'POST' }), env)
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('Content-Type'), 'application/problem+json')
  assert.equal(response.headers.get('Allow'), 'GET, HEAD, OPTIONS')
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store')
  assert.equal(response.headers.get('Vary'), 'Accept')
  const problem = await response.json()
  assert.equal(problem.status, 405)
  assert.equal(problem.code, 'METHOD_NOT_ALLOWED')
  assert.ok(problem.hint)
})

test('MCP method errors retain JSON-RPC format, status, allowed methods and a resolution hint', async () => {
  for (const path of ['/mcp', '/api/mcp']) {
    for (const method of ['GET', 'HEAD', 'PUT', 'PATCH']) {
      const response = await worker.fetch(new Request(`https://docs.example${path}`, { method }), assets())
      assert.equal(response.status, 405)
      assert.equal(response.headers.get('Content-Type'), 'application/json')
      assert.equal(response.headers.get('Allow'), 'POST, DELETE, OPTIONS')
      assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*')
      if (method === 'HEAD') assert.equal(await response.text(), '')
      else {
        const body = await response.json()
        assert.equal(body.jsonrpc, '2.0')
        assert.equal(body.id, null)
        assert.equal(body.error.code, -32600)
        assert.match(body.error.data.hint, /POST JSON-RPC/)
      }
    }
  }
})


test('HTML conditional requests preserve validators and require browser revalidation', async () => {
  const env = { ASSETS: { async fetch(request) {
    assert.equal(request.headers.get('If-None-Match'), '"html"');
    return new Response(null, { status: 304, headers: { ETag: '"html"' } });
  } } };
  const response = await worker.fetch(new Request('https://docs.example/', {
    headers: { Accept: 'text/html', 'If-None-Match': '"html"' },
  }), env);
  assert.equal(response.status, 304);
  assert.equal(response.headers.get('ETag'), '"html"');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-cache');
  assert.equal(response.headers.get('Vary'), 'Accept');
});
