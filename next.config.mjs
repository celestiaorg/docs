import nextra from 'nextra'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkReplaceVariables from './plugins/remark-replace-variables.mjs'
import fs from 'node:fs'
import path from 'node:path'


// Set up Nextra with its configuration
const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [remarkReplaceVariables, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
})

// Follow VitePress pattern: use BASE environment variable with trailing slash
const { BASE: base = "" } = process.env;
const basePath = base ? base.replace(/\/$/, '') : undefined; // Remove trailing slash for Next.js

// Export the final Next.js config with Nextra included
export default withNextra({
  // Add regular Next.js options here
  basePath: basePath,
  assetPrefix: base || undefined, // Keep trailing slash for assets
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // mdxRs is disabled because it doesn't support custom remark plugins
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**']
    }
    return config
  },
  async redirects() {
    if (process.env.STATIC_EXPORT === 'true') {
      return []
    }
    
    try {
      const redirectsPath = path.join(process.cwd(), 'redirects.json')
      const redirectsData = fs.readFileSync(redirectsPath, 'utf8')
      return JSON.parse(redirectsData)
    } catch (error) {
      console.error('Error reading redirects.json:', error)
      return []
    }
  }
})
