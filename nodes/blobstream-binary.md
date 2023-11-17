---
description: This guide shows you how to install the Blobstream binary.
---

# Blobstream for validators

[Blobstream](https://blog.celestia.org/introducing-blobstream/)
allows Ethereum developers to build high-throughput L2s using Celestia,
the first data availability layer with Data Availability Sampling.

This page and following tutorials will go over Blobstream and how validators
on Celestia can run it.

If you're looking to learn more, you can view
[the `orchestrator-relayer` repository](https://github.com/celestiaorg/orchestrator-relayer)
or [read more about how Blobstream works](../developers/blobstream.md#overview).

## Install the Blobstream binary

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

The [orchestrator](./blobstream-orchestrator.md) is the software that signs the
Blobstream attestations, and the [relayer](./blobstream-relayer.md) is the one that
relays them to the target EVM chain.

The following sections in this category presume you have the following setup:

- A celestia-app
  [validator node](./consensus-node.md#optional-setting-up-a-validator) running

### Install

1. [Install Go](https://go.dev/doc/install) {{constants.golangBlobstream}}

2. Clone the `https://github.com/celestiaorg/orchestrator-relayer` repository:

   ```bash-vue
   git clone https://github.com/celestiaorg/orchestrator-relayer.git
   cd orchestrator-relayer
   git checkout {{constants.orchrelayVersion}}
   ```

3. Install the Blobstream CLI

   ```sh
   make install
   ```

### Usage

```sh
# Print help
blobstream --help
```

### Next steps

1. If you are a Celestia validator, all you need to do is run the
   orchestrator. Check out
   [the Blobstream orchestrator page](./blobstream-orchestrator.md) for more details.
2. [Key management](./blobstream-keys.md)
3. Optional: If you want to post commitments on an EVM chain, you will need to deploy
   a new Blobstream contract and run a relayer. Check out
   [the Blobstream relayer page](./blobstream-relayer.md) for
   relayer docs and [the Blobstream deployment page](./blobstream-deploy.md) for
   how to deploy a new Blobstream contract.

:::tip
The Blobstream P2P network is a separate network than the consensus or
the data availability one. Thus, you will need its specific
bootstrappers to be able to connect to it.
:::

### Useful links

The smart contract implementation is in [blobstream](https://github.com/celestiaorg/blobstream-contracts/).

The state machine implementation is in [x/blobstream](https://github.com/celestiaorg/celestia-app/tree/main/x/blobstream).

Blobstream ADRs are in [the docs](https://github.com/celestiaorg/celestia-app/tree/main/docs/architecture).

Blobstream design explained in [this blog post on layer 2s](https://blog.celestia.org/celestiums/).
