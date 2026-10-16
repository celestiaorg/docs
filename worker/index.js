/**
 * MCP server for the Celestia docs, deployed as the `_worker.js` of the
 * Cloudflare Pages site. It serves /mcp and /api/mcp and passes everything
 * else through to the static site, with Markdown negotiation and discovery headers.
 *
 * The tools mirror Vocs' built-in MCP docs tools, but read from the static
 * markdown files emitted during `bun run build` instead of the filesystem.
 */

const SERVER_INFO = { name: 'celestia-docs', version: '1.0.0' }
const PROTOCOL_VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18']

const TOOLS = [
  {
    name: 'list_pages',
    description: 'List all documentation pages with their paths.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'read_page',
    description: 'Read the content of a documentation page by its path.',
    inputSchema: {
      type: 'object',
      properties: {
        pagePath: {
          type: 'string',
          description: 'The page path (e.g., "/learn/TIA/overview" or "/build/rpc/node-api")',
        },
      },
      required: ['pagePath'],
    },
  },
  {
    name: 'search_docs',
    description: 'Search documentation for a query string.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query' },
      },
      required: ['query'],
    },
  },
]

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
}

function prefersMarkdown(accept = '') {
  const types = new Map(accept.toLowerCase().split(',').map(entry => {
    const [type, ...parameters] = entry.trim().split(';')
    const quality = parameters.find(value => value.trim().startsWith('q='))
    const q = quality ? Number(quality.trim().slice(2)) : 1
    return [type.trim(), Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0]
  }))
  const markdown = types.get('text/markdown') ?? 0
  const html = types.get('text/html') ?? types.get('text/*') ?? types.get('*/*') ?? 0
  return markdown > 0 && markdown >= html
}

async function serveDocs(request, env) {
  if (!['GET', 'HEAD'].includes(request.method)) return env.ASSETS.fetch(request)
  const url = new URL(request.url)
  const markdown = prefersMarkdown(request.headers.get('Accept') ?? '')
  let assetRequest = request
  if (markdown) {
    // HTML validators and byte ranges cannot validate the Markdown representation.
    const headers = new Headers(request.headers)
    for (const name of ['If-None-Match', 'If-Modified-Since', 'If-Range', 'Range']) headers.delete(name)
    assetRequest = new Request(request, { headers })
  }
  let response = await env.ASSETS.fetch(assetRequest)
  const html = response.headers.get('Content-Type')?.includes('text/html')
  if (markdown && html && response.status === 200) {
    const asset = await env.ASSETS.fetch(new Request(new URL(markdownPathForPage(url.pathname), url), {
      method: request.method,
    }))
    if (asset.status === 200 && !asset.headers.get('Content-Type')?.includes('text/html')) {
      await response.body?.cancel()
      response = new Response(asset.body, asset)
      response.headers.set('Content-Type', 'text/markdown; charset=utf-8')
    }
  }

  const headers = new Headers(response.headers)
  if (html || response.status === 304) {
    const vary = headers.get('Vary')
    if (!vary?.split(',').some(value => value.trim().toLowerCase() === 'accept')) {
      headers.set('Vary', vary ? `${vary}, Accept` : 'Accept')
    }
    // Pages caches source assets separately; never cache a negotiated URL as one shared body.
    headers.set('Cache-Control', 'private, no-store')
  }
  if (response.status === 200) {
    if (url.pathname.endsWith('.md') && !html) headers.set('Content-Type', 'text/markdown; charset=utf-8')
    if (url.pathname === '/.well-known/api-catalog') {
      headers.set('Content-Type', 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"')
    }
  }
  headers.append('Link', '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="describedby"; type="text/plain", </SKILL.md>; rel="describedby"; type="text/markdown"')
  return new Response(request.method === 'HEAD' ? null : response.body, {
    status: response.status, statusText: response.statusText, headers,
  })
}

async function fetchAsset(env, pathname) {
  const response = await env.ASSETS.fetch(new URL(pathname, 'https://assets.local'))
  return response.ok ? response.text() : null
}

function normalizePagePath(pagePath) {
  let pathname = String(pagePath || '/')

  try {
    pathname = new URL(pathname).pathname
  } catch {
    // The input is already a path.
  }

  if (!pathname.startsWith('/')) pathname = `/${pathname}`
  pathname = pathname.replace(/\.md$/, '').replace(/\/$/, '')
  if (pathname === '' || pathname === '/index') return '/'
  return pathname
}

function markdownPathForPage(pagePath) {
  const pathname = normalizePagePath(pagePath)
  return pathname === '/' ? '/index.md' : `${pathname}.md`
}

function stripSitemapComment(markdown) {
  return markdown.replace(/^<!--[\s\S]*?-->\s*/, '')
}

async function getPages(env) {
  const text = await fetchAsset(env, '/llms.txt')
  if (!text) throw new Error('Failed to load page index (llms.txt)')

  const pages = []
  const seen = new Set()

  for (const match of text.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)) {
    const pagePath = normalizePagePath(match[2])
    if (seen.has(pagePath)) continue
    seen.add(pagePath)
    pages.push(pagePath)
  }

  return pages
}

