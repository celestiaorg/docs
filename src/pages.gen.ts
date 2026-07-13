// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/build/blobstream/integrate-contracts'; render: 'static' }
  | { path: '/build/blobstream/integrate-offchain'; render: 'static' }
  | { path: '/build/blobstream/proof-queries'; render: 'static' }
  | { path: '/build/post-retrieve-blob/client/go'; render: 'static' }
  | { path: '/build/post-retrieve-blob/client/rust'; render: 'static' }
  | { path: '/build/post-retrieve-blob/overview'; render: 'static' }
  | { path: '/build/private-blockspace/about'; render: 'static' }
  | { path: '/build/private-blockspace/quickstart'; render: 'static' }
  | { path: '/build/rpc/clients'; render: 'static' }
  | { path: '/build/rpc/components/CopyIcon'; render: 'static' }
  | { path: '/build/rpc/components/NodeAPIContent'; render: 'static' }
  | { path: '/build/rpc/components/NotificationModal'; render: 'static' }
  | { path: '/build/rpc/components/ParamModal'; render: 'static' }
  | { path: '/build/rpc/components/Playground'; render: 'static' }
  | { path: '/build/rpc/components/RPCMethod'; render: 'static' }
  | { path: '/build/rpc/node-api'; render: 'static' }
  | { path: '/build/stacks/nitro-das-server'; render: 'static' }
  | { path: '/build/stacks/op-alt-da/aws-kms-guide'; render: 'static' }
  | { path: '/build/stacks/op-alt-da/introduction'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/learn/TIA/overview'; render: 'static' }
  | { path: '/learn/TIA/paying-for-blobspace'; render: 'static' }
  | { path: '/learn/TIA/staking'; render: 'static' }
  | { path: '/learn/TIA/staking-governance-supply'; render: 'static' }
  | { path: '/learn/TIA/submit-data'; render: 'static' }
  | { path: '/learn/audits'; render: 'static' }
  | { path: '/learn/blobstream'; render: 'static' }
  | { path: '/learn/celestia-101/data-availability'; render: 'static' }
  | { path: '/learn/celestia-101/data-availability-faq'; render: 'static' }
  | { path: '/learn/celestia-101/resources'; render: 'static' }
  | { path: '/learn/celestia-101/retrievability'; render: 'static' }
  | { path: '/learn/celestia-101/transaction-lifecycle'; render: 'static' }
  | { path: '/learn/code-of-conduct'; render: 'static' }
  | { path: '/learn/features/bridging/hyperlane'; render: 'static' }
  | { path: '/learn/features/bridging/ibc'; render: 'static' }
  | { path: '/learn/features/private-blockspace'; render: 'static' }
  | { path: '/operate/blobstream/deploy-contract'; render: 'static' }
  | { path: '/operate/blobstream/install-binary'; render: 'static' }
  | { path: '/operate/blobstream/key-management'; render: 'static' }
  | { path: '/operate/blobstream/orchestrator'; render: 'static' }
  | { path: '/operate/blobstream/relayer'; render: 'static' }
  | { path: '/operate/consensus-validators/cli-reference'; render: 'static' }
  | { path: '/operate/consensus-validators/consensus-node'; render: 'static' }
  | { path: '/operate/consensus-validators/foundation-delegation-program'; render: 'static' }
  | { path: '/operate/consensus-validators/install-celestia-app'; render: 'static' }
  | { path: '/operate/consensus-validators/metrics'; render: 'static' }
  | { path: '/operate/consensus-validators/slashing'; render: 'static' }
  | { path: '/operate/consensus-validators/upgrade-monitor'; render: 'static' }
  | { path: '/operate/consensus-validators/validator-node'; render: 'static' }
  | { path: '/operate/data-availability/bridge-node'; render: 'static' }
  | { path: '/operate/data-availability/config-reference'; render: 'static' }
  | { path: '/operate/data-availability/custom-networks'; render: 'static' }
  | { path: '/operate/data-availability/ibc-relayer'; render: 'static' }
  | { path: '/operate/data-availability/install-celestia-node'; render: 'static' }
  | { path: '/operate/data-availability/light-node/advanced'; render: 'static' }
  | { path: '/operate/data-availability/light-node/quickstart'; render: 'static' }
  | { path: '/operate/data-availability/metrics'; render: 'static' }
  | { path: '/operate/data-availability/storage-optimization'; render: 'static' }
  | { path: '/operate/getting-started/docker'; render: 'static' }
  | { path: '/operate/getting-started/environment-setup'; render: 'static' }
  | { path: '/operate/getting-started/hardware-requirements'; render: 'static' }
  | { path: '/operate/getting-started/overview'; render: 'static' }
  | { path: '/operate'; render: 'static' }
  | { path: '/operate/keys-wallets/celestia-app-wallet'; render: 'static' }
  | { path: '/operate/keys-wallets/celestia-node-key'; render: 'static' }
  | { path: '/operate/keys-wallets/multisig'; render: 'static' }
  | { path: '/operate/keys-wallets/vesting'; render: 'static' }
  | { path: '/operate/maintenance/datastore-structure'; render: 'static' }
  | { path: '/operate/maintenance/network-upgrades'; render: 'static' }
  | { path: '/operate/maintenance/snapshots'; render: 'static' }
  | { path: '/operate/maintenance/systemd'; render: 'static' }
  | { path: '/operate/maintenance/troubleshooting'; render: 'static' }
  | { path: '/operate/maintenance/trusted-hash-recovery'; render: 'static' }
  | { path: '/operate/networks/arabica-devnet'; render: 'static' }
  | { path: '/operate/networks/local-devnet'; render: 'static' }
  | { path: '/operate/networks/mainnet-beta'; render: 'static' }
  | { path: '/operate/networks/mocha-testnet'; render: 'static' }
  | { path: '/operate/networks/overview'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
