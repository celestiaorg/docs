import type { ReactNode } from 'react'

const siteOrigin = 'https://docs.celestia.org'
const siteDescription =
  'Learn, build, and operate on Celestia - the modular data availability network.'
const basePath = import.meta.env.BASE_URL ?? '/'
const basePathWithTrailingSlash = basePath.endsWith('/') ? basePath : `${basePath}/`
const withBasePath = (pathname: string) =>
  `${basePathWithTrailingSlash}${pathname.replace(/^\//, '')}`

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Celestia',
    description: siteDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'security disclosures',
      email: 'security@celestia.org',
      url: 'https://github.com/celestiaorg/.github/blob/main/SECURITY.md',
    },
    url: 'https://celestia.org',
    logo: `${siteOrigin}/logo-light.svg`,
    sameAs: [
      'https://github.com/celestiaorg',
      'https://x.com/CelestiaOrg',
      'https://discord.com/invite/YsnTPcSfWQ',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Celestia Documentation',
    url: siteOrigin,
    description: siteDescription,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Celestia Node API',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: ['Linux', 'macOS'],
    url: `${siteOrigin}/build/rpc/node-api/`,
    softwareHelp: `${siteOrigin}/operate/maintenance/troubleshooting/`,
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'Celestia',
      url: 'https://celestia.org',
    },
  },
]

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <meta name="is-agentic-site-type" content="content" />
      <link rel="ard" type="application/json" href={withBasePath('/.well-known/ard.json')} />
      <link rel="ai-catalog" type="application/json" href={withBasePath('/.well-known/ai-catalog.json')} />
      <link rel="service-desc" type="application/json" href={withBasePath('/openapi.json')} />
      <link rel="alternate" type="text/plain" href={withBasePath('/llms.txt')} />
      <link rel="alternate" type="text/plain" href={withBasePath('/llms-full.txt')} />
      <link
        rel="api-catalog"
        type="application/linkset+json"
        href={withBasePath('/.well-known/api-catalog')}
      />
      <link
        rel="describedby"
        type="application/json"
        href={withBasePath('/.well-known/agent-skills/index.json')}
      />
      {jsonLd.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {children}
    </>
  )
}
