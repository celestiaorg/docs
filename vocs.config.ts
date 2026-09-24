import { sidebarFor } from './scripts/vocs-sidebar.mjs'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { defineConfig } from 'vocs/config'
import remarkBaseImages from './plugins/remark-base-images.mjs'
import remarkReplaceVariables from './plugins/remark-replace-variables.mjs'

const siteOrigin = 'https://docs.celestia.org'
const siteDescription =
  'Learn, build, and operate on Celestia - the modular data availability network.'

const rawBasePath = process.env.BASE?.trim()
const basePath = rawBasePath ? rawBasePath.replace(/\/$/, '') || '/' : '/'
const withBasePath = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return basePath === '/' ? normalizedPath : `${basePath}${normalizedPath}`
}

export default defineConfig({
  title: 'Celestia Documentation',
  description: siteDescription,
  titleTemplate: '%s - Celestia Documentation',
  basePath,
  baseUrl: siteOrigin,
  outDir: 'out',
  renderStrategy: 'full-static',
  checkDeadlinks: 'warn',
  mcp: {
    enabled: process.env.DOCS_MCP_ENABLED === '1',
  },
  markdown: {
    remarkPlugins: [remarkReplaceVariables, remarkMath, [remarkBaseImages, { basePath }]],
    rehypePlugins: [rehypeKatex],
  },
  logoUrl: {
    light: withBasePath('/logo-light.svg'),
    dark: withBasePath('/logo-dark.svg'),
  },
  iconUrl: withBasePath('/favicons/favicon.svg'),
  ogImageUrl: withBasePath('/Celestia-og.png'),
  accentColor: 'light-dark(#6d3df5, #9d7cff)',
  editLink: {
    link: (filePath) => {
      let sourcePath = filePath.replace(/^src\/pages\//, 'app/')

      if (sourcePath === 'app/index.mdx') {
        sourcePath = 'app/page.mdx'
      } else {
        sourcePath = sourcePath.replace(/\/index\.mdx$/, '/page.mdx')
      }

      return `https://github.com/celestiaorg/docs/edit/main/${sourcePath}`
    },
    text: 'Edit this page',
  },
  socials: [
    { icon: 'github', link: 'https://github.com/celestiaorg/docs' },
    { icon: 'discord', link: 'https://discord.com/invite/YsnTPcSfWQ' },
    { icon: 'x', link: 'https://x.com/CelestiaOrg' },
  ],
  topNav: [
    { text: 'Learn', link: '/learn/celestia-101/data-availability', match: '/learn' },
    { text: 'Build', link: '/build/post-retrieve-blob/overview', match: '/build' },
    { text: 'Operate', link: '/operate/getting-started/overview', match: '/operate' },
    { text: 'Status', link: 'https://status.celestia.org', external: true },
  ],
  sidebar: {
    '/': [
      { text: 'Learn', link: '/learn/celestia-101/data-availability' },
      { text: 'Build', link: '/build/post-retrieve-blob/overview' },
      { text: 'Operate', link: '/operate/getting-started/overview' },
    ],
    '/learn': await sidebarFor('app/learn', '/learn'),
    '/build': await sidebarFor('app/build', '/build'),
    '/operate': await sidebarFor('app/operate', '/operate'),
  },
})
