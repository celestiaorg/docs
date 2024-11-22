---
description: The DA fallback mechanism to Ethereum for rollups.
next:
  text: "Blobstream rollups"
  link: "/how-to-guides/blobstream-rollups"
prev:
  text: "Run an OP Stack devnet posting Celestia"
  link: "/how-to-guides/optimism"
---

# Ethereum fallback

Ethereum fallback is a mechanism
that enables Ethereum L2s (or L3s) to “fallback” to using Ethereum
calldata for data availability in the event of downtime on Celestia
Mainnet Beta. This feature is currently supported by Celestia integrations
with:

- [Arbitrum Nitro](./arbitrum-integration.md#ethereum-fallback-mechanism-in-nitro)

In the case of Celestia downtime or temporary unavailability, L2s can
fallback to posting transactions as calldata on Ethereum or another DA
layer for data availability instead of posting to Celestia. This
mechanism ensures users can continue to transact securely and seamlessly,
preventing disruptions and helping to ensure user funds do not get stuck
in the L2's bridge on Ethereum.

Ethereum fallback is triggered whenever the sequencer has an error
sending the `PayForBlobs` transaction on Celestia. Fallback can be
triggered due to a congested mempool or nonce error and can be simulated
with an error such as low balance or incorrect sequence. Fallback
can also be triggered in the event Blobstream stops relaying attestations.

![Ethereum fallback](/img/Celestia_ethereum-fallback.jpg)
