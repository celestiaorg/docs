import nextra from 'nextra'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkReplaceVariables from './plugins/remark-replace-variables.mjs'


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
  output: 'export',
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
  }
})
