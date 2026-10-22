// WebMCP uses the same public Markdown and search index as the docs MCP server.
export function registerDocsTools(modelContext, { baseUrl, getMarkdownUrl, fetcher = fetch }) {
  const controller = new AbortController()
  const base = new URL(baseUrl)
  async function read(url, signal) {
    const target = new URL(url, base)
    if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname)) {
      throw new Error('Only documentation on this site can be read.')
    }
    const response = await fetcher(target, { signal })
    if (!response.ok) throw new Error(`Documentation request failed: HTTP ${response.status}`)
    if (response.headers.get('Content-Type')?.includes('text/html')) {
      throw new Error('Expected documentation data, received HTML.')
    }
    return response
  }
  const tools = [
    {
      name: 'search_docs',
      description: 'Search public Celestia documentation. Returns up to 20 matching page paths and snippets.',
      inputSchema: { type: 'object', properties: { query: { type: 'string', minLength: 1, maxLength: 256 } }, required: ['query'], additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute({ query }, { signal } = {}) {
        if (typeof query !== 'string' || !query.trim() || query.length > 256) {
          throw new Error('query must contain 1 to 256 characters.')
        }
        const needle = query.trim().toLowerCase()
        const index = await (await read('mcp-search-index.json', signal)).json()
        return index.filter(({ text }) => text.toLowerCase().includes(needle)).slice(0, 20)
          .map(({ pagePath, text }) => ({
            path: pagePath,
            snippet: text.split('\n').find(line => line.toLowerCase().includes(needle)).trim().slice(0, 200),
          }))
      },
    },
    {
      name: 'read_current_page',
      description: 'Read the current Celestia documentation page as Markdown.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute(_args, { signal } = {}) {
        const url = getMarkdownUrl()
        if (!url) throw new Error('This page does not advertise a Markdown version.')
        return { markdown: await (await read(url, signal)).text() }
      },
    },
  ]
  for (const tool of tools) {
    // Registration may reject when browser policy disables tools or a name is taken.
    Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal }))
      .catch(error => { if (!controller.signal.aborted) console.warn('WebMCP registration failed:', error) })
  }
  return () => controller.abort()
}
