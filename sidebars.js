const sidebars = {
  nodes: [
    { 
      type: "doc", 
      label: "Overview", 
      id: "nodes/overview" 
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
            label: "Bridge Node", 
            id: "nodes/bridge-node" 
          },
          {
            type: "doc",
            label: "Full Storage Node",
            id: "nodes/full-storage-node",
          },
          { 
            type: "doc", 
            label: "Light Node", 
            id: "nodes/light-node" 
          }
        ]
      }
      ]
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
          label: "Arabica Devnet",
          id: "nodes/arabica-devnet"
        },
        {
          type: "doc",
          label: "Mamaki Testnet",
          id: "nodes/mamaki-testnet"
        }
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
          type: "doc",
          label: "SystemD",
          id: "nodes/systemd"
        },
        {
          type: "doc",
          label: "Keys",
          id: "nodes/keys"
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
      label: "Integrating Celestia",
      id: "developers/integrating-celestia",
    },
    { 
      type: "doc", 
      label: "Setting Up Environment", 
      id: "developers/environment" 
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
          label: "Installing Celestia App",
          id: "developers/celestia-app"
        },
        {
          type: "doc",
          label: "Creating A Wallet",
          id: "developers/wallet"
        },
        { 
          type: "doc", 
          label: "Create A Celestia Testnet", 
          id: "developers/instantiate-testnet" 
        },
        {
          type: "doc",
          label: "Helpful CLI commands",
          id: "developers/celestia-app-commands"
        }
      ]
    },
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
          label: "Installing Celestia Node",
          id: "developers/celestia-node"
        },
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
      type: "category",
      label: "Optimint",
      link: {
        type: "doc",
        id: "developers/optimint"
      },
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Wordle",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "Wordle Overview",
              id: "developers/wordle"
            },
            {
              type: "doc",
              label: "Scaffolding The Chain",
              id: "developers/scaffold-wordle"
            },
            {
              type: "doc",
              label: "Installing Optimint",
              id: "developers/install-optimint"
            },
            {
              type: "doc",
              label: "Module",
              id: "developers/wordle-module"
            },
            {
              type: "doc",
              label: "Messages",
              id: "developers/wordle-messages"
            },
            {
              type: "doc",
              label: "Types",
              id: "developers/wordle-types"
            },
            {
              type: "doc",
              label: "Keeper",
              id: "developers/wordle-keeper"
            },
            {
              type: "doc",
              label: "Run The Wordle Chain",
              id: "developers/run-wordle"
            },
          ]
        },
        {
          type: "category",
          label: "CosmWasm",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              label: "CosmWasm Overview",
              id: "developers/cosmwasm"
            },
            {
              type: "doc",
              label: "CosmWasm Dependencies",
              id: "developers/cosmwasm-dependency"
            },
            {
              type: "doc",
              label: "Setup Network Environment",
              id: "developers/cosmwasm-environment"
            },
            {
              type: "doc",
              label: "Contract Deployment",
              id: "developers/cosmwasm-contract-deployment"
            },
            {
              type: "doc",
              label: "Contract Interaction",
              id: "developers/cosmwasm-contract-interaction"
            },
            {
              type: "doc",
              label: "CosmWasm Resources",
              id: "developers/cosmwasm-resources"
            }
          ]
        }
      ]
    }
  ],
  community: [
    { type: "doc", label: "Overview", id: "community/overview" },
    { type: "doc", label: "Code of Conduct", id: "community/coc" },
    { type: "doc", label: "Community Calendar", id: "community/calendar" },
    { type: "doc", label: "Docs Translations", id: "community/translations" },
    { type: "doc", label: "Modular Fellows", id: "community/modular-fellows"}
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