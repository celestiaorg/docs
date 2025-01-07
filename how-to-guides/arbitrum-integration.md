---
description: An overview of the integration of Arbitrum Nitro with Celestia, detailing the key features and benefits, including the Ethereum fallback mechanism.
---

# Introduction to Arbitrum rollups with Celestia as DA

![Celestia_Arbitrum](/img/Celestia-Arbitrum.png)

## Overview

The
[integration of Celestia with Arbitrum Orbit](https://blog.celestia.org/celestia-is-first-modular-data-availability-network-to-integrate-with-arbitrum-orbit/)
and the Nitro tech stack marks the first external contribution to the Arbitrum
Orbit protocol layer, offering developers an additional option for selecting
a data availability layer alongside Arbitrum AnyTrust. The integration allows
developers to deploy an Orbit Chain that uses Celestia for data availability and
settles on Arbitrum One, Ethereum, or other EVM chains.

[Learn more about Orbit in Arbitrum's introduction.](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)

## Key components

The integration of Celestia with Arbitrum orbit is possible thanks to 3 key components:

- [Introduction to Arbitrum rollups with Celestia as DA](#introduction-to-arbitrum-rollups-with-celestia-as-da)
  - [Overview](#overview)
  - [Key components](#key-components)
    - [DA provider implementation](#da-provider-implementation)
    - [Preimage Oracle Implementation](#preimage-oracle-implementation)
    - [Blobstream X implementation](#blobstream-x-implementation)
    - [Ethereum fallback mechanism in Nitro](#ethereum-fallback-mechanism-in-nitro)
  - [Next steps](#next-steps)

Additionally, the [Ethereum fallback mechanism](#ethereum-fallback-mechanism-in-nitro) is a feature of the integration, which is native in Nitro.

### DA provider implementation

The Arbitrum Nitro code has a `DataAvailabilityProvider` interface that is used across the codebase to store and retrieve data from a specific provider (eip4844 blobs, Anytrust, and now Celestia).

This integration implements the [`DataAvailabilityProvider` interface for Celestia DA](https://github.com/celestiaorg/nitro/blob/966e631f1a03b49d49f25bea67a92b275d3bacb9/arbstate/inbox.go#L366-L477)

Additionally, this integration comes with
[the necessary code for a Nitro chain node to post and retrieve data from Celestia](https://github.com/celestiaorg/nitro/tree/v2.3.1-rc.1/das/celestia).

The core logic behind posting and retrieving data happens in [celestia.go](https://github.com/celestiaorg/nitro/blob/v2.3.1-rc.1/das/celestia/celestia.go) where data is stored on Celestia and serialized into a small batch of data that gets published once the necessary range of headers (data roots) has been relayed to the [BlobstreamX contract](https://github.com/succinctlabs/blobstreamx).
Then the `Read` logic takes care of taking the deserialized Blob Pointer struct and consuming it in order to fetch the data from Celestia and additionally inform the fetcher about the position of the data on Celestia (we'll get back to this in the next section).

The following represents a non-exhaustive list of considerations when running a Batch Poster node for a chain with Celestia underneath:
- You will need to use a consensus node RPC endpoint, you can
[find a list of them for Mocha](../how-to-guides/mocha-testnet#community-rpc-endpoints)
- The Batch Poster will only post a Celestia batch to the underlying chain if the height for which it posted is in a recent range in BlobstreamX and if the verification succeeds, otherwise it will discard the batch. Since it will wait until a range is relayed, it can take several minutes for a batch to be posted, but one can always make an on-chain request for the BlobstreamX contract to relay a header promptly.

The following represents a non-exhaustive list of considerations when running a Nitro node for a chain with Celestia underneath:
- The `TendermintRpc` endpoint is only needed by the batch poster, every other node can operate without a connection to a full node.
- The message header flag for Celestia batches is `0x0c`.
- You will need to know the namespace for the chain that you are trying to connect to, but don't worry if you don't find it, as the information in the BlobPointer can be used to identify where a batch of data is in the Celestia Data Square for a given height, and thus can be used to find out the namespace as well!

### Preimage Oracle Implementation

In order to support fraud proofs, this integration has the necessary code for a Nitro validator to populate its preimage mapping with Celestia hashes that then get "unpeeled" in order to reveal the full data for a Blob. You can
[read more about the "Hash Oracle Trick"](https://docs.arbitrum.io/inside-arbitrum-nitro/#readpreimage-and-the-hash-oracle-trick).

The data structures and hashing functions for this can be found in the [`nitro/das/celestia/tree` folder](https://github.com/celestiaorg/nitro/tree/v2.3.1-rc.1/das/celestia/tree)

You can see where the preimage oracle gets used in the fraud proof replay binary [here](https://github.com/celestiaorg/nitro/blob/966e631f1a03b49d49f25bea67a92b275d3bacb9/cmd/replay/main.go#L153-L294)

Something important to note is that the preimage oracle only keeps track of hashes for the rows in the Celestia data square in which a blob resides in, this way each Orbit chain with Celestia underneath does not need validators to recompute an entire Celestia Data Square, but instead, only have to compute the row roots for the rows in which it's data lives in, and the header data root, which is the binary merkle tree hash built using the row roots and column roots fetched from a Celestia node. Because only data roots that can be confirmed on Blobstream get accepted into the sequencer inbox, one can have a high degree of certainty that the canonical data root being unpeeled as well as the row roots are in fact correct.

### Blobstream X implementation

Finally, the integration only accepts batches with information that can be confirmed on BlobstreamX, which gives us a high certainty that data was made available on Celestia.

You can see how BlobstreamX is integrated into the `SequencerInbox.sol` contract [here](https://github.com/celestiaorg/nitro-contracts/blob/celestia-v1.2.1/src/bridge/SequencerInbox.sol#L584-L630), which allows us to discard batches with otherwise faulty data roots, thus giving us a high degree of confidence that the data root can be safely unpacked in case of a challenge.

The Celestia and Arbitrum integration also
[includes Blobstream](./blobstream.md),
which relays commitments to Celestia’s data root to an onchain light client
on Ethereum. This allows L2 solutions that settle on Ethereum to benefit
from the scalability Celestia’s data availability layer can provide.

### Ethereum fallback mechanism in Nitro

By default in [Arbitrum Nitro](https://github.com/OffchainLabs/nitro), the
[Ethereum fallback mechanism in the `BatchPoster` function](https://github.com/OffchainLabs/nitro/blob/d74229c5bcd592db7f6c7e37aa64375f53d2266d/arbnode/batch_poster.go#L1419~L1485)
is handling the process of storing data, with a fallback mechanism
to store data onchain if the primary data availability storage
fails.

The [@celestiaorg/nitro](https://github.com/celestiaorg/nitro) integration
[uses the same fallback mechanism](https://github.com/celestiaorg/nitro/blob/f01968eb3d4e19329e9c92b050e98a8e5772f1f2/arbnode/batch_poster.go#L845-L857).

[More information can be found on the Ethereum fallback mechanisms for Celestia](./ethereum-fallback.md),
which enables Ethereum L2s (or L3s) to “fall back” to using Ethereum
calldata for data availability in the event of downtime on Celestia Mainnet
Beta.

The fallback logic for Celestia DA is configurable, providing an alternative
to the previous default fallback mechanism. Additionally, an ability has been
added to the Arbitrum node software which allows the sequencer to call
`VerifyAttestation` to check if a data root has been posted on Blobstream or
not, before it sends the sequencer message (data pointer) to the underlying
chain.

## Next steps

In the next page,
[learn how to deploy an Arbitrum rollup devnet using Celestia as DA](./arbitrum-deploy.md).
