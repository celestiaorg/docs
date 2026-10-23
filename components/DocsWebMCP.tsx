'use client'

import { useEffect } from 'react'
import { markdownPathFor, registerDocsTools } from '@/src/lib/webmcp.js'

type WebMCPDocument = Document & {
  modelContext?: { registerTool: (tool: unknown, options: { signal: AbortSignal }) => Promise<void> }
}

export default function DocsWebMCP() {
  useEffect(() => {
    const modelContext = (document as WebMCPDocument).modelContext
    if (!modelContext) return
    const base = new URL(import.meta.env.BASE_URL, window.location.origin)
    return registerDocsTools(modelContext, {
      baseUrl: base.href,
      // Derive from the live route: the exported <link rel="alternate"> does not track client-side navigation.
      getMarkdownUrl: () => markdownPathFor(window.location.pathname, base.pathname),
    })
  }, [])
  return null
}
