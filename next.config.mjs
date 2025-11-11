import nextra from 'nextra'

// Set up Nextra with its configuration
const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const basePath = process.env.BASE_PATH ?? ''
const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? basePath
 
// Export the final Next.js config with Nextra included
export default withNextra({
  // Add regular Next.js options here
  basePath: basePath || undefined,
  assetPrefix: assetPrefix || undefined,
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    mdxRs: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node-rpc-docs/**', '**/node_modules/**']
    }
    return config
  }
})
