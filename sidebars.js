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
         type: "doc", 
         label: "Bridge Node", 
         id: "nodes/bridge-node" 
       },
      {
        type: "doc",
        label: "Validator Node",
        id: "nodes/validator-node",
      },
      { 
        type: "doc", 
        label: "Light Node", 
        id: "nodes/light-node" 
      },
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
          label: "Mamaki",
          id: "nodes/mamaki"
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
    { type: "doc", label: "Overview", id: "developers/overview" },
    { type: "doc", label: "Node API", id: "developers/node-api" },
    { type: "doc", label: "Create A Celestia Testnet", id: "developers/instantiate-testnet" },
  ],
  community: [
    { type: "doc", label: "Overview", id: "community/overview" },
    { type: "doc", label: "Code of Conduct", id: "community/coc" },
    { type: "doc", label: "Community Calendar", id: "community/calendar" },
    { type: "doc", label: "Docs Translations", id: "community/translations" },
  ],
};

module.exports = sidebars;
