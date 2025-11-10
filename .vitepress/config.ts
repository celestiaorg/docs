import { HeadConfig } from "vitepress";

const telegramSVG = ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2628 9.3444 8.93014 10.3492 5.43189 11.8733C4.86383 12.0992 4.56626 12.3202 4.53917 12.5363C4.49339 12.9015 4.95071 13.0453 5.57347 13.2411C5.65818 13.2678 5.74595 13.2954 5.83594 13.3246C6.44864 13.5238 7.27283 13.7568 7.70129 13.766C8.08994 13.7744 8.52373 13.6142 9.00264 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.139 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.376 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5033 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78391 14.6448 10.8036 15.3168C11.2936 15.6397 11.6858 15.9067 12.077 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2077 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8307 18.0694 15.3826 18.0186C15.7032 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6631 17.3816 10.0585 17.5622 8.16097C17.578 7.99473 17.5581 7.78197 17.5422 7.68857C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0056 7.22234 16.9064 7.22408C16.455 7.23203 15.7626 7.47282 12.43 8.85893Z" fill="currentColor"/>
</svg>`;

const { BASE: base = "/" } = process.env;

// VitePress site configuration
export default {
  lang: "en-US",
  title: "Celestia Docs",
  description: "The first modular blockchain network.",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  base: base,
  markdown: {
    math: true,
  },
  sitemap: {
    hostname: "https://docs.celestia.org",
  },

  head: [
    [
      "link",
      { rel: "icon", href: "/favicons/favicon.svg", type: "image/svg+xml" },
    ],
    ["link", { rel: "icon", href: "/favicons/favicon.png", type: "image/png" }],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "/favicons/favicon.ico",
        type: "image/x-icon",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#fff" }],
    ["meta", { name: "theme-color", content: "#fff" }],
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],
    [
      "meta",
      {
        property: "description",
        content: "The first modular blockchain network.",
      },
    ],
    ["meta", { httpEquiv: "Content-Language", content: "en" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@CelestiaOrg" }],
    ["meta", { name: "twitter:site:domain", content: "docs.celestia.org" }],
    ["meta", { name: "twitter:url", content: "https://docs.celestia.org" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://docs.celestia.org/Documentation.png",
      },
    ],
    ["meta", { name: "twitter:image:alt", content: "Celestia Documentation" }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Celestia Docs" }],
    ["meta", { property: "og:url", content: "https://docs.celestia.org" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://docs.celestia.org/Documentation.png",
      },
    ],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { property: "og:image:type", content: "image/png" }],

    ["meta", { name: "apple-mobile-web-app-title", content: "Celestia" }],
    [
      "script",
      {},
      `
      window.chatbaseConfig = {
        chatbotId: "oeduJpy4UAtpDuOQcCuVM",
      }
      `,
    ],
    [
      "script",
      {
        src: "https://www.chatbase.co/embed.min.js",
        id: "oeduJpy4UAtpDuOQcCuVM",
        defer: true,
      },
    ],
    [
      "script",
      {
        src: "https://plausible.celestia.org/js/plausible.js",
        "data-domain": "docs.celestia.org",
        defer: "true",
      },
    ],
  ],

  themeConfig: {
    // VitePress default theme configuration
    nav: nav(),
    outline: {
      level: "deep",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },

    sidebar: {
      "/": sidebarHome(),
    },

    editLink: {
      pattern: "https://github.com/celestiaorg/docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    logo: {
      alt: "Celestia Logo",
      light: "/logo-light.svg",
      dark: "/logo-dark.svg",
    },

    siteTitle: false,

    socialLinks: [
      { icon: "github", link: "https://github.com/celestiaorg/docs" },
      { icon: "twitter", link: "https://twitter.com/Celestia" },
      { icon: "youtube", link: "https://www.youtube.com/@CelestiaNetwork" },
      { icon: "discord", link: "https://discord.gg/celestiacommunity" },
      { icon: { svg: telegramSVG }, link: "https://t.me/CelestiaCommunity" },
    ],

    transformHead(assets: string[]): HeadConfig[] {
      const youthRegularFont = assets.find(
        (file) => /youth\/Youth-Regular\.\w+\.woff2/,
      );
      const untitledSansRegularFont = assets.find(
        (file) => /Untitled-Sans-Regular\.\w+\.woff2/,
      );
      const untitledSansMediumFont = assets.find(
        (file) => /Untitled-Sans-Medium\.\w+\.woff2/,
      );

      const headConfig: HeadConfig[] = [];

      if (youthRegularFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: youthRegularFont,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
        ]);
      }

      if (untitledSansRegularFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: untitledSansRegularFont,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
        ]);
      }

      if (untitledSansMediumFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: untitledSansMediumFont,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
        ]);
      }

      return headConfig;
    },
  },
  transformPageData(pageData) {
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      [
        "meta",
        {
          property: "og:title",
          content:
            pageData.frontmatter.layout === "home"
              ? "Celestia Docs"
              : `${pageData.title} | Celestia Docs`,
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content:
            pageData.description || "The first modular blockchain network.",
        },
      ],
    );
  },
};

function nav() {
  return [
    {
      text: "Join the network",
      items: [
        { text: "Learn", link: "/learn/how-celestia-works/overview" },
        { text: "Quick start", link: "/how-to-guides/quick-start" },
        { text: "Rollup stacks", link: "/how-to-guides/rollup-stacks" },
        {
          text: "Resources",
          items: [
            {
              text: "Celestia Improvement Proposals (CIPs)",
              link: "https://cips.celestia.org/",
            },
            {
              text: "v6 parameters",
              link: "https://celestiaorg.github.io/celestia-app/parameters_v6.html",
            },
            {
              text: "celestia-app specs",
              link: "https://celestiaorg.github.io/celestia-app/",
            },
            {
              text: "celestia-node API docs",
              link: "https://node-rpc-docs.celestia.org/",
            },
          ],
        },
      ],
    },
  ];
}

function sidebarHome() {
  return [
    {
      text: "Learn",
      collapsed: true,
      items: [
        {
          text: "Overview of Celestia",
          collapsed: true,
          items: [
            {
              text: "Introduction",
              link: "/learn/how-celestia-works/overview",
            },
            {
              text: "Monolithic vs. modular blockchains",
              link: "/learn/how-celestia-works/monolithic-vs-modular",
            },
            {
              text: "Data availability layer",
              collapsed: true,
              items: [
                {
                  text: "Celestia's data availability layer",
                  link: "/learn/how-celestia-works/data-availability-layer",
                },
                {
                  text: "The lifecycle of a celestia-app transaction",
                  link: "/learn/how-celestia-works/transaction-lifecycle",
                },
                {
                  text: "Data retrievability and pruning",
                  link: "/learn/retrievability",
                },
                {
                  text: "Data availability FAQ",
                  link: "/learn/how-celestia-works/data-availability-faq",
                },
              ],
            },
            {
              text: "Extra resources",
              collapsed: true,
              items: [
                {
                  text: "Data, dashboards, & analytics",
                  link: "/learn/resources",
                },
                {
                  text: "Learn modular",
                  link: "https://celestia.org/learn/",
                },
                {
                  text: "celestia-app specifications",
                  link: "https://celestiaorg.github.io/celestia-app/",
                },
                {
                  text: "celestia-node API documentation",
                  link: "https://node-rpc-docs.celestia.org/",
                },
                {
                  text: "Celestia glossary",
                  link: "https://celestia.org/glossary/",
                },
                {
                  text: "Awesome Celestia resources",
                  link: "https://github.com/celestiaorg/awesome-celestia/",
                },
              ],
            },
          ],
        },
        {
          text: "TIA",
          collapsed: true,
          items: [
            {
              text: "Overview of TIA",
              link: "/learn/tia",
            },
            {
              text: "Paying for blobspace",
              link: "/learn/paying-for-blobspace",
            },
            {
              text: "Staking, governance, & supply",
              link: "/learn/staking-governance-supply",
            },
            {
              text: "How to stake TIA",
              link: "/learn/how-to-stake-tia",
            },
            {
              text: "Staking dashboards",
              link: "/learn/staking",
            },
          ],
        },
      ],
    },
    {
      text: "How-to guides",
      collapsed: true,
      items: [
        {
          text: "Run a node",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/how-to-guides/nodes-overview",
            },
            {
              text: "Getting started",
              collapsed: true,
              items: [
                {
                  text: "Quick start",
                  link: "/how-to-guides/quick-start",
                },
                {
                  text: "Deciding which node to run",
                  link: "/how-to-guides/decide-node",
                },
                {
                  text: "Setting up environment ",
                  link: "/how-to-guides/environment",
                },
                {
                  text: "Install celestia-node",
                  link: "/how-to-guides/celestia-node",
                },
                {
                  text: "Install celestia-app",
                  link: "/how-to-guides/celestia-app",
                },
                { text: "Docker images", link: "/how-to-guides/docker-images" },
              ],
            },
            {
              text: "Networks",
              collapsed: true,
              items: [
                {
                  text: "Networks overview",
                  link: "/how-to-guides/participate",
                },
                { text: "Mainnet Beta", link: "/how-to-guides/mainnet" },
                { text: "Mocha testnet", link: "/how-to-guides/mocha-testnet" },
                {
                  text: "Arabica devnet",
                  link: "/how-to-guides/arabica-devnet",
                },
                {
                  text: "Local devnet",
                  link: "/how-to-guides/local-devnet",
                },
              ],
            },
            {
              text: "Types of nodes",
              collapsed: true,
              items: [
                {
                  text: "Data availability",
                  collapsed: true,
                  items: [
                    { text: "Light node", link: "/how-to-guides/light-node" },
                    { text: "Bridge node", link: "/how-to-guides/bridge-node" },
                  ],
                },
                {
                  text: "Consensus",
                  collapsed: true,
                  items: [
                    {
                      text: "Consensus node",
                      link: "/how-to-guides/consensus-node",
                    },
                    {
                      text: "Validator node",
                      link: "/how-to-guides/validator-node",
                    },
                  ],
                },
                {
                  text: "IBC relayers",
                  collapsed: true,
                  items: [
                    {
                      text: "IBC relaying guide",
                      link: "/how-to-guides/ibc-relayer",
                    },
                    {
                      text: "IBC relayers",
                      link: "https://www.mintscan.io/celestia/relayers",
                    },
                  ],
                },
              ],
            },
            {
              text: "Resources",
              collapsed: true,
              items: [
                {
                  text: "Audits",
                  link: "/how-to-guides/audits",
                },
                {
                  text: "celestia-node",
                  collapsed: true,
                  items: [
                    {
                      text: "Metrics",
                      link: "/how-to-guides/celestia-node-metrics",
                    },
                    {
                      text: "config.toml guide",
                      link: "/how-to-guides/config-toml",
                    },
                    {
                      text: "Custom networks and values",
                      link: "/how-to-guides/celestia-node-custom-networks",
                    },
                    {
                      text: "Syncing a light node from a trusted hash",
                      link: "/how-to-guides/celestia-node-trusted-hash",
                    },
                    {
                      text: "Datastore structure",
                      link: "/how-to-guides/celestia-node-store-structure",
                    },
                    {
                      text: "Troubleshooting",
                      link: "/how-to-guides/celestia-node-troubleshooting",
                    },
                  ],
                },
                {
                  text: "celestia-app",
                  collapsed: true,
                  items: [
                    {
                      text: "Specifications",
                      link: "https://celestiaorg.github.io/celestia-app/",
                    },
                    {
                      text: "Metrics, visualization, and alerts",
                      link: "/how-to-guides/celestia-app-metrics",
                    },
                    {
                      text: "Jailing and slashing mechanics",
                      link: "/how-to-guides/celestia-app-slashing",
                    },
                    {
                      text: "Create a Celestia testnet",
                      link: "/how-to-guides/instantiate-testnet",
                    },
                    {
                      text: "Helpful CLI commands",
                      link: "/how-to-guides/celestia-app-commands",
                    },
                    {
                      text: "Upgrade Monitor",
                      link: "/how-to-guides/celestia-app-upgrade-monitor",
                    },
                    {
                      text: "Wallets in celestia-app",
                      link: "/how-to-guides/celestia-app-wallet",
                    },
                    {
                      text: "Multisig",
                      link: "/how-to-guides/celestia-app-multisig",
                    },
                    {
                      text: "Create a vesting account",
                      link: "/how-to-guides/celestia-app-vesting",
                    },
                  ],
                },
                { text: "SystemD", link: "/how-to-guides/systemd" },
                { text: "Snapshots", link: "/how-to-guides/snapshots" },
                {
                  text: "Network upgrade process",
                  link: "/how-to-guides/network-upgrade-process",
                },
              ],
            },
          ],
        },
        {
          text: "Rollup stacks",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/how-to-guides/rollup-stacks",
            },
            {
              text: "EVM",
              collapsed: true,
              items: [
                {
                  text: "Arbitrum",
                  collapsed: true,
                  items: [
                    {
                      text: "Arbitrum Orbit",
                      link: "/how-to-guides/arbitrum-integration",
                    },
                    {
                      text: "Quickstart: Run a local devnet",
                      link: "/how-to-guides/nitro-local",
                    },
                    {
                      text: "How to run a full Orbit rollup node and validator",
                      link: "/how-to-guides/arbitrum-full-node",
                    },
                    {
                      text: "How to customize your Orbit chain's deployment configuration",
                      link: "https://docs.arbitrum.io/launch-orbit-chain/how-tos/customize-deployment-configuration",
                    },
                    {
                      text: "Audit",
                      link: "https://github.com/celestiaorg/nitro/blob/celestia-v2.3.3/audits/celestia/arbitrum_nitro_celestia_audit_report.pdf",
                    },
                  ],
                },
                {
                  text: "Astria",
                  collapsed: true,
                  items: [
                    { text: "Documentation", link: "https://docs.astria.org" },
                  ],
                },
                {
                  text: "Optimism",
                  collapsed: true,
                  items: [
                    {
                      text: "Intro to OP Stack integration",
                      link: "/how-to-guides/intro-to-op-stack",
                    },
                    {
                      text: "Run an OP Stack devnet posting to Celestia",
                      link: "/how-to-guides/optimism",
                    },
                    {
                      text: "Audit",
                      link: "https://docs.celestia.org/audits/Celestia_OP_Stack_Audit.pdf",
                    },
                    {
                      text: "Hana Audit",
                      link: "https://docs.celestia.org/audits/Hana_Audit.pdf",
                    },
                    {
                      text: "Rollups as a Service",
                      collapsed: true,
                      items: [
                        {
                          text: "Caldera",
                          link: "https://caldera.xyz/",
                        },
                        {
                          text: "Conduit",
                          link: "https://conduit.xyz/",
                        },
                        {
                          text: "Gelato",
                          link: "https://gelato.cloud/",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Sovereign",
              collapsed: true,
              items: [
                { text: "Evolve", link: "https://ev.xyz" },
                {
                  text: "Sovereign SDK",
                  link: "https://github.com/Sovereign-Labs/sovereign-sdk/tree/stable/examples/demo-rollup#demo-rollup",
                },
              ],
            },
            {
              text: "Blobstream rollups",
              link: "/how-to-guides/blobstream-rollups",
            },
            {
              text: "Other",
              collapsed: true,
              items: [
                {
                  text: "Dymension",
                  link: "https://docs.dymension.xyz/",
                },
              ],
            },
          ],
        },
        {
          text: "Post data to Celestia",
          collapsed: true,
          items: [
            {
              text: "Submitting data blobs to Celestia",
              link: "/how-to-guides/submit-data",
            },
            {
              text: "Celestia transaction (tx) clients",
              collapsed: true,
              items: [
                {
                  text: "Overview",
                  link: "/how-to-guides/client/overview",
                },
                {
                  text: "Golang tx client guide",
                  link: "/how-to-guides/client/go",
                },
              ],
            },
            {
              text: "FeeGrant module for blobs submission",
              link: "/how-to-guides/feegrant-for-blobs",
            },
            {
              text: "MultiAccounts feature for blobs submission",
              link: "/how-to-guides/multiaccounts",
            },
            {
              text: "Transaction resubmission guidelines",
              link: "/how-to-guides/transaction-resubmission",
            },
          ],
        },
        {
          text: "Integrate with Blobstream",
          collapsed: true,
          items: [
            {
              text: "Overview of Blobstream",
              link: "/how-to-guides/blobstream",
            },
            {
              text: "Integrate with Blobstream contracts",
              link: "/how-to-guides/blobstream-contracts",
            },
            {
              text: "Integrate with Blobstream client",
              link: "/how-to-guides/blobstream-offchain",
            },
            {
              text: "Querying the Blobstream proofs",
              link: "/how-to-guides/blobstream-proof-queries",
            },
            {
              text: "SP1 Blobstream",
              collapsed: true,
              items: [
                {
                  text: "Local SP1 Blobstream operators",
                  collapsed: true,
                  items: [
                    {
                      text: "New SP1 Blobstream deployments",
                      link: "/how-to-guides/sp1-blobstream-deploy",
                    },
                  ],
                },
                {
                  text: "SP1 Blobstream audits",
                  collapsed: true,
                  items: [
                    {
                      text: "Ottersec",
                      link: "https://docs.celestia.org/audits/SP1_Blobstream_Ottersec_Audit.pdf",
                    },
                    {
                      text: "SP1 Audits",
                      link: "https://github.com/succinctlabs/sp1/tree/dev/audits",
                    },
                  ],
                },
              ],
            },
            {
              text: "Blobstream X",
              collapsed: true,
              items: [
                {
                  text: "Overview of BlobstreamX",
                  link: "/how-to-guides/blobstreamx",
                },
                {
                  text: "Local Blobstream X operators",
                  collapsed: true,
                  items: [
                    {
                      text: "Requesting data commitment ranges",
                      link: "/how-to-guides/blobstream-x-requesting-data-commitment-ranges",
                    },
                    {
                      text: "New Blobstream X deployments",
                      link: "/how-to-guides/blobstream-x-deploy",
                    },
                  ],
                },
                {
                  text: "Blobstream X audits",
                  collapsed: true,
                  items: [
                    {
                      text: "Informal Systems",
                      link: "https://docs.celestia.org/audits/Blobstream_X-Informal_Systems_Audit.pdf",
                    },
                    {
                      text: "OtterSec",
                      link: "https://docs.celestia.org/audits/Blobstream_X-OtterSec_Audit.pdf",
                    },
                    {
                      text: "Veridise",
                      link: "https://docs.celestia.org/audits/Blobstream_X-Veridise_Audit.pdf",
                    },
                    {
                      text: "Zellic",
                      link: "https://docs.celestia.org/audits/Blobstream_X-Zellic_Audit.pdf",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: "Tutorials",
      collapsed: true,
      items: [
        {
          text: "Node API Tutorials",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/tutorials/node-api",
            },
            {
              text: "CLI tutorial",
              link: "/tutorials/node-tutorial",
            },
            {
              text: "Golang client tutorial",
              link: "/tutorials/golang-client-tutorial",
            },
            {
              text: "Rust client tutorial",
              link: "/tutorials/rust-client-tutorial",
            },
            {
              text: "RPC documentation & playground",
              link: "https://node-rpc-docs.celestia.org/",
            },
          ],
        },
        {
          text: "Wallets",
          collapsed: true,
          items: [
            {
              text: "Celestia-node",
              link: "/tutorials/celestia-node-key",
            },
            {
              text: "Integrating Wallets for developers",
              link: "/tutorials/wallets",
            },
          ],
        },
        {
          text: "Integrate Celestia for service providers",
          link: "/tutorials/integrate-celestia",
        },
      ],
    },
    {
      text: "References",
      collapsed: true,
      items: [
        {
          text: "celestia-node api documentation",
          link: "https://node-rpc-docs.celestia.org/",
        },
        {
          text: "celestia-app specifications",
          link: "https://celestiaorg.github.io/celestia-app/",
        },
      ],
    },
    {
      text: "Community",
      collapsed: true,
      items: [
        { text: "Discord", link: "https://discord.gg/celestiacommunity" },
        { text: "Code of Conduct", link: "/community/coc" },
        {
          text: "Celestia Foundation Delegation Program",
          link: "/community/foundation-delegation-program",
        },
        {
          text: "Celestia Foundation Ecosystem Delegation Program",
          link: "/community/foundation-ecosystem-delegation-program",
        },
        {
          text: "Modular Meetups",
          collapsed: true,
          items: [
            { text: "Overview", link: "/community/modular-meetup-intro" },
            { text: "Guide", link: "/community/modular-meetup-guide" },
            { text: "Toolkit", link: "/community/modular-meetup-toolkit" },
            { text: "Speaker list", link: "/community/speaker-list" },
          ],
        },
      ],
    },
  ];
}
