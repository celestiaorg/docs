// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// Pull in .env file
require("dotenv").config();

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");
const katex = require("rehype-katex");
const docs = require("./sidebars");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Celestia Docs",
  tagline: "Build Modular.",
  url: "https://docs.celestia.org",
  baseUrl: process.env.BASE_URL,
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "celestiaorg", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  deploymentBranch: "gh-pages",
  scripts: [
    {
      src: "https://plausible.celestia.org/js/plausible.js",
      defer: true,
      "data-domain": "docs.celestia.org",
    },
    {
      src: "https://www.chatbase.co/embed.min.js",
      id: "oeduJpy4UAtpDuOQcCuVM",
      defer: true,
    },
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/celestiaorg/docs/tree/main/",
          routeBasePath: "/",
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    ["drawio", {}],
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 500,
        min: 300,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/nodes/environment",
            from: "/developers/environment",
          },
          {
            to: "/nodes/celestia-app",
            from: "/developers/celestia-app",
          },
          {
            to: "/nodes/instantiate-testnet",
            from: "/developers/instantiate-testnet",
          },
          {
            to: "/nodes/celestia-app-commands",
            from: "/developers/celestia-app-commands",
          },
          {
            to: "/nodes/celestia-node",
            from: "/developers/celestia-node",
          },
          {
            to: "/nodes/celestia-node-metrics",
            from: "/developers/celestia-node-metrics",
          },
          {
            to: "/developers/node-api",
            from: "/category/node-api",
          },
          {
            to: "/learn/submit-data",
            from: "/concepts/submit-data",
          },
          {
            to: "/learn/data-availability-faq",
            from: "/concepts/data-availability-faq",
          },
          {
            to: "/learn/specifications/reserved-namespaces",
            from: "/concepts/specifications/reserved-namespaces",
          },
          {
            to: "/learn/how-celestia-works/data-availability-layer",
            from: "/concepts/how-celestia-works/data-availability-layer",
          },
          {
            to: "/learn/how-celestia-works/introduction",
            from: "/concepts/how-celestia-works/introduction",
          },
          {
            to: "/learn/how-celestia-works/monolithic-vs-modular",
            from: "/concepts/how-celestia-works/monolithic-vs-modular",
          },
          {
            to: "/learn/how-celestia-works/transaction-lifecycle",
            from: "/concepts/how-celestia-works/transaction-lifecycle",
          },
        ],
      },
    ],
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      colorMode: {
        defaultMode: "light",
        respectPrefersColorScheme: true,
      },
      image: "img/celestia-doc.png",
      metadata: [
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@celestiaorg" },
        { name: "twitter:title", content: "Celestia Docs" },
        {
          name: "twitter:description",
          content:
            "The developer documentation site for getting started building on the Celestia Network.",
        },
      ],
      algolia: {
        appId: "2KRXIFZ5YL",
        apiKey: "00d6c432aa0b7c20c92283ec9bec23c4",
        indexName: "celestia",
        contextualSearch: true,
        debug: false,
      },
      injectHtmlTags: {
        headTags: [],
        bodyTags: [
          {
            tagName: "script",
            innerHTML: `
              window.chatbaseConfig = {
                chatbotId: "oeduJpy4UAtpDuOQcCuVM",
              }
            `,
          },
        ],
      },
      navbar: {
        logo: {
          alt: "Celestia Docs",
          src: "img/celestia-docs.svg",
          srcDark: "img/celestia-docs-dark.svg",
        },
        items: [
          {
            type: "doc",
            docId: "learn/how-celestia-works/introduction",
            position: "left",
            label: "Learn",
          },
          {
            type: "doc",
            docId: "nodes/overview",
            position: "left",
            label: "Run a Node",
          },
          {
            type: "doc",
            docId: "developers/overview",
            position: "left",
            label: "Developers",
          },
          {
            type: "doc",
            docId: "community/overview",
            position: "left",
            label: "Community",
          },
          {
            href: "https://github.com/celestiaorg/docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Run a Node",
                to: "/nodes/overview",
              },
              {
                label: "Developers",
                to: "/developers/overview",
              },
              {
                label: "Community",
                to: "/community/overview",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/je7UVpDuDu",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/CelestiaOrg",
              },
              {
                label: "Forum",
                href: "https://forum.celestia.org/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/celestiaorg/docs",
              },
              {
                label: "Website",
                href: "https://celestia.org/",
              },
              {
                label: "Network upgrades channel",
                href: "https://t.me/+smSFIA7XXLU4MjJh/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Celestia Org Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity"],
      },
    }),
};

module.exports = config;
