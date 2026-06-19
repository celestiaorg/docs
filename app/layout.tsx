import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import Image from "next/image";
import "nextra-theme-docs/style.css";
import "katex/dist/katex.min.css";
import { FontStyles } from "@/components/FontStyles";

const SITE_ORIGIN = "https://docs.celestia.org";
const SITE_DESCRIPTION =
  "Learn, build, and operate on Celestia - the modular data availability network.";

// Use BASE env var (same as next.config.mjs) and ensure it's available client-side
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.BASE?.replace(/\/$/, "") ||
  "";
const withBasePath = (path: string) => `${basePath}${path}`;

// Theme configuration
const THEME_CONFIG = {
  projectLink: "https://github.com/celestiaorg/docs",
  chatLink: "https://discord.com/invite/YsnTPcSfWQ",
  docsRepositoryBase: "https://github.com/celestiaorg/docs/blob/main",
  footerText: "Celestia Documentation",
  primaryHue: 200,
  primarySaturation: 100,
};
export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Celestia Documentation",
    template: "%s - Celestia Documentation",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Celestia Documentation",
    title: "Celestia Documentation",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/Celestia-og.png",
        width: 1200,
        height: 630,
        alt: "Celestia Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CelestiaOrg",
    title: "Celestia Documentation",
    description: SITE_DESCRIPTION,
    images: ["/Celestia-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Celestia",
  url: "https://celestia.org",
  logo: `${SITE_ORIGIN}/logo-light.svg`,
  sameAs: [
    "https://github.com/celestiaorg",
    "https://x.com/CelestiaOrg",
    "https://discord.com/invite/YsnTPcSfWQ",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Celestia Documentation",
  url: SITE_ORIGIN,
  description: SITE_DESCRIPTION,
};

const documentationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Celestia Documentation",
  description: SITE_DESCRIPTION,
  url: SITE_ORIGIN,
  publisher: {
    "@type": "Organization",
    name: "Celestia",
    url: "https://celestia.org",
  },
  about: [
    "Celestia",
    "data availability",
    "modular blockchain",
    "blobspace",
    "node operation",
  ],
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Celestia Node API",
  applicationCategory: "DeveloperApplication",
  operatingSystem: ["Linux", "macOS"],
  url: `${SITE_ORIGIN}/build/rpc/node-api/`,
  softwareHelp: `${SITE_ORIGIN}/operate/maintenance/troubleshooting/`,
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    name: "Celestia",
    url: "https://celestia.org",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I troubleshoot Celestia node issues?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the Celestia troubleshooting documentation for common node, sync, network, and operational issues.",
        url: `${SITE_ORIGIN}/operate/maintenance/troubleshooting/`,
      },
    },
    {
      "@type": "Question",
      name: "Where can I find the Celestia Node API reference?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the Celestia Node API reference for RPC methods and the OpenRPC specification for machine-readable API details.",
        url: `${SITE_ORIGIN}/build/rpc/node-api/`,
      },
    },
    {
      "@type": "Question",
      name: "Where can I learn how to run a Celestia light node?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with the light node quickstart guide, then use the troubleshooting page if setup, sync, or connectivity issues appear.",
        url: `${SITE_ORIGIN}/operate/data-availability/light-node/quickstart/`,
      },
    },
  ],
};

const jsonLd = [
  organizationJsonLd,
  websiteJsonLd,
  documentationJsonLd,
  softwareApplicationJsonLd,
  faqJsonLd,
];

const banner = (
  <Banner storageKey="some-key">Welcome to our new docs! 🎉</Banner>
);
const navbar = (
  <Navbar
    logoLink="/"
    logo={
      <Image
        src={withBasePath("/logo-light.svg")}
        alt="Celestia"
        width={140}
        height={32}
        priority
        style={{ height: "auto" }}
      />
    }
    projectLink={THEME_CONFIG.projectLink}
    chatLink={THEME_CONFIG.chatLink}
  />
);
const footer = <Footer>{THEME_CONFIG.footerText}</Footer>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <FontStyles />
        <link rel="icon" href={withBasePath("/favicons/favicon.ico")} />
        <link
          rel="apple-touch-icon"
          href={withBasePath("/favicons/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={withBasePath("/favicons/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={withBasePath("/favicons/favicon-16x16.png")}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="alternate" type="text/plain" href={withBasePath("/llms.txt")} />
        <link
          rel="alternate"
          type="text/plain"
          href={withBasePath("/llms-full.txt")}
        />
        <link
          rel="service-desc"
          type="application/linkset+json"
          href={withBasePath("/.well-known/api-catalog")}
        />
        <link
          rel="describedby"
          type="application/json"
          href={withBasePath("/.well-known/agent-skills/index.json")}
        />
        {jsonLd.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase={THEME_CONFIG.docsRepositoryBase}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
