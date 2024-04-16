import { HeadConfig } from "vitepress";

const telegramSVG = ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2628 9.3444 8.93014 10.3492 5.43189 11.8733C4.86383 12.0992 4.56626 12.3202 4.53917 12.5363C4.49339 12.9015 4.95071 13.0453 5.57347 13.2411C5.65818 13.2678 5.74595 13.2954 5.83594 13.3246C6.44864 13.5238 7.27283 13.7568 7.70129 13.766C8.08994 13.7744 8.52373 13.6142 9.00264 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.139 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.376 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5033 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78391 14.6448 10.8036 15.3168C11.2936 15.6397 11.6858 15.9067 12.077 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2077 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8307 18.0694 15.3826 18.0186C15.7032 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6631 17.3816 10.0585 17.5622 8.16097C17.578 7.99473 17.5581 7.78197 17.5422 7.68857C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0056 7.22234 16.9064 7.22408C16.455 7.23203 15.7626 7.47282 12.43 8.85893Z" fill="currentColor"/>
</svg>`;

const { BASE: base = "/" } = process.env;

// https://vitepress.dev/concepts/site-config
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
      {
        rel: "icon",
        href: "/favicons/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     type: "image/svg+xml",
    //     href: "/favicons/favicon-dark.svg",
    //     media: "(prefers-color-scheme: dark)",
    //   },
    // ],
    [
      "link",
      {
        rel: "icon",
        href: "/favicons/favicon.png",
        type: "image/png",
      },
    ],
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     type: "image/png",
    //     href: "/favicons/favicon-dark.png",
    //     media: "(prefers-color-scheme: dark)",
    //   },
    // ],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "/favicons/favicon.ico",
        type: "image/x-icon",
      },
    ],
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     type: "image/x-icon",
    //     href: "/favicons/favicon-dark.ico",
    //     media: "(prefers-color-scheme: dark)",
    //   },
    // ],
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
    // ['meta', { property: 'og:title', content: 'Celestia' }],
    // ['meta', { property: 'og:description', content: 'The first modular blockchain network.' }],
    [
      "meta",
      {
        property: "description",
        content: "The first modular blockchain network.",
      },
    ],
    ["meta", { httpEquiv: "Content-Language", content: "en" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: "/Celestia-og.png" }],
    [
      "meta",
      {
        name: "twitter:site:domain",
        content: "docs.celestia.org",
      },
    ],
    [
      "meta",
      {
        name: "twitter:url",
        content: "https://docs.celestia.org",
      },
    ],
    ["meta", { name: "og:image", content: "/Celestia-og.png" }],
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
    // https://vitepress.dev/concepts/default-theme-config
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
      { icon: "twitter", link: "https://twitter.com/CelestiaOrg" },
      { icon: "youtube", link: "https://www.youtube.com/@CelestiaNetwork" },
      { icon: "discord", link: "https://discord.com/invite/YsnTPcSfWQ" },
      { icon: { svg: telegramSVG }, link: "https://t.me/CelestiaCommunity" },
    ],

    transformHead(assets: string[]): HeadConfig[] {
      const ruberoidLightFont = assets.find(
        (file) => /Ruberoid-Light\.\w+\.otf/,
      );
      const ruberoidRegularFont = assets.find(
        (file) => /Ruberoid-Regular\.\w+\.otf/,
      );
      const ruberoidBoldFont = assets.find((file) => /Ruberoid-Bold\.\w+\.otf/);

      const headConfig: HeadConfig[] = [];

      if (ruberoidLightFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: ruberoidLightFont,
            as: "font",
            type: "font/opentype",
            crossorigin: "",
          },
        ]);
      }

      if (ruberoidRegularFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: ruberoidRegularFont,
            as: "font",
            type: "font/opentype",
            crossorigin: "",
          },
        ]);
      }

      if (ruberoidBoldFont) {
        headConfig.push([
          "link",
          {
            rel: "preload",
            href: ruberoidBoldFont,
            as: "font",
            type: "font/opentype",
            crossorigin: "",
          },
        ]);
      }
      return headConfig;
    },
  },
  transformPageData(pageData) {
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push([
      "meta",
      {
        name: "og:title",
        content:
          pageData.frontmatter.layout === "home"
            ? `Celestia Docs`
            : `${pageData.title} | Celestia Docs`,
      },
      {
        name: "og:description",
        content: pageData.frontmatter.layout === `${pageData.description}`,
      },
    ]);
  },
};

function nav() {
  return [
    {
      text: "Join the network",
      items: [
        { text: "Learn", link: "/learn/how-celestia-works/overview" },
        { text: "Networks", link: "/nodes/participate" },
        { text: "Nodes", link: "/nodes/overview" },
        { text: "Developers", link: "/developers/build-modular" },
        { text: "Community", link: "/community/overview" },
        {
          text: "Quick start",
          items: [
            { text: "Blob tutorial", link: "/developers/node-tutorial" },
            {
              text: "celestia-app specs",
              link: "https://celestiaorg.github.io/celestia-app/",
            },
            {
              text: "celestia-node API",
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
      text: "Run a node",
      collapsed: true,
      items: [
        { text: "Overview", link: "/nodes/overview" },
        {
          text: "Quick start",
          link: "/nodes/quick-start",
          collapsed: true,
          items: [
            { text: "Deciding which node to run", link: "/nodes/decide-node" },
            { text: "Setting up environment ", link: "/nodes/environment" },
            { text: "Install celestia-node", link: "/nodes/celestia-node" },
            { text: "Install celestia-app", link: "/nodes/celestia-app" },
            { text: "Docker images", link: "/nodes/docker-images" },
          ],
        },
        {
          text: "Networks",
          collapsed: true,
          items: [
            { text: "Networks overview", link: "/nodes/participate"},
            { text: "Mainnet Beta", link: "/nodes/mainnet" },
            { text: "Mocha testnet", link: "/nodes/mocha-testnet" },
            { text: "Arabica devnet", link: "/nodes/arabica-devnet" },
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
                { text: "Light node", link: "/nodes/light-node" },
                { text: "Full node", link: "/nodes/full-storage-node" },
                { text: "Bridge node", link: "/nodes/bridge-node" },
              ],
            },
            { 
              text: "Consensus",
              collapsed: true,
              items: [
                { text: "Full consensus node", link: "/nodes/full-consensus-node" },
                { text: "Validator node", link: "/nodes/validator-node" },
              ],
            },
            {
              text: "IBC relayers",
              collapsed: true,
              items: [
                {
                  text: "IBC relaying guide",
                  link: "/nodes/ibc-relayer",
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
              text: "celestia-node",
              collapsed: true,
              items: [
                { text: "Metrics", link: "/nodes/celestia-node-metrics" },
                { text: "config.toml guide", link: "/nodes/config-toml" },
                {
                  text: "Custom networks and values",
                  link: "/nodes/celestia-node-custom-networks",
                },
                {
                  text: "Troubleshooting",
                  link: "/nodes/celestia-node-troubleshooting",
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
                  link: "/nodes/celestia-app-metrics",
                },
                {
                  text: "Slashing mechanics",
                  link: "/nodes/celestia-app-slashing",
                },
                {
                  text: "Create a Celestia testnet",
                  link: "/nodes/instantiate-testnet",
                },
                {
                  text: "Helpful CLI commands",
                  link: "/nodes/celestia-app-commands",
                },
                {
                  text: "Upgrade Monitor",
                  link: "/nodes/celestia-app-upgrade-monitor",
                },
                {
                  text: "Wallets in celestia-app",
                  link: "/nodes/celestia-app-wallet",
                },
                {
                  text: "Multisig",
                  link: "/nodes/celestia-app-multisig",
                },
                {
                  text: "Create a vesting account",
                  link: "/nodes/celestia-app-vesting",
                },
              ],
            },
            { text: "SystemD", link: "/nodes/systemd" },
            { text: "Hardfork process", link: "/nodes/hardfork-process" },
          ],
        },
      ],
    },
    {
      text: "Developers",
      collapsed: true,
      items: [
        { text: "Build modular", link: "/developers/build-modular" },
        {
          text: "Submitting data blobs to Celestia",
          link: "/developers/submit-data",
        },
        {
          text: "Transaction resubmission guidelines",
          link: "/developers/transaction-resubmission",
        },
        {
          text: "Node API",
          link: "/developers/node-api",
          collapsed: true,
          items: [
            {
              text: "Node RPC CLI tutorial",
              link: "/developers/node-tutorial",
            },
            {
              text: "Celestia-node RPC API documentation",
              link: "https://node-rpc-docs.celestia.org/",
            },
            { text: "Prompt Scavenger", link: "/developers/prompt-scavenger" },
          ],
        },
        {
          text: "Integrate with Blobstream",
          collapsed: true,
          items: [
            {
              text: "Overview of Blobstream",
              link: "/developers/blobstream",
            },
            {
              text: "Integrate with Blobstream contracts",
              link: "/developers/blobstream-contracts",
            },
            {
              text: "Integrate with Blobstream client",
              link: "/developers/blobstream-offchain",
            },
            {
              text: "Querying the Blobstream proofs",
              link: "/developers/blobstream-proof-queries",
            },
            {
              text: "Local Blobstream X operators",
              collapsed: true,
              items: [
                {
                  text: "Requesting data commitment ranges",
                  link: "/developers/requesting-data-commitment-ranges",
                },
                {
                  text: "New Blobstream X deployments",
                  link: "/developers/blobstream-x-deploy",
                },
              ],
            },
          ],
        },
        {
          text: "Deploy a rollup",
          link: "/developers/rollup-overview",
          collapsed: true,
          items: [
            {
              text: "Ethereum L2s",
              collapsed: true,
              items: [
                {
                  text: "Ethereum fallback mechanism",
                  link: "/developers/ethereum-fallback",
                },
                {
                  text: "Arbitrum",
                  collapsed: true,
                  items: [
                    {
                      text: "Introduction to Arbitrum rollups with Celestia as DA",
                      link: "/developers/arbitrum-integration",
                    },
                    {
                      text: "Deploy an Arbitrum rollup devnet",
                      link: "/developers/arbitrum-deploy",
                    },
                    // {
                    //   text: "Deploy an Arbitrum rollup to Mocha testnet",
                    //   link: "/developers/arbitrum-mocha",
                    // },
                    {
                      text: "Nitrogen testnet",
                      link: "/developers/nitrogen",
                    },
                    {
                      text: "Deploy a smart contract on Arbitrum rollup",
                      link: "/developers/arbitrum-smart-contract",
                    },
                    {
                      text: "Deploy a dapp on your Arbitrum rollup devnet",
                      link: "/developers/arbitrum-dapp-deploy",
                    },
                  ],
                },
                {
                  text: "Optimism",
                  collapsed: true,
                  items: [
                    {
                      text: "Intro to OP Stack integration",
                      link: "/developers/intro-to-op-stack",
                    },
                    {
                      text: "Bubs testnet",
                      link: "/developers/bubs-testnet",
                    },
                    {
                      text: "Deploy a smart contract on Bubs testnet",
                      link: "/developers/deploy-on-bubs",
                    },
                    {
                      text: "Deploy a dapp on Bubs testnet",
                      link: "/developers/gm-portal-bubs",
                    },
                    {
                      text: "Deploy an OP Stack devnet",
                      link: "/developers/optimism-devnet",
                    },
                    {
                      text: "Deploy an OP Stack devnet on Celestia",
                      link: "/developers/optimism",
                    },
                    {
                      text: "Audit",
                      link: "https://docs.celestia.org/Celestia_OP_Stack_Audit.pdf",
                    },
                    {
                      text: "Deploy a dapp with thirdweb",
                      link: "https://thirdweb.com/bubs-testnet",
                    },
                    {
                      text: "Rollups-as-a-Service",
                      collapsed: true,
                      items: [
                        {
                          text: "Caldera",
                          link: "https://caldera.xyz/",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { text: "Rollkit", link: "/developers/rollkit" },
            {
              text: "Astria",
              collapsed: true,
              items: [
                { text: "Documentation", link: "https://docs.astria.org" },
                {
                  text: "Deploy to Dusknet",
                  link: "https://docs.astria.org/docs/dusknet/overview/",
                },
              ],
            },
            {
              text: "Sovereign SDK",
              link: "https://github.com/Sovereign-Labs/sovereign-sdk/tree/stable/examples/demo-rollup#demo-rollup",
            },
            {
              text: "Vistara",
              link: "https://docs.vistara.dev/",
            },
            {
              text: "Dymension",
              link: "https://dymension.xyz/",
            },
          ],
        },
        {
          text: "Wallets",
          collapsed: true,
          items: [
            { text: "Celestia-node", link: "/developers/celestia-node-key" },
            {
              text: "Integrating Wallets for developers",
              link: "/developers/wallets",
            },
          ],
        },
        {
          text: "Integrate Celestia for service providers",
          link: "/developers/integrate-celestia",
        },
      ],
    },
    {
      text: "Community",
      collapsed: true,
      items: [
        { text: "Overview", link: "/community/overview" },
        { text: "Code of Conduct", link: "/community/coc" },
        { text: "Community calendar", link: "/community/calendar" },
	{ text: "Celestia Foundation Delegation Program", 
	  link: "/community/foundation-delegation-program"
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
        {
          text: "Incentivized testnet supplemental terms",
          link: "/community/itn-tos",
        },
      ],
    },
  ];
}