async function readPageMarkdown(env, pagePath) {
  const markdownPath = markdownPathForPage(pagePath)
  const text = await fetchAsset(env, markdownPath)
  return text === null ? null : stripSitemapComment(text)
}

async function callTool(env, name, args) {
  if (name === 'list_pages') {
    const pages = await getPages(env)
    return { content: [{ type: 'text', text: JSON.stringify(pages, null, 2) }] }
  }

  if (name === 'read_page') {
    const text = await readPageMarkdown(env, args?.pagePath)
    if (text === null) {
      return {
        content: [{ type: 'text', text: `Page not found: ${args?.pagePath}` }],
        isError: true,
      }
    }
    return { content: [{ type: 'text', text }] }
  }

  if (name === 'search_docs') {
    const query = String(args?.query ?? '').toLowerCase()
    if (!query) return { content: [{ type: 'text', text: '[]' }] }

    const index = await fetchAsset(env, '/mcp-search-index.json')
    if (index === null) throw new Error('Failed to load search index')
    const contents = JSON.parse(index)
    const results = []

    for (const { pagePath, text } of contents) {
      if (!text || !text.toLowerCase().includes(query)) continue
      const matchLine = text.split('\n').find((line) => line.toLowerCase().includes(query))
      results.push({
        path: pagePath,
        snippet: matchLine?.trim().slice(0, 200) || '',
      })
    }

    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] }
  }

  throw { code: -32602, message: `Unknown tool: ${name}` }
}

function invalidRequest() {
  return {
    jsonrpc: '2.0',
    id: null,
    error: { code: -32600, message: 'Invalid Request' },
  }
}

function isRpcMessage(message) {
  return message !== null && typeof message === 'object' && !Array.isArray(message)
    && message.jsonrpc === '2.0' && typeof message.method === 'string'
    && (message.id === undefined || message.id === null
      || typeof message.id === 'string' || typeof message.id === 'number')
}

async function handleRpc(env, message) {
  if (!isRpcMessage(message)) return invalidRequest()

  const { id, method, params } = message

  if (id === undefined) return null

  try {
    let result

    if (method === 'initialize') {
      const requested = params?.protocolVersion
      result = {
        protocolVersion: PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : PROTOCOL_VERSIONS.at(-1),
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      }
    } else if (method === 'ping') {
      result = {}
    } else if (method === 'tools/list') {
      result = { tools: TOOLS }
    } else if (method === 'tools/call') {
      result = await callTool(env, params?.name, params?.arguments)
    } else {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      }
    }

    return { jsonrpc: '2.0', id, result }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: typeof error?.code === 'number' ? error.code : -32603,
        message: error?.message ?? String(error),
      },
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname.replace(/\/+$/, '')
    const isMcpPath = pathname === '/mcp' || pathname === '/api/mcp'

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (!isMcpPath) return serveDocs(request, env)

    if (request.method === 'GET') {
      return new Response('SSE is not supported; POST JSON-RPC messages instead', {
        status: 405,
        headers: { ...CORS_HEADERS, Allow: 'POST, DELETE, OPTIONS' },
      })
    }

    if (request.method === 'DELETE') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    const messages = Array.isArray(body) ? body : [body]
    const responses = (await Promise.all(messages.map((message) => handleRpc(env, message)))).filter(
      (response) => response !== null,
    )

    if (responses.length === 0) {
      return new Response(null, { status: 202, headers: CORS_HEADERS })
    }

    return Response.json(Array.isArray(body) ? responses : responses[0], {
      headers: CORS_HEADERS,
    })
  },
}
