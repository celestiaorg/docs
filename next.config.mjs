import nextra from 'nextra'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkReplaceVariables from './plugins/remark-replace-variables.mjs'

const stripMdxRouteMetadataLoader = new URL(
  './loaders/strip-mdx-route-metadata.cjs',
  import.meta.url,
).pathname

function addMdxRouteMetadataLoader(rule) {
  if (!rule || typeof rule !== 'object') return

  if (Array.isArray(rule.oneOf)) {
    for (const childRule of rule.oneOf) {
      addMdxRouteMetadataLoader(childRule)
    }
  }

  if (!Array.isArray(rule.use)) return

  const nextraLoaderIndex = rule.use.findIndex((loader) => {
    const loaderPath = typeof loader === 'string' ? loader : loader?.loader
    return loaderPath?.includes('nextra/loader')
  })

  if (nextraLoaderIndex === -1) return

  rule.use.splice(nextraLoaderIndex, 0, stripMdxRouteMetadataLoader)
}

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
    for (const rule of config.module.rules) {
      addMdxRouteMetadataLoader(rule)
    }

    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**']
    }
    return config
  }
})
