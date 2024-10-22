---
description: Overview of the Celestia network upgrade process.
---

# Celestia network upgrade process

Blockchain networks often need to upgrade with new features which require coordination work among the community of developers, validators, and node operators prior to activating the upgrades. This process is called a network upgrade, which can be breaking or non-breaking. During planned network upgrades the community will coordinate to prepare for the upcoming upgrade. Breaking network upgrades are not backward-compatible with older versions of the network software, which is why it is important that validators upgrade their software to continue validating on the network. Non-breaking network upgrades are backward-compatible and require less coordination.

## Network upgrade coordination

As of the Lemongrass upgrade in September 2024, Celestia has implemented [CIP-10](https://cips.celestia.org/cip-10.html), which establishes two methods for coordinating network upgrades:

1. **Pre-programmed height**: Used for the Lemongrass network upgrade (v2)
2. **In-protocol signaling**: Used for all subsequent upgrades (v3+)

Under the in-protocol signaling mechanism, validators submit messages to signal their readiness and preference for the next version. The upgrade activates automatically once a quorum of 5/6 of validators has signaled for the same version.

## Upgrade process

The upgrade process can be broken down into a few steps:
1. [Celestia Improvement Proposals](https://cips.celestia.org) (CIPs) are created for consensus-breaking changes and features that impact user experience. These CIPs are included in a meta-CIP, which define the scope of the upgrade.
1. Celestia core developer teams implement the features defined in the CIPs.
1. A new binary is released with the new features to be tested on testnets.
1. Validators upgrade their nodes to the new binary, on [Arabica devnet](./arabica-devnet.md), [Mocha testnet](./mocha-testnet.md), and finally on Celestia [Mainnet Beta](./mainnet.md).
    - Upgrades using pre-programmed height (v2) activate at a predetermined block number.
    - Upgrades using in-protocol signaling (v3+) activate one week after 5/6 of the voting power has signaled for a particular version

### Upcoming upgrade

#### Ginger network upgrade

The Ginger network upgrade (v3) will be the first to use the new in-protocol signaling mechanism defined in [CIP-10](https://cips.celestia.org/cip-10.html). This upgrade includes changes defined in [CIP-25](https://cips.celestia.org/cip-25.html):

Key features include:
- [CIP-21](https://cips.celestia.org/cip-21.html): Introduce blob type with verified signer
- [CIP-24](https://cips.celestia.org/cip-24.html): Versioned Gas Scheduler Variables
- [CIP-26](https://cips.celestia.org/cip-26.html): Versioned timeouts
- [CIP-27](https://cips.celestia.org/cip-27.html): Block limits for number of PFBs and non-PFBs
- [CIP-28](https://cips.celestia.org/cip-28.html): Transaction size limit

Unlike the Lemongrass upgrade, there will not be a pre-programmed upgrade height. Instead, validators will signal their readiness for v3 through in-protocol signaling, and the upgrade will automatically activate one week after 5/6 of voting power have signaled for a particular version.

:::info
Validators should ensure they are running a v3 binary before signaling support for the upgrade.
:::

:::warning
You do not need to use a tool like [cosmovisor](https://docs.cosmos.network/main/build/tooling/cosmovisor) to upgrade the binary. Please upgrade your binary before signaling support for the new version.
:::

### Past Upgrades

#### Lemongrass network upgrade

The Lemongrass network upgrade (v2) was the first consensus layer breaking change since Celestia's Mainnet Beta genesis block. The Lemongrass network upgrade included all of the CIPs listed in [CIP-17](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-17.md) and implemented CIP-10 for future upgrades.

Network      | Chain ID   | Date and time               | Upgrade height
-------------|------------|-----------------------------|-----------------
Arabica      | arabica-11 | 2024/08/19 @ 14:00 UTC    | 1751707
Mocha        | mocha-4    | 2024/08/28 @ 14:00 UTC    | 2585031
Mainnet Beta | celestia   | 2024/09/18 @ 14:00 UTC    | 2371495
