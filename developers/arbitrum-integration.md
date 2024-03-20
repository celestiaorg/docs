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

[Arbitrum Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
is a framework that enables the creation of customized, self-managed
Arbitrum Rollup and AnyTrust chains. Key highlights of Arbitrum Orbit
include:

1. **Creation of custom chains**: Orbit allows the creation of dedicated chains
   that settle to Arbitrum's Layer 2 chains (Arbitrum One, Nova, Goerli, Sepolia),
   with customizable features like throughput, privacy, gas token, and governance.
2. **Solving Ethereum's scalability**: Orbit addresses Ethereum's congestion
   and high demand for block space by enabling the creation of personal rollups,
   which offer scalable, secure alternatives to Ethereum's public chains.
3. **Decentralized application development**: Orbit chains provide dedicated
   throughput, EVM+ compatibility, independent roadmaps, and reliable gas prices
   enhancing the development and operation of decentralized apps.
4. **Benefits to the Ethereum ecosystem**: Orbit contributes to a multi-chain
   future for Ethereum, enhancing scalability, offering flexible security models,
   and enabling experimentation with execution environments and governance models.
5. **Versatility and interoperability**: Orbit chains can be used for a range
   of purposes, from hosting a single dApp to an ecosystem of dApps, with the
   capability to communicate with other Orbit chains.

## Key components

The integration of Celestia with Arbitrum orbit is possible thanks to 3 components:

- DA Provider Implementation
- Preimage Oracle
- Blobstream

## DA provider implementation

The Arbitrum Nitro code has a `DataAvailabilityProvider` interface that is used across the codebase to store and retrieve data from a specific provider (eip4844 blobs, Anytrust, and now Celestia).

This integration implements the [`DataAvailabilityProvider` interface for Celestia DA](https://github.com/celestiaorg/nitro/blob/966e631f1a03b49d49f25bea67a92b275d3bacb9/arbstate/inbox.go#L366-L477)

Additionally, this integrations comes with the necessary code for a Nitro chain node to post and retrieve data from Celestia, which can be found [here.](https://github.com/celestiaorg/nitro/tree/celestia-v2.3.1/das/celestia)

The core logic behind posting and retrieving data happens in [celestia.go](https://github.com/celestiaorg/nitro/blob/celestia-v2.3.1/das/celestia/celestia.go) where data is stored on Celestia and serialized into a small batch of data that gets published once the necessary range of headers (data roots) has been relayed to the [BlobstreamX contract](https://github.com/succinctlabs/blobstreamx).
Then the `Read` logic takes care of taking the deserialized Blob Pointer struct and consuming it in order to fetch the data from Celestia and additionally inform the fetcher about the position of the data on Celestia (we'll get back to this in the next section).

The following represents a non-exhaustive list of considerations when running a Batch Poster node for a chain with Celestia underneath:
- You will need to use a consensus full node RPC endpoint, you can find a list of them for Mocha [here](https://docs.celestia.org/nodes/mocha-testnet#rpc-endpoints)
- The Batch Poster will only post a Celestia batch to the underlying chain if the height for which it posted is in a recent range in BlobstreamX and if the verification succeeds, otherwise it will discard the batch. Since it will wait until a range is relayed, it can take several minutes for a batch to be posted, but one can always make an on-chain request for the BlobstreamX contract to relay a header promptly.

The following represents a non-exhaustive list of considerations when running a Nitro node for a chain with Celestia underneath:
- The `TendermintRpc` endpoint is only needed by the batch poster, every other node can operate without a connection to a full node.
- The message header flag for Celestia batches is `0x0c`.
- You will need to know the namespace for the chain that you are trying to connect to, but don't worry if you don't find it, as the information in the BlobPointer can be used to identify where a batch of data is in the Celestia Data Square for a given height, and thus can be used to find out the namespace as well!

## Preimage Oracle Implementation

In order to support fraud proofs, this integration has the necessary code for a Nitro validator to pupolate its preimage mapping with Celestia hashes that then get "unpealed" in order to reveal the full data for a Blob. You can read more about the "Hash Oracle Trick" [here.](https://docs.arbitrum.io/inside-arbitrum-nitro/#readpreimage-and-the-hash-oracle-trick)

The data structures and hashing functions for this can be found in the [`nitro/das/celestia/tree` folder](https://github.com/celestiaorg/nitro/tree/celestia-v2.3.1/das/celestia/tree)

You can see where the preimage oracle gets used in the fraud proof replay binary [here](https://github.com/celestiaorg/nitro/blob/966e631f1a03b49d49f25bea67a92b275d3bacb9/cmd/replay/main.go#L153-L294)

Something important to note is that the preimage oracle only keeps track of hashes for the rows in the Celestia data square in which a blob resides in, this way each Orbit chain with Celestia underneath does not need validators to recompute an entire Celestia Data Square, but instead, only have to compute the row roots for the rows in which it's data lives in, and the header data root, which is the binary merkle tree hash built using the row roots and column roots fetched from a Celestia node. Because only data roots that can be confirmed on Blobstream get accepted into the sequencer inbox, one can have a high degree of certainty that the canonical data root being unpealed as well as the row roots are in fact correct.

## Blobstream X implementation


Finally, the integration only accepts batches with information that can be confirmed on BlobstreamX, which gives us a high certainty that data was made available on Celestia.

You can see how BlobstreamX is integrated into the `SequencerInbox.sol` contract [here](https://github.com/celestiaorg/nitro-contracts/blob/celestia-v1.2.1/src/bridge/SequencerInbox.sol#L584-L630), which allows us to discard batches with otherwise faulty data roots, thus giving us a high degree of confidence that the data root can be safely unpacked in case of a challenge.

The Celestia and Arbitrum integration also
[includes Blobstream](./blobstream.md),
which relays commitments to Celestia’s data root to an onchain light client
on Ethereum. This allows L2 solutions that settle on Ethereum to benefit
from the scalability Celestia’s data availability layer can provide.

## Old infos

Note that the data above is the bytes serialized version of this struct in Go:

```go
type BlobPointer struct {
   BlockHeight    uint64
   Start          uint64
   SharesLength   uint64
   Key            uint64
   NumLeaves      uint64
   TupleRootNonce uint64
   TxCommitment [32]byte
   DataRoot     [32]byte
   SideNodes    [][32]byte
}
```

### Ethereum fallback mechanism in Nitro

Another feature of this integration is the
[Ethereum fallback mechanism](./ethereum-fallback.md),
which enables Ethereum L2s (or L3s) to “fall back” to using Ethereum
calldata for data availability in the event of downtime on Celestia Mainnet
Beta.

In the case of Celestia downtime or temporary unavailability, L2s can
fallback to posting transactions as calldata on Ethereum or another DA
layer for data availability instead of posting to Celestia. This mechanism
ensures users can continue to transact securely and seamlessly, preventing
disruptions and helping to ensure user funds do not get stuck in the L2's
bridge on Ethereum. This feature is available for the
[Arbitrum Orbit integration](./ethereum-fallback.md#arbitrum).

By default in [Arbitrum Nitro](https://github.com/OffchainLabs/nitro), the
[Ethereum fallback mechanism in the `BatchPoster` function](https://github.com/OffchainLabs/nitro/blob/master/arbnode/batch_poster.go#L989-L1001)
is handling the process of storing data, with a fallback mechanism
to store data onchain if the primary data availability storage
fails.

The [@celestiaorg/nitro](https://github.com/celestiaorg/nitro) integration
[uses the same fallback mechanism](https://github.com/celestiaorg/nitro/blob/f01968eb3d4e19329e9c92b050e98a8e5772f1f2/arbnode/batch_poster.go#L845-L857).

The fallback logic for Celestia DA is configurable, providing an alternative
to the previous default fallback mechanism. Additionally, an ability has been
added to the Arbitrum node software which allows the sequencer to call
`VerifyAttestation` to check if a data root has been posted on Blobstream or
not, before it sends the sequencer message (data pointer) to the underlying
chain.

## Next steps

In the next page,
[learn how to deploy an Arbitrum rollup devnet using Celestia as DA](./arbitrum-deploy.md).
