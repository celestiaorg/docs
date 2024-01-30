---
description: Learn how to integrate your L2 with Blobstream
---

# Integrate with Blobstream

![Blobstream logo](https://github.com/celestiaorg/docs/raw/main/public/img/blobstream/blobstream_logo.png)

[Blobstream](https://blog.celestia.org/introducing-blobstream/)
is the first data availability solution for Ethereum that securely
scales with the number of users. Formerly known as the [Quantum Gravity Bridge (QGB)](https://blog.celestia.org/celestiums/),
Blobstream relays commitments to Celestia's data root to an onchain light client
on Ethereum, for integration by developers into L2 contracts. This enables Ethereum
developers to build high-throughput L2s using Celestia's optimised DA layer,
the first with Data Availability Sampling (DAS).

The following docs go over how developers can integrate Blobstream.
There are also docs on how to run a [Blobstream orchestrator](../nodes/blobstream-binary.md)
as a Celestia validator which won't be covered in the following sections
aimed at developers.

## Overview

Blobstream,
consists of two components: an [orchestrator](../nodes/blobstream-orchestrator.md)
and a [relayer](../nodes/blobstream-relayer.md).

In the following diagram, we show how a layer 2 (L2) would post data to
Celestia and then verify that it was published in the target EVM chain.

![Blobstream-Architecture](https://github.com/celestiaorg/docs/raw/main/public/img/blobstream/Blobstream.png)

Data will first be attested to by the Celestia validator set, _i.e._
signing commitments committing to the data. Then, these signatures will be
relayed to the target EVM chain (in this case, Ethereum). Finally,
the L2, or any party, will be able to verify that the data was published
to Celestia directly on the EVM chain on the Blobstream smart contract. You can
reference [the Blobstream smart contract](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/Blobstream.sol).

The **orchestrator** is part of the validator setup and works as follows:

- celestia-app creates an attestation on the state machine level that needs to
  be signed
- The orchestrator queries the attestation, signs it, then submits the signature
  to the Blobstream P2P network

The **relayer** submits the attestations' signatures from the Blobstream
P2P network to the target EVM chain.

:::tip NOTE
If the contract is still not deployed, then it needs to be
deployed before it is used by the relayer. See the
[deployment documentation](../nodes/blobstream-deploy.md) for more details.
:::

## How Blobstream works

Blobstream allows Celestia block header data roots to be relayed in one
direction, from Celestia to an EVM chain. It does not support bridging
assets such as fungible or non-fungible tokens directly, and cannot send
messages from the EVM chain back to Celestia.

It works by relying on a set of signers to attest to some event on Celestia:
the Celestia validator set. The Blobstream contract keeps track of the
Celestia validator set by updating its view of the validator set with
`updateValidatorSet()`. More than 2/3 of the voting power of the current
view of the validator set must sign off on new relayed events, submitted with
`submitDataRootTupleRoot()`. Each event is a batch of `DataRootTuple`s, with
each tuple representing a single
[data root (i.e. block header)](https://celestiaorg.github.io/celestia-app/specs/data_structures.html#header).
Relayed tuples are in the same order as Celestia block headers.

![Blobstream attestation flow](https://github.com/celestiaorg/docs/raw/main/public/img/blobstream/Celestia_Blobstream_attestation_flow.jpg)

### Events and messages relayed

**Validator sets**:
The relayer informs the Blobstream contract who are the current
validators and their power.
This results in an execution of the `updateValidatorSet` function.

**Batches**:
The relayer informs the Blobstream contract of new data root tuple roots.
This results in an execution of the `submitDataRootTupleRoot` function.

## How to integrate

Integrating your L2 with Blobstream requires two components: your onchain smart
contract logic, and your offchain client logic. The next three sections cover these
topics:

- [Integrate with Blobstream contracts](./blobstream-contracts.md)
- [Integrate with Blobstream client](./blobstream-offchain.md)
- [Querying the Blobstream proofs](./blobstream-proof-queries.md)

### Deployed contracts

You can interact with the Blobstream contracts today on testnet. The Blobstream Solidity
smart contracts are currently deployed on the following Ethereum testnets:

<!-- markdownlint-disable MD013 -->

| Contract     | EVM network      | Contract address                                                                                                                | Attested data |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Blobstream   | Sepolia          | [`0x3a5cbB6EF4756DA0b3f6DAE7aB6430fD8c46d247`](https://sepolia.etherscan.io/address/0x3a5cbB6EF4756DA0b3f6DAE7aB6430fD8c46d247) | Mocha testnet |
| Blobstream   | Arbitrum Sepolia | [`0x040769edbca5218e616c8eb16e4faea49ced5e33`](https://sepolia.arbiscan.io/address/0x040769edbca5218e616c8eb16e4faea49ced5e33)  | Mocha testnet |
| Blobstream X | Goerli           | [`0x67ea962864cdad3f2202118dc6f65ff510f7bb4d`](https://goerli.etherscan.io/address/0x67ea962864cdad3f2202118dc6f65ff510f7bb4d)  | Mocha testnet |

<!-- markdownlint-enable MD013 -->

## Blobstream vs. data availability committees (DACs)

### Decentralization and security

Blobstream is built on Celestia, which uses a CometBFT-based proof-of-stake
system. An incorrect data availability attestation in this system will
ultimately be penalized (currently not implemented), ensuring validators
act in good faith. Thus, Blobstream shares the same security assumptions
as Celestia. In contrast, data availability committees (DACs), are typically
centralized or semi-centralized, relying on a specific set of entities or
individuals to vouch for data availability.

### Mechanism of verification

Blobstream uses data availability attestations, which are Merkle roots of
the batched L2 data, to confirm that the necessary data is present on Celestia.
The L2 contract on Ethereum can check directly with Blobstream if the data
is published on Celestia. Similarly, a DAC would rely on
attestations or confirmations from its permissioned members.

### Flexibility and scalability

Blobstream is designed to offer high-throughput data availability for Ethereum L2s,
aiming to strike a balance between scalability and security. It operates
independently of Ethereum's gas costs, as Celestia's resource pricing is more
byte-focused rather than computation-centric. On the other hand, the scalability
and flexibility of a DAC would depend on its specific design and implementation.

In summary, both Blobstream and DACs aim to ensure offchain data availability,
but Blobstream offers a more decentralized, secure, and scalable solution
compared to the potential centralized nature of DACs.
