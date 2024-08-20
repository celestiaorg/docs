---
description: Overview of the Celestia hardfork process.
---

# Celestia hardfork process

Blockchain networks often times need to upgrade with new features
which require coordination work among the validators prior to activating
the upgrades.

This process is called a hardfork or a network upgrade. In those events,
the Celestia Labs team will be coordinating with the validators on
what they need to do in order to be ready for an upcoming hardfork.

Hardforks are not backward-compatible with older versions of the network
software which is why it is important that validators upgrade their software
to continue validating on the network after the network upgrades.

## General process

The general process can be broken down into several components:

- Hardfork specifications and features (defined by description of features
  and code implementation of those features).
- Binary used to add those features (a new binary release with those features
  will be provided by Celestia team in order for validators to upgrade
  their nodes to the new binary).
- A block number for when the network upgrades (even if validators upgrade
  their binary to be hardfork ready, the network upgrade does not happen right
  away, but some short time in the future at a specific block number).
- Testing of the features (happens on testnets first prior to activating on
  mainnet in order to ensure the network can upgrade securely).

The two testnets where hardforks are deployed are:

- [Arabica devnet](./arabica-devnet.md)
- [Mocha testnet](./mocha-testnet.md)

### Lemongrass hardfork

The Lemongrass hardfork is the first consensus layer breaking change since Celestia's Mainnet Beta genesis block. The Lemongrass hardfork includes all of the CIPs listed in [CIP-17](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-17.md). The Lemongrass hardfork will be executed on Arabica, then Mocha, then Mainnet Beta. The hardfork will take place at an "upgrade height" that will be coordinated offline on a per-network basis. The upgrade heights will be announced in advance (see [Network upgrades](./participate#network-upgrades)) to give node operators time to download and start a compatible binary prior to the upgrade height.

- If you are a consensus node or validator operator: you will need to download and run a celestia-app binary >= v2.0.0 prior to the `--v2-upgrade-height` to remain on the canonical chain. You do not need to use a tool like [cosmovisor](https://docs.cosmos.network/main/build/tooling/cosmovisor) to upgrade the binary at the upgrade height.
- If you are a DA node operator, you will need to download and run a compatible celestia-node binary >= v0.16.0-rc0 prior to the upgrade height.

Network      | Chain ID   | Datetime                                 | `--v2-upgrade-height`
-------------|------------|------------------------------------------|----------------------
Arabica      | arabica-11 | 2024/08/19 @ 14:00 UTC                   | 1751707
Mocha        | mocha-4    | 2024/08/28 @ 14:00 UTC                   | 2585031
Mainnet Beta | celestia   | TBD approximately 2024/09/18 @ 14:00 UTC | TBD
