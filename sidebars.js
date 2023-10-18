const sidebars = {
  nodes: [
    { 
      type: "doc", 
      label: "Overview", 
      id: "nodes/overview" 
    },
    {
      type: "category",
      label: "Networks",
      link: {
        type: "doc",
        id: "nodes/participate"
      },
      collapsed: true,
      items: [
        {
          type: "doc",
          label: "Arabica devnet",
          id: "nodes/arabica-devnet"
        },
        {
          "type": "link",
          "label": "Arabica-9 devnet",
          "href": "/arabica-9"
        },
        {
          type: "doc",
          label: "Mocha testnet",
          id: "nodes/mocha-testnet"
        },
      ]
    },
    {
      type: "category",
      label: "Quick start",
      link: {
        type: "doc",
        id: "nodes/quick-start"
      },
      collapsed: true,
      items: [
        {
          type: "doc",
          label: "Deciding which node to run",
          id: "nodes/decide-node"
        },
        {
          type: "doc",
          label: "Docker images",
          id: "nodes/docker-images",
        },
        { 
          type: "doc", 
          label: "Setting up environment", 
          id: "nodes/environment" 
        },
        {
          type: "doc",
          label: "Installing Celestia Node",
          id: "nodes/celestia-node"
        },
        {
          type: "doc",
          label: "Installing Celestia App",
          id: "nodes/celestia-app"
        },
        {
          type: "doc",
          label: "Node video tutorials",
          id: "developers/light-node-video"
        },
      ]
    },
    { 
      type: "category", 
      label: "Types of nodes", 
      link: {
        type: 'generated-index'
      },
      collapsed: true,
      items: [
      {
        type: "category",
        label: "Data availability",
        link: {
          type: 'generated-index',
        },
        collapsed: true,
        items: [
          { 
            type: "doc", 
            label: "Light node", 
            id: "nodes/light-node" 
          },
          { 
            type: "doc", 
            label: "Bridge node", 
            id: "nodes/bridge-node" 
          },
          {
            type: "doc",
            label: "Full storage node",
            id: "nodes/full-storage-node",
          },
        ]
      },
      {
        type: "doc",
        label: "Consensus nodes",
        id: "nodes/consensus-node",
      },
      {
        type: "category",
        label: "Blobstream",
        link: {
          type: 'generated-index'
        },
        collapsed: true,
        items: [
            {
              type: "doc",
              label: "Blobstream overview",
              id: "nodes/blobstream-intro",
            },
            {
              type: "doc",
              label: "Install the binary",
              id: "nodes/blobstream-binary",
            },
            {
              type: "doc",
              label: "Blobstream Orchestrator",
              id: "nodes/blobstream-orchestrator",
            },
            {
              type: "doc",
              label: "Key management",
              id: "nodes/blobstream-keys",
            },
            {
              type: "doc",
              label: "Blobstream Relayer",
              id: "nodes/blobstream-relayer",
            },
            {
              type: "doc",
              label: "Deploy the Blobstream contract",
              id: "nodes/blobstream-deploy",
            }
        ]
      },
    ]
    },
    {
      type: "category",
      label: "Resources",
      link: {
        type: 'generated-index'
      },
      collapsed: true,
      items: [
        {
          type: "category",
          label: "Celestia Node",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "Setting up metrics",
              id: "nodes/celestia-node-metrics"
            },
            {
              type: "doc",
              label: "Config.toml guide",
              id: "nodes/config-toml"
            },
            {
              type: "doc",
              label: "Custom networks and values",
              id: "nodes/celestia-node-custom-networks"
            },
            {
              type: "doc",
              label: "Troubleshooting",
              id: "nodes/celestia-node-troubleshooting"
            },
          ]
        },
        {
          type: "category",
          label: "Celestia App",
          link: {
            type: 'generated-index'
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "Metrics, Visualizations and Alerts",
              id: "nodes/celestia-app-metrics"
            },
            { 
              type: "doc", 
              label: "Create a Celestia testnet", 
              id: "nodes/instantiate-testnet" 
            },
            {
              type: "doc",
              label: "Helpful CLI commands",
              id: "nodes/celestia-app-commands"
            },
            {
              type: "link",
              label: "Specifications",
              href: "https://celestiaorg.github.io/celestia-app/",
            }
          ]
        },
        {
          type: "doc",
         label: "SystemD",
          id: "nodes/systemd"
        },
        {
          type: "doc",
          label: "Hardfork process",
          id: "nodes/hardfork-process"
        },
      ]
    },
  ],
  developers: [
    { 
      type: "doc", 
      label: "Overview", 
      id: "developers/overview" 
    },
    {
      type: "doc",
      label: "Build modular",
      id: "developers/build-modular"
    },
    {
      type: "category",
      label: "Wallets on Celestia",
      link: {
        type: "doc",
        id: "developers/wallets"
      },
      collapsed: true,
      items: [
        {
          type: "doc", 
          label: "Keplr", 
          id: "developers/keplr" 
        },
        {
          type: "doc", 
          label: "Leap", 
          id: "developers/leap"
        },
        {
          type: "doc",
          label: "Cosmostation", 
          id: "developers/cosmostation" 
        },
        {
          type: "category",
          label: "Wallet with Celestia App",
          link: {
            type: "doc",
            id: "developers/celestia-app-wallet"
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "Create a vesting account",
              id: "developers/celestia-app-vesting"
            },
          ],
        },
        {
          type: "doc",
          label: "Wallet with Celestia Node",
          id: "developers/celestia-node-key"
        },
        {
          type: "doc",
          label: "Staking",
          id: "developers/staking"
        },
      ]
    },
    {
      type: "doc",
      label: "Submitting data blobs to Celestia",
      id: "developers/submit-data"
    },
    {
      type: "doc",
      label: "Data retrievability and pruning",
      id: "developers/retrievability",
    },
    {
      type: "category",
      label: "Node API",
      link: {
        type: "doc",
        id: "developers/node-api"
      },
      collapsed: true,
      items: [
        { 
          type: "doc", 
          label: "Node API tutorial", 
          id: "developers/node-tutorial" 
        },
        {
          "type": "link",
          "label": "Celestia Node API",
          "href": "https://node-rpc-docs.celestia.org/"
        },
        {
          type: "category",
          label: "Gateway API",
          link: {
            type: "generated-index",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "Prompt scavenger",
              id: "developers/prompt-scavenger"
            },
          ]
        },
      ]
    },
    {
      type: "category",
      label: "Deploy a rollup",
			link: {
        id: "developers/rollup-overview",
				type: "doc",
			},
			collapsed: true,
			items: [
        // TODO: Add blobstream in Rollup category
        {
      		type: "doc",
      		label: "Rollkit",
      		id: "developers/rollkit"
    		},{
      		type: "category",
      		label: "Optimism",
					link: {
						type: "generated-index",
					},
					collapsed: true,
					items: [
						{
							type: "doc",
							label: "Introduction to OP Stack integration",
              id: "developers/intro-to-op-stack"
						},
            {
							type: "doc",
              label: "Bubs testnet",
              id: "developers/bubs-testnet",
            },
						{
							type: "doc",
							label: "Deploy a smart contract on Bubs testnet",
              id: "developers/deploy-on-bubs"
						},
            {
							type: "doc",
              label: "Deploy a GM Portal dapp on Bubs testnet",
              id: "developers/gm-portal-bubs",
            },
            // {
            //   type: "link",
            //   label: "Deploy a dapp with scaffold-eth",
            //   href: "https://github.com/jcstein/scaffold-eth",
            // },
            {
              type: "link",
              label: "Deploy a dapp with thirdweb",
              href: "https://thirdweb.com/bubs-testnet",
            },
            {
							type: "doc",
							label: "Deploy an OP Stack devnet",
      				id: "developers/optimism-devnet"
            },
            {
							type: "doc",
							label: "Deploy an OP Stack testnet on Celestia",
      				id: "developers/optimism"
            },
            // {
            //   type: "category",
            //   label: "Use cases",
            //   link: {
            //     type: "generated-index",
            //   },
            //   collapsed: true,
            //   items: [
            //     {
            //       type: "doc",
            //       label: "Introduction to OP Stack integration",
            //       id: "developers/intro-to-op-stack"
            //     },
            //     {
            //       type: "doc",
            //       label: "Bubs testnet",
            //       id: "developers/bubs-testnet",
            //     }
            //   ]
            // },
            {
              type: "category",
              label: "Rollups as a Service",
              link: {
                type: "generated-index",
              },
              collapsed: true,
              items: [
                {
                  type: "link",
                  label: "Caldera",
                  href: "https://caldera.xyz",
                },
                // {
                //   type: "link",
                //   label: "Conduit (coming soon)",
                //   href: "https://conduit.xyz",
                // }
              ]
            },
					]
    		},{
          type: "doc",
          label: "Full stack modular blockchain development guide",
          id: "developers/full-stack-modular-development-guide"
        },{
          type: "link",
          label: "Sovereign SDK",
          href: "https://github.com/Sovereign-Labs/sovereign-sdk/tree/main/examples/demo-rollup#demo-rollup",
        },{
          type: "link",
          label: "Dymension",
          href: "https://dymension.xyz/"
        }
			]
    },
    {
      type: "doc",
      label: "IBC Relaying Guide",
      id: "developers/ibc-relayer"
    },
    {
      type: "doc",
      label: "Integrate Celestia",
      id: "developers/integrate-celestia",
    },
    {
      type: "category",
      label: "Integrate with Blobstream",
      link: { type: "doc", id: "developers/blobstream", },
      collapsed: true,
      items: [
        { type: "doc", label: "Integrate with Blobstream Contracts", id: "developers/blobstream-contracts" },
        { type: "doc", label: "Integrate with Blobstream Client", id: "developers/blobstream-offchain" },
      ]
    },
    {
      type: "doc",
      label: "Demos on Celestia",
      id: "developers/demos",
    },
  ],
  community: [
    { type: "doc", label: "Overview", id: "community/overview" },
    { type: "doc", label: "Code of Conduct", id: "community/coc" },
    { type: "doc", label: "Community calendar", id: "community/calendar" },
    { type: "doc", label: "Incentivized testnet supplemental terms", id: "community/itn-tos" },
    { type: "doc", label: "Docs translations", id: "community/translations" },
    {
      type: "category",
      label: "Modular Fellows",
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        { type: "doc", label: "Overview", id: "community/modular-fellows" },
        { type: "doc", label: "Cohort one content", id: "community/cohort-one-content" },
      ]
    },
    {
      type: "category",
      label: "Modular Meetup Program",
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        { type: "doc", label: "Introduction", id: "community/modular-meetup-intro" },
        { type: "doc", label: "Modular Meetup Toolkit", id: "community/modular-meetup-toolkit" },
        { type: "doc", label: "Speaker list", id: "community/speaker-list" },
        { type: "doc", label: "Meetup guide", id: "community/modular-meetup-guide" },
      ]
    },
  ],
  learn: [
      {
        type: "category",
        label: "Overview of Celestia",
        link: {
          type: 'generated-index'
        },
        collapsed: true,
        items: [
          {
            type: 'doc',
            label: "Introduction",
            id: "learn/how-celestia-works/introduction"
          },
          {
            type: "doc",
            label: "Monolithic vs. modular blockchains",
            id: "learn/how-celestia-works/monolithic-vs-modular"
          },
          {
            type: "category",
            label: "Data availability layer",
            collapsed: true,
            items: [
              {
                type: "doc",
                label: "Celestia’s data availability layer",
                id: "learn/how-celestia-works/data-availability-layer"
              },
              {
                type: "doc",
                label: "The lifecycle of a Celestia app transaction",
                id: "learn/how-celestia-works/transaction-lifecycle"
              },
              {
                type: "doc",
                label: "Data availability FAQs",
                id: "learn/data-availability-faq"
              }
            ]
          },
          {
            type: "category",
            label: "Extra resources",
            collapsed: true,
            items: [
              {
                type: "link",
                label: "Learn modular",
                href: "https://celestia.org/learn/"
              },
              {
                type: "link",
                label: "Specifications",
                href: "https://celestiaorg.github.io/celestia-app/"
              },
              {
                type: "link",
                label: "Glossary",
                href: "https://celestia.org/glossary/"
              }
            ]
          }
        ]
      },
      {
        type: "category",
        label: "TIA",
        link: {
          type: 'generated-index'
        },
        collapsed: true,
        items: [
          {
            type: "doc",
            label: "Overview of TIA",
            id: "learn/tia"
          },
          {
            type: "doc",
            label: "Paying for blobspace",
            id: "learn/paying-for-blobspace"
          },
          {
            type: "doc",
            label: "Staking, governance, & supply",
            id: "learn/staking-governance-supply"
          },
        ]
      },
  ]
};

module.exports = sidebars;