import type { AnchorHTMLAttributes, ReactNode } from 'react'

type NextHref =
  | string
  | {
      pathname?: string
      query?: Record<string, string | number | boolean | undefined>
      hash?: string
    }

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children?: ReactNode
  href: NextHref
  locale?: string | false
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
}

function hrefToString(href: NextHref) {
  if (typeof href === 'string') return href

  const pathname = href.pathname ?? ''
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(href.query ?? {})) {
    if (value !== undefined) searchParams.set(key, String(value))
  }

  const search = searchParams.toString()
  const hash = href.hash ? `#${href.hash.replace(/^#/, '')}` : ''

  return `${pathname}${search ? `?${search}` : ''}${hash}`
}

export default function Link({
  href,
  locale: _locale,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  ...props
}: LinkProps) {
  return <a href={hrefToString(href)} {...props} />
}
