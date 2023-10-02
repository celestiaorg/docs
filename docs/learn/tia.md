# Overview of TIA

## TIA at a glance

<!-- markdownlint-disable MD013 -->
| Property | Details |
| -------- | ------- |
| Abbreviation | TIA |
| Total supply at genesis | 1,000,000,000 TIA |
| Inflation schedule | 8% in the first year, decreasing 10% per year until reaching an inflation floor of 1.5% annually |
<!-- markdownlint-enable MD013 -->

## Role of TIA

### Paying for blobspace

Celestia’s native asset, TIA, is an essential part of how developers build on
the first modular blockchain network. To use Celestia for data availability,
rollup developers submit PayForBlobs transactions on the network for a fee,
denominated in TIA.

### Bootstrapping new rollups

A core part of the Celestia vision is that deploying a blockchain should be as
easy as deploying a smart contract. In the modular era, developers no longer
need to issue a token to launch their own blockchain.

Similarly to ETH on Ethereum-based rollups, developers may opt to bootstrap
their chain quickly by using TIA as a gas token and currency, in addition to
paying for data availability. In this mode, developers can focus on creating
their application or execution layer, instead of issuing a token right away.

### Proof-of-stake

As a permissionless network built with Cosmos SDK, Celestia uses proof-of-stake
to secure its own consensus. Like in other Cosmos networks, any user can help
secure the network by delegating their TIA to a Celestia validator for a portion
of their validator’s staking rewards.

Learn [how proof-of-stake works in Cosmos](https://docs.cosmos.network/main/modules/staking).

### Decentralised governance

TIA staking also allows the community to play a critical role in decentralised
governance over key parts of Celestia, such as voting on network parameters
through governance proposals, and governing the community pool, which receives
2% of block rewards.

Learn more about [Celestia’s decentralised governance model](../staking-governance-supply#decentralised-governance).
