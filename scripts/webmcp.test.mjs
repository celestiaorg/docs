import assert from 'node:assert/strict'
import test from 'node:test'
import { registerDocsTools } from '../src/lib/webmcp.js'

function setup(fetcher, page = '/docs/index.md') {
  const tools = new Map()
  const signals = []
  const cleanup = registerDocsTools({ async registerTool(tool, { signal }) {
    tools.set(tool.name, tool)
    signals.push(signal)
    signal.addEventListener('abort', () => tools.delete(tool.name))
  } }, { baseUrl: 'https://preview.example/docs/', getMarkdownUrl: () => page, fetcher })
  return { tools, signals, cleanup }
}

test('WebMCP searches the public index with bounded results and reads Markdown on the current deployment', async () => {
  const requests = []
  const { tools, signals, cleanup } = setup(async (url, options) => {
    requests.push([url.href, options.signal])
    return url.pathname.endsWith('.json')
      ? Response.json(Array.from({ length: 30 }, (_, i) => ({ pagePath: `/page-${i}`, text: '# Celestia\nFibre details' })))
      : new Response('# Celestia docs', { headers: { 'Content-Type': 'text/markdown' } })
  })
  const signal = new AbortController().signal
  const result = await tools.get('search_docs').execute({ query: ' FIBRE ' }, { signal })
  assert.equal(result.length, 20)
  assert.deepEqual(result[0], { path: '/page-0', snippet: 'Fibre details' })
  assert.deepEqual(await tools.get('read_current_page').execute({}), { markdown: '# Celestia docs' })
  assert.deepEqual(requests, [
    ['https://preview.example/docs/mcp-search-index.json', signal],
    ['https://preview.example/docs/index.md', undefined],
  ])
  cleanup()
  assert.ok(signals.every(signal => signal.aborted))
  assert.equal(tools.size, 0)
})

test('WebMCP rejects invalid input without fetching', async () => {
  const { tools } = setup(() => assert.fail('Unexpected fetch'))
  for (const query of ['', ' ', 1, 'x'.repeat(257)]) {
    await assert.rejects(tools.get('search_docs').execute({ query }), /query must contain/)
  }
})

test('WebMCP reports HTTP and HTML errors and prevents off-site reads', async () => {
  for (const response of [new Response('Unavailable', { status: 503 }), new Response('<html>', { headers: { 'Content-Type': 'text/html' } })]) {
    const { tools } = setup(async () => response)
    await assert.rejects(tools.get('read_current_page').execute({}), /HTTP 503|received HTML/)
  }
  for (const page of ['https://external.example/private.md', 'https://preview.example/private.md', undefined]) {
    const tools = new Map()
    registerDocsTools({ registerTool(tool) { tools.set(tool.name, tool); return Promise.resolve() } }, {
      baseUrl: 'https://preview.example/docs/', getMarkdownUrl: () => page,
      fetcher: () => assert.fail('Unexpected fetch'),
    })
    await assert.rejects(tools.get('read_current_page').execute({}), /Only documentation|does not advertise/)
  }
})
