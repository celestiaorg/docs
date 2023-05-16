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
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Blockspace race",
          id: "nodes/blockspace-race"
        },
        {
          type: "doc",
          label: "Arabica devnet",
          id: "nodes/arabica-devnet"
        },
        {
          type: "doc",
          label: "Mocha testnet",
          id: "nodes/mocha-testnet"
        }
      ]
    },
    {
      type: "category",
      label: "Quick start",
      link: {
        type: "doc",
        id: "nodes/quick-start"
      },
      collapsed: false,
      items: [
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
          label: "Deciding which node to run",
          id: "nodes/decide-node"
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
        type: "category",
        label: "Consensus",
        link: {
          type: 'generated-index'
        },
        collapsed: true,
        items: [
          {
            type: "category",
            label: "Validators",
            link: {
              type: 'generated-index'
            },
            collapsed: false,
            items: [
              {
                type: "doc",
                label: "Validator node",
                id: "nodes/validator-node",
              },
              {
                type: "category",
                label: "QGB",
                link: {
                  type: 'generated-index'
                },
                collapsed: false,
                items: [
                    {
                      type: "doc",
                      label: "Quantum Gravity Bridge",
                      id: "nodes/qgb-intro",
                    },
                    {
                      type: "doc",
                      label: "Install the binary",
                      id: "nodes/qgb-binary",
                    },
                    {
                      type: "doc",
                      label: "QGB Orchestrator",
                      id: "nodes/qgb-orchestrator",
                    },
                    {
                      type: "doc",
                      label: "Key management",
                      id: "nodes/qgb-keys",
                    },
                    {
                      type: "doc",
                      label: "QGB Relayer",
                      id: "nodes/qgb-relayer",
                    },
                    {
                      type: "doc",
                      label: "Deploy the QGB contract",
                      id: "nodes/qgb-deploy",
                    }
                ]
              }
            ]
          },
          { 
            type: "doc", 
            label: "Consensus full node", 
            id: "nodes/consensus-full-node" 
          },
          { 
            type: "doc", 
            label: "IBC Relayer", 
            id: "nodes/ibc-relayer" 
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
      label: "Create a Celestia wallet",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        {
          type: "doc", 
          label: "Keplr", 
          id: "developers/keplr" 
        },
        {
          type: "doc",
          label: "Wallet with Celestia App",
          id: "developers/celestia-app-wallet"
        },
        {
          type: "doc",
          label: "Wallet with Celestia Node",
          id: "developers/celestia-node-key"
        },
      ]
    },
    {
      type: "category",
      label: "Node API",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Gateway API",
          link: {
            type: "generated-index",
          },
          collapsed: false,
          items: [
            { 
              type: "doc", 
              label: "Gateway API tutorial", 
              id: "developers/node-tutorial" 
            },
            {
              type: "doc",
              label: "Gateway API docs",
              id: "developers/node-gateway-docs"
            },
            {
              type: "doc",
              label: "Prompt scavenger",
              id: "developers/prompt-scavenger"
            },
          ]
        },
        {
          type: "category",
          label: "RPC API",
          link: {
            type: "generated-index",
          },
          collapsed: false,
          items: [
            { 
              type: "doc", 
              label: "RPC API tutorial", 
              id: "developers/rpc-tutorial" 
            },
            {
              type: "link",
              label: "RPC API docs",
              href: "https://node-rpc-docs.celestia.org/"
            },
          ]
        },
        // {
        //   type: "doc",
        //   label: "Node video tutorial",
        //   id: "developers/light-node-video"
        // },
      ]
    },
    {
      type: "category",
      label: "Deploy A Rollup",
			link: {
				type: "generated-index",
			},
			collapsed: false,
			items: [
				{
      		type: "doc",
      		label: "Rollkit",
      		id: "developers/rollkit"
    		},
    		{
      		type: "category",
      		label: "Optimism",
					link: {
						type: "generated-index",
					},
					collapsed: false,
					items: [
						{
							type: "doc",
							label: "Introduction to OP Stack integration",
              id: "developers/intro-to-op-stack"
						},
            {
							type: "doc",
              label: "Taro testnet",
              id: "developers/taro-testnet",
            },
						{
							type: "doc",
							label: "Deploy a smart contract on Taro testnet",
              id: "developers/deploy-on-taro"
						},
            {
							type: "doc",
              label: "Deploy a GM Portal dapp on Taro testnet",
              id: "developers/gm-portal-taro",
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
            //       label: "Taro testnet",
            //       id: "developers/taro-testnet",
            //     }
            //   ]
            // },
					]
    		},
			]
    },
    {
      type: "doc",
      label: "Full stack modular blockchain development guide",
      id: "developers/full-stack-modular-development-guide"
    },
    {
      type: "doc",
      label: "Integrate Celestia",
      id: "developers/integrate-celestia",
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
      collapsed: false,
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
      collapsed: false,
      items: [
        { type: "doc", label: "Introduction", id: "community/modular-meetup-intro" },
        { type: "doc", label: "Modular Meetup Toolkit", id: "community/modular-meetup-toolkit" },
        { type: "doc", label: "Speaker list", id: "community/speaker-list" },
        { type: "doc", label: "Meetup guide", id: "community/modular-meetup-guide" },
      ]
    },
  ],
  concepts: [
    {
      type: "category",
      label: "How Celestia works",
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: "Introduction",
          id: "concepts/how-celestia-works/introduction"
        },
        {
          type: "doc",
          label: "Monolithic vs. modular blockchains",
          id: "concepts/how-celestia-works/monolithic-vs-modular"
        },
        {
          type: "doc",
          label: "Celestia's data availability layer",
          id: "concepts/how-celestia-works/data-availability-layer"
        },
        {
          type: "doc",
          label: "The lifecycle of a Celestia App transaction",
          id: "concepts/how-celestia-works/transaction-lifecycle"
        }
      ]
    },
    {
      type: "link",
      label: "Learn modular",
      href: "https://celestia.org/learn/"
    },
    {
      type: "doc",
      label: "Data availability FAQ",
        id: "concepts/data-availability-faq",
    },
    {
      type: "link",
      label: "Glossary",
      href: "https://celestia.org/glossary/"
    },
    {
      type: "category",
      label: "Specifications",
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: "Reserved namespace IDs",
          id: "concepts/specifications/reserved-namespace-id"
        },
        {
          type: "link",
          label: "Celestia App",
          href: "https://celestiaorg.github.io/celestia-app/",
        },
      ]
    },
    {
      type: "link",
      label: "Resources",
      href: "https://celestia.org/resources/"
    }
  ]
};

module.exports = sidebars;
