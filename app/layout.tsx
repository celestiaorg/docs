import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
import 'nextra-theme-docs/style.css'
import './fonts.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const withBasePath = (path: string) => `${basePath}${path}`
 
export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}
 
const banner = <Banner storageKey="some-key">Welcome to our new docs! 🎉</Banner>
const navbar = (
  <Navbar
    logoLink="/"
    logo={
      <Image
        src="/logo-light.svg"
        alt="Celestia"
        width={140}
        height={32}
        priority
        style={{ height: 'auto' }}
      />
    }
    projectLink="https://github.com/celestiaorg/celestia"
  />
)
const footer = <Footer>© {new Date().getFullYear()} Celestia Labs. All rights reserved.</Footer>
 
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head>
        <link rel="icon" href={withBasePath('/favicons/favicon.ico')} />
        <link rel="apple-touch-icon" href={withBasePath('/favicons/apple-touch-icon.png')} />
        <link rel="icon" type="image/png" sizes="32x32" href={withBasePath('/favicons/favicon-32x32.png')} />
        <link rel="icon" type="image/png" sizes="16x16" href={withBasePath('/favicons/favicon-16x16.png')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Celestia Documentation" />
        <meta property="og:description" content="Learn, build, and operate on Celestia - the first modular blockchain network." />
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
