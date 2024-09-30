---
description: Overview of the Celestia network upgrade process.
---

# Celestia network upgrade process

Blockchain networks often times need to upgrade with new features
which require coordination work among the validators prior to activating
the upgrades.

This process is called a network upgrade, which can be breaking or non-breaking.
During planned network upgrades, the Celestia Labs team will coordinate
with the validators to prepare for the upcoming network upgrade.

Breaking network upgrades are not backward-compatible with older versions of the network
software which is why it is important that validators upgrade their software
to continue validating on the network after the network upgrades.

Non-breaking network upgrades are backward-compatible and require less coordination.

## General process

The general process can be broken down into several components:

- Network upgrade specifications and features (defined by description of features
  and code implementation of those features).
- Binary used to add those features. A new binary release with those features
  will be provided by Celestia Labs team in order for validators to upgrade
  their nodes to the new binary.
- A block number for when the breaking network upgrade. Even if validators upgrade
  their binary to be network upgrade ready, the network upgrade does not happen right
  away, but some short time in the future at a specific block number.
- Testing of the features, which happens on testnets first prior to activating on
  Mainnet Beta in order to ensure the network can upgrade securely.

The two testnets where network upgrades are deployed are:

- [Arabica devnet](./arabica-devnet.md)
- [Mocha testnet](./mocha-testnet.md)

### Lemongrass network upgrade

The Lemongrass network upgrade is the first consensus layer breaking change since Celestia's Mainnet Beta genesis block. The Lemongrass network upgrade includes all of the CIPs listed in [CIP-17](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-17.md). The Lemongrass network upgrade will be executed on Arabica, then Mocha, then Mainnet Beta. The network upgrade will take place at an "upgrade height" that will be coordinated offline on a per-network basis. The upgrade heights will be announced in advance (see [network upgrades channels](./participate#network-upgrades)) to give node operators time to download and start a compatible binary prior to the upgrade height.

- If you are a consensus node or validator operator: you will need to download and run a celestia-app binary >= v2.0.0 prior to the `--v2-upgrade-height` to remain on the canonical chain.
- If you are a DA node operator, you will need to download and run a compatible celestia-node binary >= v0.16.0-rc0 prior to the upgrade height.

Network      | Chain ID   | Date and approximate time                | `--v2-upgrade-height`
-------------|------------|------------------------------------------|----------------------
Arabica      | arabica-11 | 2024/08/19 @ 14:00 UTC                   | 1751707
Mocha        | mocha-4    | 2024/08/28 @ 14:00 UTC                   | 2585031
Mainnet Beta | celestia   | 2024/09/18 @ 14:00 UTC                   | 2371495

:::warning

You do not need to use a tool like [cosmovisor](https://docs.cosmos.network/main/build/tooling/cosmovisor) to upgrade the binary at the upgrade height. Please upgrade your binary several blocks before the upgrade height.

:::
