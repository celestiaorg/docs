import nextra from 'nextra'

// Set up Nextra with its configuration
const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
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
    mdxRs: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**']
    }
    return config
  }
})
