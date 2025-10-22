import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  project: {
    link: 'https://github.com/celestiaorg/celestia',
  },
  chat: {
    link: 'https://discord.gg/celestiacommunity',
  },
  docsRepositoryBase: 'https://github.com/celestiaorg/docs',
  footer: {
    text: 'Celestia Documentation',
  },
  // Navigation configuration for tab-style navigation
  navigation: {
    prev: true,
    next: true,
  },
  // Sidebar configuration - this will change based on the current section
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  // Theme configuration
  primaryHue: 200,
  primarySaturation: 100,
  toc: {
    backToTop: true,
  },
  // Search configuration
  search: {
    placeholder: 'Search documentation...',
  },
  // Git configuration
  gitTimestamp: ({ timestamp }) => (
    <div>Last updated on {timestamp.toDateString()}</div>
  ),
  // Custom head
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Celestia Documentation" />
      <meta property="og:description" content="Learn, build, and operate on Celestia - the first modular blockchain network." />
    </>
  ),
}

export default config
