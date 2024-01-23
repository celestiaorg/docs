---
description: Learn how to integrate your L2 with Blobstream
---

# Integrate with Blobstream

![Blobstream logo](/img/blobstream/blobstream_logo.png)

[Blobstream](https://blog.celestia.org/introducing-blobstream/)
is the first data availability solution for Ethereum that securely
scales with the number of users. Formerly known as the [Quantum Gravity Bridge (QGB)](https://blog.celestia.org/celestiums/),
Blobstream relays commitments to Celestia's data root to an onchain light client
on Ethereum, for integration by developers into L2 contracts. This enables Ethereum
developers to build high-throughput L2s using Celestia's optimised DA layer,
the first with Data Availability Sampling (DAS).

A new and improved version of Blobstream, BlobstreamX, is out and will
replace Blobstream. This latter proves Celestia block headers on the
target EVM chain using zk-proofs which allows inheriting all the security
guarantees of Celestia.

# Integrate with BlobstreamX

The following docs go over how developers can integrate BlobstreamX.

## Overview

TBD

:::tip NOTE
If the contract is still not deployed, then it needs to be
deployed before it is used by the prover/relayer. See the
[deployment documentation (TBD)]() for more details.
:::

## How BlobstreamX works

TBD

## How to integrate

Integrating your L2 with BlobstreamX requires two components: your onchain smart
contract logic, and your offchain client logic. The next three sections cover these
topics:

- [Integrate with BlobstreamX contracts](./blobstreamx-contracts.md)
- [Integrate with BlobstreamX client](./blobstreamx-offchain.md)
- [Querying the BlobstreamX proofs](./blobstreamx-proof-queries.md)

### Deployed contracts

You can interact with the BlobstreamX contracts today on testnet. The BlobstreamX Solidity
smart contracts are currently deployed on the following Ethereum testnets:

<!-- markdownlint-disable MD013 -->

| Contract     | EVM network      | Contract address                                                                                                                | Attested data |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Blobstream   | Sepolia          | [`0x3a5cbB6EF4756DA0b3f6DAE7aB6430fD8c46d247`](https://sepolia.etherscan.io/address/0x3a5cbB6EF4756DA0b3f6DAE7aB6430fD8c46d247) | Mocha testnet |
| Blobstream   | Arbitrum Sepolia | [`0x040769edbca5218e616c8eb16e4faea49ced5e33`](https://sepolia.arbiscan.io/address/0x040769edbca5218e616c8eb16e4faea49ced5e33)  | Mocha testnet |
| Blobstream X | Goerli           | [`0x67ea962864cdad3f2202118dc6f65ff510f7bb4d`](https://goerli.etherscan.io/address/0x67ea962864cdad3f2202118dc6f65ff510f7bb4d)  | Mocha testnet |

TBD (Add: Sepolia, Arbitrum Sepolia, and eventually the others).

<!-- markdownlint-enable MD013 -->

## BlobstreamX vs. data availability committees (DACs)

### Decentralization and security

BlobstreamX is built on Celestia, which uses a CometBFT-based proof-of-stake
system. BlobstreamX shares the same security assumptions
as Celestia. In contrast, data availability committees (DACs), are typically
centralized or semi-centralized, relying on a specific set of entities or
individuals to vouch for data availability.

### Mechanism of verification

BlobstreamX uses data availability attestations, which are Merkle roots of
the batched L2 data, to confirm that the necessary data is present on Celestia.
The L2 contract on Ethereum can check directly with BlobstreamX if the data
is published on Celestia. Similarly, a DAC would rely on
attestations or confirmations from its permissioned members.

### Flexibility and scalability

BlobstreamX is designed to offer high-throughput data availability for Ethereum L2s,
aiming to strike a balance between scalability and security. It operates
independently of Ethereum's gas costs, as Celestia's resource pricing is more
byte-focused rather than computation-centric. On the other hand, the scalability
and flexibility of a DAC would depend on its specific design and implementation.

In summary, both BlobstreamX and DACs aim to ensure offchain data availability,
but BlobstreamX offers a more decentralized, secure, and scalable solution
compared to the potential centralized nature of DACs.
