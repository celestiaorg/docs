/**
 * MCP server for the Celestia docs, deployed as the `_worker.js` of the
 * Cloudflare Pages site. It serves /mcp and /api/mcp and passes everything
 * else through to the static site.
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

    const pages = await getPages(env)
    const contents = await Promise.all(
      pages.map(async (pagePath) => ({
        pagePath,
        text: await readPageMarkdown(env, pagePath),
      })),
    )
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

async function handleRpc(env, message) {
  const { id, method, params } = message

  if (id === undefined || id === null) return null

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
    const isMcpPath = url.pathname === '/mcp' || url.pathname === '/api/mcp'

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (!isMcpPath) return env.ASSETS.fetch(request)

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
