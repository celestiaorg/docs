import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { defineConfig } from 'vocs/config'
import remarkReplaceVariables from './plugins/remark-replace-variables.mjs'

const siteOrigin = 'https://docs.celestia.org'
const siteDescription =
  'Learn, build, and operate on Celestia - the modular data availability network.'

const rawBasePath = process.env.BASE?.trim()
const basePath = rawBasePath ? rawBasePath.replace(/\/$/, '') || '/' : '/'

export default defineConfig({
  title: 'Celestia Documentation',
  description: siteDescription,
  titleTemplate: '%s - Celestia Documentation',
  basePath,
  baseUrl: siteOrigin,
  outDir: 'out',
  renderStrategy: 'full-static',
  checkDeadlinks: 'warn',
  mcp: {
    enabled: true,
  },
  markdown: {
    remarkPlugins: [remarkReplaceVariables, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  iconUrl: '/favicons/favicon.svg',
  ogImageUrl: '/Celestia-og.png',
  accentColor: 'light-dark(#6d3df5, #9d7cff)',
  editLink: {
    link: (filePath) => {
      const sourcePath = filePath
        .replace(/^src\/pages\//, 'app/')
        .replace(/^app\/index\.mdx$/, 'app/page.mdx')
        .replace(/\/index\.mdx$/, '/page.mdx')

      return `https://github.com/celestiaorg/docs/edit/main/${sourcePath}`
    },
    text: 'Edit this page',
  },
  socials: [
    { icon: 'github', link: 'https://github.com/celestiaorg/docs' },
    { icon: 'discord', link: 'https://discord.com/invite/YsnTPcSfWQ' },
    { icon: 'x', link: 'https://x.com/CelestiaOrg' },
  ],
  topNav: [
    { text: 'Learn', link: '/learn/celestia-101/data-availability', match: '/learn' },
    { text: 'Build', link: '/build/post-retrieve-blob/overview', match: '/build' },
    { text: 'Operate', link: '/operate/getting-started/overview', match: '/operate' },
    { text: 'Status', link: 'https://status.celestia.org', external: true },
  ],
  sidebar: {
    '/': [
      { text: 'Learn', link: '/learn/celestia-101/data-availability' },
      { text: 'Build', link: '/build/post-retrieve-blob/overview' },
      { text: 'Operate', link: '/operate/getting-started/overview' },
    ],
    '/learn': [
      {
        text: 'Celestia 101',
        items: [
          { text: 'Data availability', link: '/learn/celestia-101/data-availability' },
          { text: 'Data retrievability and pruning', link: '/learn/celestia-101/retrievability' },
          { text: 'Transaction lifecycle', link: '/learn/celestia-101/transaction-lifecycle' },
          { text: 'Data availability FAQ', link: '/learn/celestia-101/data-availability-faq' },
          { text: 'Data, dashboards, and analytics', link: '/learn/celestia-101/resources' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Private blockspace', link: '/learn/features/private-blockspace' },
          {
            text: 'Bridging',
            items: [
              { text: 'IBC', link: '/learn/features/bridging/ibc' },
              { text: 'Hyperlane', link: '/learn/features/bridging/hyperlane' },
            ],
          },
        ],
      },
      {
        text: 'TIA',
        items: [
          { text: 'Overview of TIA', link: '/learn/TIA/overview' },
          { text: 'Paying for blobspace', link: '/learn/TIA/paying-for-blobspace' },
          { text: 'Submitting data blobs', link: '/learn/TIA/submit-data' },
          { text: 'Staking, governance, and supply', link: '/learn/TIA/staking-governance-supply' },
          { text: 'Staking on Celestia', link: '/learn/TIA/staking' },
        ],
      },
      { text: 'Blobstream', link: '/learn/blobstream' },
      { text: 'Audits', link: '/learn/audits' },
      { text: 'Code of Conduct', link: '/learn/code-of-conduct' },
    ],
    '/build': [
      {
        text: 'Post/retrieve a blob',
        items: [
          { text: 'Overview', link: '/build/post-retrieve-blob/overview' },
          { text: 'Go client', link: '/build/post-retrieve-blob/client/go' },
          { text: 'Rust client', link: '/build/post-retrieve-blob/client/rust' },
        ],
      },
      {
        text: 'Private blockspace',
        items: [
          { text: 'About', link: '/build/private-blockspace/about' },
          { text: 'Quickstart', link: '/build/private-blockspace/quickstart' },
        ],
      },
      {
        text: 'Blobstream',
        items: [
          { text: 'Integrate with contracts', link: '/build/blobstream/integrate-contracts' },
          { text: 'Integrate offchain', link: '/build/blobstream/integrate-offchain' },
          { text: 'Proof queries', link: '/build/blobstream/proof-queries' },
        ],
      },
      {
        text: 'Stacks',
        items: [
          { text: 'Nitro DAS server', link: '/build/stacks/nitro-das-server' },
          { text: 'OP alt DA', link: '/build/stacks/op-alt-da/introduction' },
          { text: 'AWS KMS guide', link: '/build/stacks/op-alt-da/aws-kms-guide' },
        ],
      },
      {
        text: 'RPC Documentation',
        items: [
          { text: 'Node API', link: '/build/rpc/node-api' },
          { text: 'Clients', link: '/build/rpc/clients' },
          {
            text: 'Celestia-app',
            link: 'https://celestiaorg.github.io/celestia-app/swagger/',
            external: true,
          },
        ],
      },
    ],
    '/operate': [
      {
        text: 'Getting started',
        items: [
          { text: 'Overview', link: '/operate/getting-started/overview' },
          { text: 'Hardware requirements', link: '/operate/getting-started/hardware-requirements' },
          { text: 'Environment setup', link: '/operate/getting-started/environment-setup' },
          { text: 'Using docker', link: '/operate/getting-started/docker' },
        ],
      },
      {
        text: 'Networks',
        items: [
          { text: 'Overview', link: '/operate/networks/overview' },
          { text: 'Mainnet Beta', link: '/operate/networks/mainnet-beta' },
          { text: 'Mocha testnet', link: '/operate/networks/mocha-testnet' },
          { text: 'Arabica devnet', link: '/operate/networks/arabica-devnet' },
          { text: 'Local devnet', link: '/operate/networks/local-devnet' },
        ],
      },
      {
        text: 'Data availability nodes',
        items: [
          { text: 'Install celestia-node', link: '/operate/data-availability/install-celestia-node' },
          { text: 'Run a light node', link: '/operate/data-availability/light-node/quickstart' },
          { text: 'Light node advanced', link: '/operate/data-availability/light-node/advanced' },
          { text: 'Run a bridge node', link: '/operate/data-availability/bridge-node' },
          { text: 'Configuration reference', link: '/operate/data-availability/config-reference' },
          { text: 'Custom networks and values', link: '/operate/data-availability/custom-networks' },
          { text: 'IBC relayer setup', link: '/operate/data-availability/ibc-relayer' },
          { text: 'Metrics and dashboards', link: '/operate/data-availability/metrics' },
          { text: 'Storage optimization', link: '/operate/data-availability/storage-optimization' },
        ],
      },
      {
        text: 'Consensus and validators',
        items: [
          { text: 'Install celestia-app', link: '/operate/consensus-validators/install-celestia-app' },
          { text: 'Run a consensus node', link: '/operate/consensus-validators/consensus-node' },
          { text: 'Run a validator node', link: '/operate/consensus-validators/validator-node' },
          { text: 'CLI commands reference', link: '/operate/consensus-validators/cli-reference' },
          { text: 'Slashing and jailing', link: '/operate/consensus-validators/slashing' },
          { text: 'Metrics and monitoring', link: '/operate/consensus-validators/metrics' },
          { text: 'Upgrade monitoring', link: '/operate/consensus-validators/upgrade-monitor' },
          {
            text: 'Foundation delegation program',
            link: '/operate/consensus-validators/foundation-delegation-program',
          },
        ],
      },
      {
        text: 'Blobstream',
        items: [
          { text: 'Install the Binary', link: '/operate/blobstream/install-binary' },
          { text: 'Key Management', link: '/operate/blobstream/key-management' },
          { text: 'Deploy the Contract', link: '/operate/blobstream/deploy-contract' },
          { text: 'Run the Orchestrator', link: '/operate/blobstream/orchestrator' },
          { text: 'Run the Relayer', link: '/operate/blobstream/relayer' },
        ],
      },
      {
        text: 'Maintenance',
        items: [
          { text: 'Snapshots and fast sync', link: '/operate/maintenance/snapshots' },
          { text: 'Trusted hash recovery', link: '/operate/maintenance/trusted-hash-recovery' },
          { text: 'Datastore layout', link: '/operate/maintenance/datastore-structure' },
          { text: 'Systemd service setup', link: '/operate/maintenance/systemd' },
          { text: 'Network upgrades', link: '/operate/maintenance/network-upgrades' },
          { text: 'Troubleshooting', link: '/operate/maintenance/troubleshooting' },
        ],
      },
      {
        text: 'Keys and wallets',
        items: [
          { text: 'Consensus node keys', link: '/operate/keys-wallets/celestia-app-wallet' },
          { text: 'DA node keys', link: '/operate/keys-wallets/celestia-node-key' },
          { text: 'Multisig accounts', link: '/operate/keys-wallets/multisig' },
          { text: 'Vesting accounts', link: '/operate/keys-wallets/vesting' },
        ],
      },
    ],
  },
})
