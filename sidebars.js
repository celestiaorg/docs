const sidebars = {
  nodes: [
    { 
      type: "doc", 
      label: "Overview", 
      id: "nodes/overview" 
    },
    {
      type: "category",
      label: "Participate",
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
          label: "Local devnet",
          id: "nodes/local-devnet"
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
          label: "Setting up environment", 
          id: "nodes/environment" 
        },
        {
          type: "doc",
          label: "Installing celestia-node",
          id: "nodes/celestia-node"
        },
        {
          type: "doc",
          label: "Docker images",
          id: "nodes/docker-images",
        },
        {
          type: "doc",
          label: "Installing celestia-app",
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
      collapsed: false,
      items: [
      {
        type: "category",
        label: "Data availability",
        link: {
          type: 'generated-index',
        },
        collapsed: false,
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
        collapsed: false,
        items: [
          {
            type: "doc",
            label: "Validator node",
            id: "nodes/validator-node",
          },
          { 
            type: "doc", 
            label: "Consensus full node", 
            id: "nodes/consensus-full-node" 
          },
          { 
            type: "doc", 
            label: "Relayer", 
            id: "nodes/relayer" 
          },
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
      collapsed: false,
      items: [
        {
          type: "category",
          label: "celestia-node",
          link: {
            type: 'generated-index',
          },
          collapsed: false,
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
          label: "celestia-app",
          link: {
            type: 'generated-index'
          },
          collapsed: false,
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
            }
          ]
        },
        {
          type: "doc",
          label: "Hardfork process",
          id: "nodes/hardfork-process"
        },
        {
          type: "doc",
          label: "SystemD",
          id: "nodes/systemd"
        },
        { 
          type: "doc", 
          label: "Devops resources", 
          id: "nodes/devops-resources"
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
          label: "Wallet with celestia-app",
          id: "developers/celestia-app-wallet"
        },
        {
          type: "doc",
          label: "Wallet with celestia-node",
          id: "developers/celestia-node-key"
        },
      ]
    },
    {
      type: "category",
      label: "Data availability API",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        { 
          type: "doc", 
          label: "Node tutorial", 
          id: "developers/node-tutorial" 
        },
        {
          type: "doc",
          label: "Node video tutorial",
          id: "developers/light-node-video"
        },
        { 
          type: "doc", 
          label: "Node API", 
          id: "developers/node-api" 
        }
      ]
    },
    {
      type: "doc",
      label: "Rollkit",
      id: "developers/rollkit"
    },
    {
      type: "doc",
      label: "Full stack modular blockchain development guide",
      id: "developers/full-stack-modular-development-guide"
    },
    {
      type: "doc",
      label: "Fuelmint",
      id: "developers/fuelmint"
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
          label: "The lifecycle of a celestia-app transaction",
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
