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
          },
        ]
      }
      ]
    },
    {
      type: "category",
      label: "Participate",
      link: {
        type: 'generated-index'
      },
      collapsed: false,
      items: [
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
          label: "Node API", 
          id: "developers/node-api" 
        }
      ]
    },
    {
      type: "category",
      label: "Optimint",
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
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
  ],
};

module.exports = sidebars;
