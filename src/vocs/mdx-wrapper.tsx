'use client'

import type { ReactNode } from 'react'
import { Layout, MdxPageContext, useConfig } from 'vocs'
import { useRouter } from 'waku'

export default function MdxLayout({ children }: { children: ReactNode }) {
  const { frontmatter } = MdxPageContext.use()
  const { baseUrl, basePath, description } = useConfig()
  const { path } = useRouter()
  const prefix = basePath && basePath !== '/' ? basePath : ''
  const url = `${baseUrl}${prefix}${path.replace(/\/$/, '')}/`
  const title = frontmatter?.title
  const schemas = path === '/' ? [] : [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description: frontmatter?.description ?? description,
      url,
      publisher: { '@type': 'Organization', name: 'Celestia', url: 'https://celestia.org' },
      isPartOf: { '@type': 'WebSite', url: `${baseUrl}${prefix}/`, name: 'Celestia documentation' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Celestia documentation', item: `${baseUrl}${prefix}/` },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    },
  ]

  return (
    <>
      {schemas.map((data) => (
        <script
          key={data['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll('<', '\\u003c') }}
        />
      ))}
      <Layout>{children}</Layout>
    </>
  )
}
