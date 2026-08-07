# Install the Blobstream binary

The [orchestrator](/operate/blobstream/orchestrator) is the software that signs the
Blobstream attestations, and the [relayer](/operate/blobstream/relayer) is the one that
relays them to the target EVM chain.

## Install

1. [Install Go](https://go.dev/doc/install) (1.21 or later)

2. Clone the `orchestrator-relayer` repository:

```bash
git clone https://github.com/celestiaorg/orchestrator-relayer.git
cd orchestrator-relayer
git checkout v1.2.0
```

3. Install the Blobstream CLI:

```bash
make install
```

## Usage

```bash
# Print help
blobstream --help
```

## How to run

If you are a Celestia-app validator, all you need to do is run the orchestrator. Check out [the Blobstream orchestrator page](/operate/blobstream/orchestrator) for more details.

If you want to post commitments on an EVM chain, you will need to deploy a new Blobstream contract and run a relayer. Check out [the Blobstream relayer page](/operate/blobstream/relayer) for relayer docs and [the Blobstream deployment page](/operate/blobstream/deploy-contract) for how to deploy a new Blobstream contract.

> **Note:** The Blobstream P2P network is a separate network from the consensus or the data availability one. Thus, you will need its specific bootstrappers to be able to connect to it.

## Contributing

### Tools

1. Install [golangci-lint](https://golangci-lint.run/docs/welcome/install/)
2. Install [markdownlint](https://github.com/DavidAnson/markdownlint)

### Helpful Commands

```bash
# Build a new orchestrator-relayer binary and output to build/blobstream
make build

# Run tests
make test

# Format code with linters (this assumes golangci-lint and markdownlint are installed)
make fmt
```

## Useful links

- The smart contract implementation is in [blobstream-contracts](https://github.com/celestiaorg/blobstream-contracts/)
- The state machine implementation is in [orchestrator-relayer](https://github.com/celestiaorg/orchestrator-relayer)
- Blobstream ADRs are in [the docs](https://github.com/celestiaorg/celestia-app/tree/main/docs/architecture)
- Blobstream design explained in [this blog post on layer 2s](https://blog.celestia.org/celestiums/)