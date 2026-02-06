# Network upgrades

Blockchain networks often need to upgrade with new features which require coordination work among the community of developers, validators, and node operators prior to activating the upgrades. This process is called a network upgrade, which can be breaking or non-breaking. During planned network upgrades the community will coordinate to prepare for the upcoming upgrade. Breaking network upgrades are not backward-compatible with older versions of the network software, which is why it is important that validators upgrade their software to continue validating on the network. Non-breaking network upgrades are backward-compatible and require less coordination.

## Network upgrade coordination

As of the Lemongrass upgrade in September 2024, Celestia has implemented [CIP-10](https://cips.celestia.org/cip-010.html), which establishes two methods for coordinating network upgrades:

1. **Pre-programmed height**: Used for the Lemongrass network upgrade (v2)
2. **In-protocol signaling**: Used for all subsequent upgrades (v3+)

Under the in-protocol signaling mechanism, validators submit messages to signal their readiness and preference for the next version. The upgrade activates automatically once a quorum of 5/6 of validators have signaled for the same version.

### Announcement channels

Follow the latest network upgrade announcements on:

- Telegram: [Network-wide announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord
  - [Mainnet Beta announcements](https://discord.com/channels/638338779505229824/1169237690114388039)
  - [Mocha announcements](https://discord.com/channels/638338779505229824/979037494735691816)

## Upgrade process

The upgrade process can be broken down into a few steps:

1. [Celestia Improvement Proposals](https://cips.celestia.org) (CIPs) are created for consensus-breaking changes and features that impact user experience. These CIPs are included in a meta-CIP, which define the scope of the upgrade.
1. Celestia core developer teams implement the features defined in the CIPs.
1. A new binary is released with the new features to be tested on testnets.
1. Node operators upgrade to the new binary, on [Arabica devnet](/operate/networks/arabica-devnet), [Mocha testnet](/operate/networks/mocha-testnet), and finally on Celestia [Mainnet Beta](/operate/networks/mainnet-beta).
   - Upgrades using pre-programmed height (v2) activate at a predetermined block number.
   - Upgrades using in-protocol signaling (v3+) activate one week after 5/6 of the voting power has signaled for a particular version

### Past Upgrades

#### Lemongrass network upgrade

The Lemongrass network upgrade (v2) was the first consensus layer breaking change since Celestia's Mainnet Beta genesis block. The Lemongrass network upgrade included all of the CIPs listed in [CIP-17](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-017.md) and implemented CIP-10 for future upgrades.

| Network      | Chain ID   | Date and time          | Upgrade height |
| ------------ | ---------- | ---------------------- | -------------- |
| Arabica      | arabica-11 | 2024/08/19 @ 14:00 UTC | 1751707        |
| Mocha        | mocha-4    | 2024/08/28 @ 14:00 UTC | 2585031        |
| Mainnet Beta | celestia   | 2024/09/18 @ 14:00 UTC | 2371495        |

See [parameters for v2](https://celestiaorg.github.io/celestia-app/parameters_v2.html).

#### Ginger network upgrade

The Ginger network upgrade (v3) was the first to use the in-protocol signaling mechanism defined in [CIP-10](https://cips.celestia.org/cip-010.html). This upgrade included changes defined in [CIP-25](https://cips.celestia.org/cip-025.html):

Key features include:

- [CIP-21](https://cips.celestia.org/cip-021.html): Introduce blob type with verified signer
- [CIP-24](https://cips.celestia.org/cip-024.html): Versioned Gas Scheduler Variables
- [CIP-26](https://cips.celestia.org/cip-026.html): Versioned timeouts
- [CIP-27](https://cips.celestia.org/cip-027.html): Block limits for number of PFBs and non-PFBs
- [CIP-28](https://cips.celestia.org/cip-028.html): Transaction size limit

Unlike the Lemongrass upgrade, there will not be a pre-programmed upgrade height. Instead, validators will signal their readiness for v3 through in-protocol signaling, and the upgrade will automatically activate one week after 5/6 of voting power have signaled for a particular version.

Learn more in the [v3.0.0 release notes](https://github.com/celestiaorg/celestia-app/blob/main/docs/release-notes/release-notes.md#v300).

| Network      | Chain ID   | Date and time             | Upgrade height |
| ------------ | ---------- | ------------------------- | -------------- |
| Arabica      | arabica-11 | 2024/11/05 @ 21:55:13 UTC | 2348907        |
| Mocha        | mocha-4    | 2024/11/14 @ 18:31:11 UTC | 3140052        |
| Mainnet Beta | celestia   | 2024/12/12 @ 14:28:52 UTC | 2993219        |

See [parameters for v3](https://celestiaorg.github.io/celestia-app/parameters_v3.html).

#### Lotus network upgrade

The Lotus network upgrade (v4) included several important changes defined in [CIP-33](https://cips.celestia.org/cip-033.html):

Key features include:

- [CIP-29](https://cips.celestia.org/cip-029.html): Decrease inflation and disinflation
- [CIP-30](https://cips.celestia.org/cip-030.html): Disable auto-claim of staking rewards
- [CIP-31](https://cips.celestia.org/cip-031.html): Incorporate staking rewards into vesting account schedules
- [CIP-32](https://cips.celestia.org/cip-032.html): Add Hyperlane to Celestia

Like the Ginger upgrade, this upgrade used the in-protocol signaling mechanism. The upgrade activated automatically after 5/6 of voting power signaled for a particular version and a delay period based on the network.

The delay periods for v4 were based on [celestia-app #4413](https://github.com/celestiaorg/celestia-app/issues/4413):

| Network      | Chain ID   | Date and time           | Upgrade height | Delay period |
| ------------ | ---------- | ----------------------- | -------------- | ------------ |
| Arabica      | arabica-11 | 2025/05/16 07:51:35 UTC | 5975265        | 1 day        |
| Mocha        | mocha-4    | 2025/07/01 11:51:58 UTC | 6915786        | 2 days       |
| Mainnet Beta | celestia   | 2025/07/28 13:46:27 UTC | 6680339        | 7 days       |

See [parameters for v4](https://celestiaorg.github.io/celestia-app/parameters_v4.html).

#### v5 network upgrade

The v5 network upgrade included a fix to restore IBC support which was broken in v4.

Like previous upgrades, this upgrade will use the in-protocol signaling mechanism. The upgrade will automatically activate after 5/6 of voting power have signaled for a particular version and a delay period based on the network, in accordance with the table below.

| Network      | Chain ID   | Date and time           | Upgrade height | Delay period |
| ------------ | ---------- | ----------------------- | -------------- | ------------ |
| Arabica      | arabica-11 | 2025/07/29 19:59:00 UTC | 7316464        | 1 block      |
| Mocha        | mocha-4    | 2025/07/30 17:07:29 UTC | 7401191        | 1 block      |
| Mainnet Beta | celestia   | 2025/08/01 14:30:29 UTC | 6748821        | 1 block      |

See [parameters for v5](https://celestiaorg.github.io/celestia-app/parameters_v5.html).

### Upcoming Upgrades

> **Warning:** You do not need to use a tool like [cosmovisor](https://docs.cosmos.network/main/build/tooling/cosmovisor) to upgrade the binary. Please upgrade your binary before signaling support for the new version.

#### Matcha network upgrade

The Matcha network upgrade (v6) includes several important changes defined in [CIP-42](https://cips.celestia.org/cip-042.html).

Key features include:

- [CIP-36](https://cips.celestia.org/cip-036.html): Lowering Trusting Period to 7 Days
- [CIP-37](https://cips.celestia.org/cip-037.html): Lower unbonding period to ~14 days
- [CIP-38](https://cips.celestia.org/cip-038.html): Increase maximum block, square and transaction size
- [CIP-39](https://cips.celestia.org/cip-039.html): Remove token filter for Hyperlane and IBC
- [CIP-40](https://cips.celestia.org/cip-040.html): Privval Interface Extension for Arbitrary Message Signing
- [CIP-41](https://cips.celestia.org/cip-041.html): Reduce issuance to 2.5% and increase minimum commission to 10%

| Network      | Chain ID   | Date and time           | Upgrade height                                                    | Delay period |
| ------------ | ---------- | ----------------------- | ----------------------------------------------------------------- | ------------ |
| Arabica      | arabica-11 | 2025/09/09 06:08:11 UTC | [8105605](https://arabica.celenium.io/block/8105605)              | 1 day        |
| Mocha        | mocha-4    | 2025/10/03 01:25:02 UTC | [8236886](https://www.mintscan.io/celestia-testnet/block/8236886) | 2 days       |
| Mainnet Beta | celestia   | 2025/11/24 12:33:12 UTC | [8662012](https://celenium.io/block/8662012?tab=transactions)     | 7 days       |

See [parameters for v6](https://celestiaorg.github.io/celestia-app/parameters_v6.html).