# Node snapshots

## What are node snapshots?

Node snapshots are pre-synced copies of the blockchain state that allow you to get your node up and running quickly without having to sync from genesis. Think of them as checkpoints - instead of processing every single block since the beginning of the chain, you can start from a recent, verified state.

Among various options for setting up your node, snapshots offer one of the fastest ways to get started. Instead of syncing the entire chain history from the beginning, you can use a snapshot to start from a recent state.

Using snapshots can save you significant time and resources, especially as the blockchain grows larger.

## Pruned vs archive snapshots

There are two main types of snapshots available:

### Pruned snapshots

Pruned snapshots contain only the essential state needed to run a node. They exclude historical data that isn't necessary for current operations, making them much smaller in size. These are ideal for:

- Consensus nodes (including validators) that only need recent state to participate in consensus
- Consensus nodes that don't need complete historical data
- Users who want to get started quickly and aren't concerned with historical queries

### Archive snapshots

Archive snapshots contain the complete blockchain history, including all historical states. They're larger in size but provide access to the entire chain history. You'll need an archive snapshot if you're:

- Running a DA node that needs to serve historical block data
- Operating a consensus node that needs to support historical queries
- Building an application that requires access to past states

## Quick setup with ITRocket

ITRocket provides comprehensive setup services for both mainnet and testnet, including automated installation scripts, snapshots, and state sync services:

- **Mainnet**: [itrocket.net/services/mainnet/celestia/](https://itrocket.net/services/mainnet/celestia/) - Complete setup guides and tools
- **Mocha testnet**: [itrocket.net/services/testnet/celestia/](https://itrocket.net/services/testnet/celestia/) - Complete setup guides and tools

Their services include installation scripts, state sync, snapshots, RPC endpoints, and monitoring tools all in one place.

## Available snapshot providers

### Mainnet beta

| Provider    | Consensus Node                                                                                                                                 | Bridge Node                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ITRocket    | [Pruned](https://itrocket.net/services/mainnet/celestia/) • [Archive](https://itrocket.net/services/mainnet/celestia/)                         | [Archive](https://itrocket.net/services/mainnet/celestia/)                 |
| Polkachu    | [Pruned](https://polkachu.com/tendermint_snapshots/celestia)                                                                                   | -                                                                          |
| kjnodes     | [Pruned](https://services.kjnodes.com/mainnet/celestia/snapshot/) • [Archive](https://services.kjnodes.com/mainnet/celestia/snapshot-archive/) | -                                                                          |
| TTT         | [Pruned](https://services.tienthuattoan.com/mainnet/celestia/snapshot)                                                                         | -                                                                          |
| Noders      | [Pruned](https://noders.services/mainnet-networks/celestia/snapshot/)                                                                          | -                                                                          |
| QubeLabs    | [Archive](https://snaps.qubelabs.io/celestia/)                                                                                                 | -                                                                          |

### Mocha testnet

| Provider    | Consensus Node                                                                                                         | Bridge Node                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ITRocket    | [Pruned](https://itrocket.net/services/testnet/celestia/) • [Archive](https://itrocket.net/services/testnet/celestia/) | [Archive](https://itrocket.net/services/testnet/celestia/)                 |
| Polkachu    | [Pruned](https://polkachu.com/testnets/celestia/snapshots)                                                             | -                                                                          |
| kjnodes     | [Pruned](https://services.kjnodes.com/testnet/celestia/snapshot/)                                                      | -                                                                          |
| Noders      | [Pruned](https://noders.services/testnet-networks/celestia/snapshot)                                                   | -                                                                          |
| QubeLabs    | [Archive](https://snaps.qubelabs.io/celestia/)                                                                         | -                                                                          |

## Using celestia-snapshot-finder

The `celestia-snapshot-finder` is a community tool that automatically finds and downloads the fastest available snapshot for your node. It tests download speeds from verified providers and selects the fastest available snapshot based on your location and network conditions.

### Features

- Automatically finds the optimal snapshot from verified providers
- Selects the best option based on file size and download speed
- Supports both consensus and bridge nodes (pruned and archive snapshots)
- Available for multiple platforms (Linux, macOS) with ARM and AMD64 support
- Includes download progress tracking and resume capability

### Installation

You can download pre-built binaries from the [latest release](https://github.com/21state/celestia-snapshot-finder/releases/latest) page:

- Linux: `celestia-snapshot-finder-linux-amd64` or `celestia-snapshot-finder-linux-arm64`
- macOS: `celestia-snapshot-finder-darwin-amd64` or `celestia-snapshot-finder-darwin-arm64`

Or build from source:

```bash
git clone https://github.com/21state/celestia-snapshot-finder.git
cd celestia-snapshot-finder
./build.sh
```

### Usage examples

A CLI tool for downloading Celestia node snapshots with direct URLs. Supports different node types and snapshot types with automatic or manual selection.

Basic usage:

```bash
celestia-snapshot-finder [node-type] [snapshot-type] [flags]
```

Examples:

```bash
# Download pruned consensus node snapshot
celestia-snapshot-finder consensus pruned

# Download archive bridge node snapshot with manual selection
celestia-snapshot-finder bridge archive --manual
```

Available flags:

```bash
  -n, --chain-id string   Chain ID (default "celestia")
      --debug             Enable debug mode with extra information
  -h, --help              help for celestia-snapshot-finder
  -m, --manual            Enable manual selection
  -v, --version           version for celestia-snapshot-finder
```

In automatic mode (default), the tool will:

1. Test download speeds and verify snapshots from all providers
2. Automatically select and use the fastest available option
3. Start downloading from the selected provider

In manual mode (`--manual` flag), the tool will:

1. Test download speeds and verify snapshots from all providers
2. Show you a list of providers with their download speed, snapshot size, and estimated download time
3. Let you select your preferred provider from the list
4. Start downloading from your selected provider