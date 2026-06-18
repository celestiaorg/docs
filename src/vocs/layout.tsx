import type { ReactNode } from 'react'

const siteOrigin = 'https://docs.celestia.org'
const siteDescription =
  'Learn, build, and operate on Celestia - the modular data availability network.'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Celestia',
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
    '@type': 'TechArticle',
    headline: 'Celestia Documentation',
    description: siteDescription,
    url: siteOrigin,
    publisher: {
      '@type': 'Organization',
      name: 'Celestia',
      url: 'https://celestia.org',
    },
    about: [
      'Celestia',
      'data availability',
      'modular blockchain',
      'blobspace',
      'node operation',
    ],
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="alternate" type="text/plain" href="/llms.txt" />
      <link rel="alternate" type="text/plain" href="/llms-full.txt" />
      <link rel="service-desc" type="application/linkset+json" href="/.well-known/api-catalog" />
      <link rel="describedby" type="application/json" href="/.well-known/agent-skills/index.json" />
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
