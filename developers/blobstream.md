---
description: Learn how to integrate your L2 with Blobstream
---

# Blobstream: Streaming modular DA to Ethereum

![Blobstream logo](/img/blobstream/blobstream_logo.png)

## What is Blobstream?

[Blobstream](https://blog.celestia.org/introducing-blobstream/)
is the first data availability solution for Ethereum that securely
scales with the number of users. Formerly known as the [Quantum Gravity Bridge (QGB)](https://blog.celestia.org/celestiums/),
Blobstream relays commitments to Celestia's data root to an onchain light client
on Ethereum, for integration by developers into L2 contracts. This enables Ethereum
developers to build high-throughput L2s using Celestia's optimised DA layer,
the first with Data Availability Sampling (DAS).

An implementation of Blobstream, by [Succinct](https://docs.succinct.xyz/), called
[Blobstream X](https://github.com/succinctlabs/blobstreamx), is out
and will be used in our canonical deployments. This implementation proves the
validity of Celestia block headers on a target EVM chain using zero-knowledge
proofs which allows (ZKPs), which allow inheriting all the security
guarantees of Celestia.

## What is Blobstream X?

Blobstream X is an implementation of Blobstream with a
ZK light client that bridges Celestia’s modular DA layer to
Ethereum to allow high-throughput rollups to use Celestia’s DA while settling
on Ethereum.

Optimistic or ZK rollups that settle on Ethereum but wish to use Celestia for
DA require a mechanism for _bridging_ Celestia’s data root to Ethereum as part
of the settlement process. This data root is used during inclusion proofs to
prove that particular rollup transactions were included and made available in
the Celestia network.

Bridging Celestia’s data root to Ethereum requires running a Celestia
_light client_ as a smart contract on Ethereum, to make the latest state
of the Celestia chain known on Ethereum and available to rollups. Blobstream
X utilizes the latest advances in zero-knowledge proofs to generate a
_succinct proof_ that enough Celestia validators have come to consensus
(according to the Tendermint consensus protocol) on a block header, and
verifies this proof in the Blobstream X Ethereum smart contract to update
it with the latest Celestia header.

The Blobstream X zero-knowledge proof not only verifies the consensus of
Celestia validators, but it also merkelizes and hashes all the data roots
in the block range from the previous update to the current update, making
accessible all Celestia data roots (verifiable with a Merkle inclusion proof
against the stored Merkle root) to rollups.

Blobstream X is built and deployed with
[Succinct's protocol](https://docs.succinct.xyz).

![blobstream x draft diagram](/img/blobstream/Celestia_Blobstream_X1a.png)

## Integrate with Blobstream X

The following docs go over how developers can integrate Blobstream X.

You can [find the repository for Blobstream X](https://github.com/succinctlabs/blobstreamx)
along with code for:

- The Blobstream X smart contract - [`BlobstreamX.sol`](https://github.com/succinctlabs/blobstreamx/blob/main/contracts/src/BlobstreamX.sol)
- [The Blobstream X circuits](https://alpha.succinct.xyz/celestia/blobstreamx)
- [The Blobstream X contract Golang bindings](https://github.com/succinctlabs/blobstreamx/blob/main/bindings/BlobstreamX.go)

Canonical deployments of Blobstream X will be maintained on the
following chains: Arbitrum One, Base and Ethereum Mainnet. Every 1
hour, Succinct will post an update to the Blobstream X contract
that will include a new data commitment range that covers a 1-hour
block range from the `latestBlock` in the Blobstream X contract.
On Ethereum Mainnet, the Blobstream X contract will be updated
every 4 hours.

:::tip NOTE
Custom ranges can be requested using the `BlobstreamX` contract
to create proofs for specific Celestia block batches. These ranges
can be constructed as `[latestBlock, customTargetBlock)`, with
`latestBlock` is the latest block height that was committed to by the
`BlobstreamX` contract, and `latestBlock > customTargetBlock`,
and `customTargetBlock - latestBlock <= DATA_COMMITMENT_MAX`.

Block ranges that are before the contract's `latestBlock` can't be
proven a second time in different batches.

More information can be found in [`requestHeaderRange(...)`](https://github.com/succinctlabs/blobstreamx/blob/364d3dc8c8dc9fd44b6f9f049cfb18479e56cec4/contracts/src/BlobstreamX.sol#L78-L101)
method.
:::

### How Blobstream X works

As shown in the diagram below, the entrypoint for updates to the Blobstream
X contract is through the `SuccinctGateway` smart contract, which is a
simple entrypoint contract that verifies proofs (against a deployed
onchain verifier for the Blobstream X circuit) and then calls the
`BlobstreamX.sol` contract to update it.
[Find more information about the `SuccinctGateway`](https://docs.succinct.xyz/platform/onchain-integration#succinct-gateway).

![blobstream x overview diagram draft](/img/blobstream/Celestia_Blobstream_X2a.png)

<!-- markdownlint-disable MD042 -->

:::tip NOTE
If the Blobstream X contract is not deployed on a desired chain,
it needs to be deployed before it can be used by your rollup. See the
[deployment documentation](https://docs.succinct.xyz/platform/onchain-integration#gateway-deployment)
for more details.
:::

### How to integrate with Blobstream X

Integrating your L2 with Blobstream X requires two components: your onchain smart
contract logic, and your offchain client logic. The next three sections cover these
topics:

- [Integrate with Blobstream X contracts](./blobstreamx-contracts.md)
- [Integrate with Blobstream X client](./blobstreamx-offchain.md)
- [Querying the Blobstream X proofs](./blobstreamx-proof-queries.md)

### Deployed contracts

You can interact with the Blobstream X contracts today on testnet. The
Blobstream X Solidity smart contracts are currently deployed on
the following Ethereum testnets:

<!-- markdownlint-disable MD013 -->

| Contract     | EVM network      | Contract address                                                                                                                | Attested data on Celestia |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Blobstream X  | Ethereum Mainnet          | [`Not yet deployed`](https://etherscan.io/address/0xTODO) | [Mainnet Beta](../nodes/mainnet.md) |
| Blobstream X | Arbitrum One | [`Not yet deployed`](https://arbiscan.io/address/0xTODO)  | [Mainnet Beta](../nodes/mainnet.md) |
| Blobstream X | Base           | [`Not yet deployed`](https://goerli.etherscan.io/address/0xTODO)  | [Mainnet Beta](../nodes/mainnet.md) |
| Blobstream X | Ethereum Sepolia           | [`Not yet deployed`](https://sepolia.etherscan.io/address/0xTODO)  | [Mocha testnet](../nodes/mocha-testnet.md) |
| Blobstream X | Arbitrum Sepolia           | [`Not yet deployed`](https://sepolia.arbiscan.io/address/0xTODO)  | [Mocha testnet](../nodes/mocha-testnet.md) |

<!-- markdownlint-enable MD013 -->

## Blobstream X vs. data availability committees (DACs)

### Decentralization and security

Blobstream X is built on Celestia, which uses a CometBFT-based proof-of-stake
system. Blobstream X shares the same security assumptions
as Celestia. In contrast, data availability committees (DACs), are typically
centralized or semi-centralized, relying on a specific set of entities or
individuals to vouch for data availability.

### Mechanism of verification

Blobstream X uses data availability attestations, which are Merkle roots of
the batched L2 data, to confirm that the necessary data is present on Celestia.
The L2 contract on Ethereum can check directly with Blobstream X if the data
is published on Celestia. Similarly, a DAC would rely on
attestations or confirmations from its permissioned members.

### Flexibility and scalability

Blobstream X is designed to offer high-throughput data availability for Ethereum
L2s, aiming to strike a balance between scalability and security. It operates
independently of Ethereum's gas costs, as Celestia's resource pricing is more
byte-focused rather than computation-centric. On the other hand, the scalability
and flexibility of a DAC would depend on its specific design and implementation.

In summary, both Blobstream X and DACs aim to ensure offchain data availability,
but Blobstream X offers a more decentralized, secure, and scalable solution
compared to the potential centralized nature of DACs.
