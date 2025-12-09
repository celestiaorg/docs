#!/usr/bin/env node

import { promises as fs } from 'fs';

const RAW_BASE = 'https://raw.githubusercontent.com/celestiaorg/docs/main/';

const header = [
  '# Celestia documentation',
  '',
  '> Official documentation for Celestia, the modular data availability network for building scalable, sovereign rollups and applications.',
  '',
  'These docs are built with Next.js + Nextra and exported statically. Links below point to the raw MDX sources in `main` so tools and LLMs can ingest clean text.',
];

const sections = [
  {
    title: 'Learn: Celestia 101',
    items: [
      { path: 'app/learn/celestia-101/data-availability/page.mdx', title: 'Data availability primer', desc: "Celestia\'s modular data availability model and blob format." },
      { path: 'app/learn/celestia-101/data-availability-faq/page.mdx', title: 'Data availability FAQ', desc: 'Common questions on sampling, erasure coding, and blobs.' },
      { path: 'app/learn/celestia-101/retrievability/page.mdx', title: 'Retrievability', desc: 'How light, full, and bridge nodes retrieve data.' },
      { path: 'app/learn/celestia-101/transaction-lifecycle/page.mdx', title: 'Transaction lifecycle', desc: 'End-to-end path for Celestia transactions.' },
      { path: 'app/learn/celestia-101/resources/page.mdx', title: 'Resources', desc: 'Additional reading and community links.' },
    ],
  },
  {
    title: 'Learn: Features',
    items: [
      { path: 'app/learn/features/private-blockspace/page.mdx', title: 'Private blockspace', desc: 'Overview of private rollups using Celestia DA.' },
      { path: 'app/learn/features/bridging/ibc/page.mdx', title: 'Bridging with IBC', desc: 'IBC bridge architecture and flows.' },
      { path: 'app/learn/features/bridging/hyperlane/page.mdx', title: 'Bridging with Hyperlane', desc: 'Using Hyperlane to connect rollups.' },
    ],
  },
  {
    title: 'Learn: TIA',
    items: [
      { path: 'app/learn/TIA/overview/page.mdx', title: 'TIA overview', desc: 'Token utility and economics.' },
      { path: 'app/learn/TIA/paying-for-blobspace/page.mdx', title: 'Paying for blobspace', desc: 'How fees work for DA.' },
      { path: 'app/learn/TIA/submit-data/page.mdx', title: 'Submit data', desc: 'Steps to post data to Celestia.' },
      { path: 'app/learn/TIA/staking/page.mdx', title: 'Staking', desc: 'Delegation and rewards.' },
      { path: 'app/learn/TIA/staking-governance-supply/page.mdx', title: 'Staking, governance, supply', desc: 'Token supply, governance, and slashing considerations.' },
    ],
  },
  {
    title: 'Build',
    items: [
      { path: 'app/build/post-retrieve-blob/overview/page.mdx', title: 'Post/retrieve blob overview', desc: 'Entry point for writing and fetching blobs.' },
      { path: 'app/build/post-retrieve-blob/light-node/quickstart/page.mdx', title: 'Light node quickstart', desc: 'Quick blob workflow on a light node.' },
      { path: 'app/build/post-retrieve-blob/light-node/advanced/page.mdx', title: 'Light node advanced', desc: 'Advanced blob posting and retrieval patterns.' },
      { path: 'app/build/post-retrieve-blob/client/go/page.mdx', title: 'Go client', desc: 'Go examples for blob operations.' },
      { path: 'app/build/post-retrieve-blob/client/rust/page.mdx', title: 'Rust client', desc: 'Rust examples for blob operations.' },
      { path: 'app/build/rpc/node-api/page.mdx', title: 'Node RPC API', desc: 'RPC methods, params, and responses.' },
      { path: 'app/build/rpc/clients/page.mdx', title: 'Client libraries', desc: 'Supported SDKs and setup.' },
      { path: 'app/build/private-blockspace/about/page.mdx', title: 'Private blockspace about', desc: 'What private blockspace provides.' },
      { path: 'app/build/private-blockspace/quickstart/page.mdx', title: 'Private blockspace quickstart', desc: 'Launching a private rollup.' },
      { path: 'app/build/stacks/op-alt-da/page.mdx', title: 'Stack: op-alt-da', desc: 'OP stack with Celestia DA.' },
      { path: 'app/build/stacks/nitro-das-server/page.mdx', title: 'Stack: nitro-das-server', desc: 'Nitro DA server setup.' },
    ],
  },
  {
    title: 'Operate: Getting started',
    items: [
      { path: 'app/operate/getting-started/overview/page.mdx', title: 'Overview', desc: 'Operator prerequisites and workflow.' },
      { path: 'app/operate/getting-started/hardware-requirements/page.mdx', title: 'Hardware requirements', desc: 'Recommended specs by node type.' },
      { path: 'app/operate/getting-started/environment-setup/page.mdx', title: 'Environment setup', desc: 'Tooling and dependencies.' },
      { path: 'app/operate/getting-started/docker/page.mdx', title: 'Docker', desc: 'Containerized setup.' },
    ],
  },
  {
    title: 'Operate: Data availability nodes',
    items: [
      { path: 'app/operate/data-availability/install-celestia-node/page.mdx', title: 'Install celestia-node', desc: 'Installation steps.' },
      { path: 'app/operate/data-availability/light-node/page.mdx', title: 'Light node', desc: 'Running and monitoring a light node.' },
      { path: 'app/operate/data-availability/bridge-node/page.mdx', title: 'Bridge node', desc: 'Bridge node setup and responsibilities.' },
      { path: 'app/operate/data-availability/custom-networks/page.mdx', title: 'Custom networks', desc: 'Connecting to non-default networks.' },
      { path: 'app/operate/data-availability/config-reference/page.mdx', title: 'Config reference', desc: 'Node configuration options and defaults.' },
      { path: 'app/operate/data-availability/metrics/page.mdx', title: 'Metrics', desc: 'Telemetry endpoints and key signals.' },
      { path: 'app/operate/data-availability/storage-optimization/page.mdx', title: 'Storage optimization', desc: 'Pruning and storage tuning.' },
    ],
  },
  {
    title: 'Operate: Consensus validators',
    items: [
      { path: 'app/operate/consensus-validators/install-celestia-app/page.mdx', title: 'Install celestia-app', desc: 'Installing the consensus client.' },
      { path: 'app/operate/consensus-validators/validator-node/page.mdx', title: 'Validator node', desc: 'Running a validator.' },
      { path: 'app/operate/consensus-validators/consensus-node/page.mdx', title: 'Consensus node', desc: 'Non-validator consensus nodes.' },
      { path: 'app/operate/consensus-validators/cli-reference/page.mdx', title: 'CLI reference', desc: 'celestia-app CLI commands and flags.' },
      { path: 'app/operate/consensus-validators/slashing/page.mdx', title: 'Slashing', desc: 'Conditions and prevention.' },
      { path: 'app/operate/consensus-validators/upgrade-monitor/page.mdx', title: 'Upgrade monitor', desc: 'Tracking network upgrades.' },
      { path: 'app/operate/consensus-validators/metrics/page.mdx', title: 'Metrics', desc: 'Validator observability.' },
    ],
  },
  {
    title: 'Operate: Keys and wallets',
    items: [
      { path: 'app/operate/keys-wallets/celestia-app-wallet/page.mdx', title: 'Celestia app wallet', desc: 'Wallet management.' },
      { path: 'app/operate/keys-wallets/celestia-node-key/page.mdx', title: 'Celestia node key', desc: 'Node key handling.' },
      { path: 'app/operate/keys-wallets/multisig/page.mdx', title: 'Multisig', desc: 'Multisig setup.' },
      { path: 'app/operate/keys-wallets/vesting/page.mdx', title: 'Vesting', desc: 'Vesting accounts.' },
    ],
  },
  {
    title: 'Operate: Maintenance',
    items: [
      { path: 'app/operate/maintenance/network-upgrades/page.mdx', title: 'Network upgrades', desc: 'Upgrade procedures.' },
      { path: 'app/operate/maintenance/snapshots/page.mdx', title: 'Snapshots', desc: 'Restoring from community snapshots.' },
      { path: 'app/operate/maintenance/systemd/page.mdx', title: 'Systemd', desc: 'Service management.' },
      { path: 'app/operate/maintenance/datastore-structure/page.mdx', title: 'Datastore structure', desc: 'Node data layout.' },
      { path: 'app/operate/maintenance/trusted-hash-recovery/page.mdx', title: 'Trusted hash recovery', desc: 'Recovering trusted hashes.' },
      { path: 'app/operate/maintenance/troubleshooting/page.mdx', title: 'Troubleshooting', desc: 'Common operational fixes.' },
    ],
  },
  {
    title: 'Operate: Optional services',
    items: [
      { path: 'app/operate/optional-services/audits/page.mdx', title: 'Audits', desc: 'Audit service integration.' },
      { path: 'app/operate/optional-services/ibc-relayer/page.mdx', title: 'IBC relayer', desc: 'Running a relayer.' },
      { path: 'app/operate/optional-services/instantiate-testnet/page.mdx', title: 'Instantiate testnet', desc: 'Spinning up a testnet.' },
    ],
  },
  {
    title: 'Networks',
    items: [
      { path: 'app/operate/networks/overview/page.mdx', title: 'Network overview', desc: 'Network matrix and roles.' },
      { path: 'app/operate/networks/mainnet-beta/page.mdx', title: 'Mainnet beta', desc: 'Endpoints and config for mainnet-beta.' },
      { path: 'app/operate/networks/mocha-testnet/page.mdx', title: 'Mocha testnet', desc: 'Mocha testnet participation details.' },
      { path: 'app/operate/networks/arabica-devnet/page.mdx', title: 'Arabica devnet', desc: 'Devnet access and reset cadence.' },
      { path: 'app/operate/networks/local-devnet/page.mdx', title: 'Local devnet', desc: 'Running a local network for testing.' },
    ],
  },
  {
    title: 'Optional',
    items: [
      { path: 'app/operate/data-availability/storage-optimization/page.mdx', title: 'Storage optimization', desc: 'Extra tuning for storage footprint.' },
      { path: 'app/build/post-retrieve-blob/light-node/advanced/page.mdx', title: 'Advanced light node', desc: 'Deeper blob workflows (can skip for short contexts).' },
    ],
  },
];

const formatItem = ({ path, title, desc }) => {
  const url = `${RAW_BASE}${path}`;
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
};

const fileExists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const buildSection = (section, existingPaths) => {
  const lines = [];
  const kept = section.items.filter((item) => existingPaths.has(item.path));
  if (!kept.length) return lines;
  lines.push(`## ${section.title}`, '');
  kept.forEach((item) => lines.push(formatItem(item)));
  lines.push('');
  return lines;
};

const main = async () => {
  const existing = new Set(
    await Promise.all(
      sections.flatMap((s) => s.items.map((i) => i.path)).map(async (p) => {
        const ok = await fileExists(p);
        if (!ok) {
          console.warn(`Skipping missing file: ${p}`);
          return null;
        }
        return p;
      })
    ).then((paths) => paths.filter(Boolean))
  );

  const lines = [...header, ''];
  sections.forEach((section) => lines.push(...buildSection(section, existing)));

  const output = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  // Write to repo root for developers and to public/ so it gets published with static export.
  await fs.writeFile('llms.txt', output, 'utf8');
  await fs.mkdir('public', { recursive: true });
  await fs.writeFile('public/llms.txt', output, 'utf8');

  console.log('llms.txt generated (root and public/)');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
