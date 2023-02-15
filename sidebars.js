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
          label: "Local Devnet",
          id: "nodes/local-devnet"
        },
        {
          type: "doc",
          label: "Arabica Devnet",
          id: "nodes/arabica-devnet"
        },
        {
          type: "doc",
          label: "Mocha Testnet",
          id: "nodes/mocha-testnet"
        }
      ]
    },
    {
      type: "category",
      label: "Quick Start",
      link: {
        type: "doc",
        id: "nodes/quick-start"
      },
      collapsed: false,
      items: [
        { 
          type: "doc", 
          label: "Setting Up Environment", 
          id: "nodes/environment" 
        },
        {
          type: "doc",
          label: "Installing Celestia Node",
          id: "nodes/celestia-node"
        },
        {
          type: "doc",
          label: "Docker Images",
          id: "nodes/docker-images",
        },
        {
          type: "doc",
          label: "Installing Celestia App",
          id: "nodes/celestia-app"
        },
        {
          type: "doc",
          label: "Deciding Which Node to Run",
          id: "nodes/decide-node"
        },
      ]
    },
    { 
      type: "category", 
      label: "Types of Nodes", 
      link: {
        type: 'generated-index'
      },
      collapsed: false,
      items: [
      {
        type: "category",
        label: "Data Availability",
        link: {
          type: 'generated-index',
        },
        collapsed: false,
        items: [
          { 
            type: "doc", 
            label: "Light Node", 
            id: "nodes/light-node" 
          },
          { 
            type: "doc", 
            label: "Bridge Node", 
            id: "nodes/bridge-node" 
          },
          {
            type: "doc",
            label: "Full Storage Node",
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
            label: "Validator Node",
            id: "nodes/validator-node",
          },
          { 
            type: "doc", 
            label: "Consensus Full Node", 
            id: "nodes/consensus-full-node" 
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
          label: "Celestia Node",
          link: {
            type: 'generated-index',
          },
          collapsed: false,
          items: [
            {
              type: "doc",
              label: "Node Metrics",
              id: "nodes/celestia-node-metrics"
            },
          ]
        },
        {
          type: "category",
          label: "Celestia App",
          link: {
            type: 'generated-index'
          },
          collapsed: false,
          items: [
            { 
              type: "doc", 
              label: "Create A Celestia Testnet", 
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
          label: "Hardfork Process",
          id: "nodes/hardfork-process"
        },
        {
          type: "doc",
          label: "SystemD",
          id: "nodes/systemd"
        },
        { 
          type: "doc", 
          label: "Devops Resources", 
          id: "nodes/devops-resources"
        },
        {
          type: "doc",
          label: "Config.toml Guide",
          id: "nodes/config-toml"
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
      label: "Build Modular",
      id: "developers/build-modular"
    },
    {
      type: "category",
      label: "Create A Celestia Wallet",
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
          label: "Wallet With Celestia App",
          id: "developers/celestia-app-wallet"
        },
        {
          type: "doc",
          label: "Wallet With Celestia Node",
          id: "developers/celestia-node-key"
        },
      ]
    },
    {
      type: "category",
      label: "Data Availability API",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        { 
          type: "doc", 
          label: "Node Tutorial", 
          id: "developers/node-tutorial" 
        },
        {
          type: "doc",
          label: "Node Video Tutorial",
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
      label: "Full Stack Modular Blockchain Development Tutorial",
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
    { type: "doc", label: "Community Calendar", id: "community/calendar" },
    { type: "doc", label: "Incentivized Testnet Supplemental Terms", id: "community/itn-tos" },
    { type: "doc", label: "Docs Translations", id: "community/translations" },
    {
      type: "category",
      label: "Modular Fellows",
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        { type: "doc", label: "Overview", id: "community/modular-fellows" },
        { type: "doc", label: "Cohort One Content", id: "community/cohort-one-content" },
      ]
    },
  ],
  concepts: [
    {
      type: "category",
      label: "How Celestia Works",
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
          label: "Monolithic vs. Modular Blockchains",
          id: "concepts/how-celestia-works/monolithic-vs-modular"
        },
        {
          type: "doc",
          label: "Celestia's Data Availability Layer",
          id: "concepts/how-celestia-works/data-availability-layer"
        },
        {
          type: "doc",
          label: "The Lifecycle of a Celestia App Transaction",
          id: "concepts/how-celestia-works/transaction-lifecycle"
        }
      ]
    },
    {
      type: "link",
      label: "Learn Modular",
      href: "https://celestia.org/learn/"
    },
    {
      type: "doc",
      label: "Data Availability FAQ",
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
          label: "Reserved Namespace IDs",
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
