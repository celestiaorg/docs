---
description: An overview of the integration of Arbitrum Orbit with Celestia, detailing the key features and benefits, including the fallback mechanism to Anytrust and Ethereum.
---


# Arbitrum Orbit with Celestia DA

![Celestia_Arbitrum](/img/Celestia-Arbitrum.png)

## Overview

The
[integration of Celestia with Arbitrum Orbit](https://blog.celestia.org/celestia-is-first-modular-data-availability-network-to-integrate-with-arbitrum-orbit/)
and the Orbit stack marks the first external contribution to the Arbitrum
Orbit protocol layer, offering developers an additional option for selecting
a data availability layer alongside Arbitrum AnyTrust. The integration allows
developers to deploy an Orbit Chain that uses Celestia for data availability.

Learn more about Orbit in [Arbitrum's introduction](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction).

## Key components

The integration of Celestia with Arbitrum Orbit is possible thanks to 3 key components:

- [DA provider implementation](#da-provider-implementation)
- [Preimage Oracle Implementation](#preimage-oracle-implementation)
- [Blobstream integration](#blobstream-integration)

Additionally, the [fallback mechanism](#fallback-mechanism-in-nitro) is a feature of the integration, which is native in Nitro.

### DA provider implementation

The Arbitrum Nitro code has a set of `daprovider` interfaces to perform reads and writes for a given DA layer that are used across the codebase for EIP4844 Blobs, Anytrust, and Celestia DA.

This integration implements the [`reader`](https://github.com/celestiaorg/nitro/blob/v3.5.2/das/celestia/types/reader.go) and [`writer`](https://github.com/celestiaorg/nitro/blob/v3.5.2/das/celestia/types/writer.go) interfaces.

Additionally, the logic for reading, writing, and generating Celestia related proofs is moved to a sidecar [`celestia-server`](https://github.com/celestiaorg/nitro-das-celestia), which allows the Nitro node to request submissions and retrivals from a celestia node using an [`RPC client`](https://github.com/celestiaorg/nitro/blob/v3.5.2/das/celestia/celestiaDasRpcClient.go).

To run the Celestia server see the [nitro-das-celestia](https://github.com/celestiaorg/nitro-das-celestia) repository for more instructions.

### Preimage Oracle Implementation

In order to support fraud proofs, this integration has the necessary code for a Nitro validator to populate its preimage mapping with Celestia hashes that then get "unpeeled" in order to reveal the full data for a Blob. You can
[read more about the "Hash Oracle Trick"](https://docs.arbitrum.io/inside-arbitrum-nitro/#readpreimage-and-the-hash-oracle-trick).

The data structures and hashing functions for this can be found in the [`nitro/das/celestia/tree` directory](https://github.com/celestiaorg/nitro/tree/v3.5.2/das/celestia/tree)

You can [see where the preimage oracle gets used in the fraud proof replay binary](https://github.com/celestiaorg/nitro/blob/v3.5.2/cmd/replay/main.go#L163-L274).

### Blobstream integration

The integration ensures that in the case of a challenge in which the `ReadInboxMessage` instruction is disputed, that the corresponding batch can be confirmed to be in Celestia through the use of Blobstream (default is SP1 Blobstream by Succinct), which gives us strong security guarantees that the data was made available on Celestia.

### Fallback mechanism in Nitro

Arbitrum Nitro natively supports the ability to "fallback" to Ethereum DA in case that writing a batch to Anytrust is unsuccessful, the Celestia DA integration goes a step beyond, enabling [fallbacks from any dapwriter to another](https://github.com/celestiaorg/nitro/blob/v3.5.2/arbnode/batch_poster.go#L1419-L1451) by introducing a [da-preference](https://github.com/celestiaorg/nitro/blob/v3.5.2/arbnode/node.go#L106) parameter to the node which allows developers to specify in which order they would like to prioritize fallbacks, for example, `["celestia", "anytrust"]` indicates the batch poster to first write to celestia, on failure fallback to anytrust, and on failure fallback to ethereum da or `"celestia" -> "anytrust" -> "blobs / calldata"`

## Next steps

Follow the [quickstart](/how-to-guides/nitro-local.md) guide on the next page to run a local nitro chain with Nitro testnode.
