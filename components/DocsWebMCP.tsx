'use client'

import { useEffect } from 'react'
import { registerDocsTools } from '@/src/lib/webmcp.js'

type WebMCPDocument = Document & {
  modelContext?: { registerTool: (tool: unknown, options: { signal: AbortSignal }) => Promise<void> }
}

export default function DocsWebMCP() {
  useEffect(() => {
    const modelContext = (document as WebMCPDocument).modelContext
    if (!modelContext) return
    return registerDocsTools(modelContext, {
      baseUrl: new URL(import.meta.env.BASE_URL, window.location.origin).href,
      // Resolve on the visited origin, even when a preview's <base> points at its alias.
      getMarkdownUrl: () => document.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href'),
    })
  }, [])
  return null
}
