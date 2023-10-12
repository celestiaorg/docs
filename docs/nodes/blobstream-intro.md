---
sidebar_label: Blobstream
description: An overview of Blobstream.
---

# Blobstream

Blobstream, covered previously in
[the Celestia blog post](https://blog.celestia.org/celestiums/),
introduces the concept of a layer 2 (L2), which is an EVM L2
rollup that uses Celestia for data availability
but settles on Ethereum (or any other EVM L1 chain).

This page and following tutorials will go over Blobstream and how Validators on Celestia can run it.

If you're looking to learn more, you can view
[the `orchestrator-relayer` repository](https://github.com/celestiaorg/orchestrator-relayer)
, and
[read more about Blobstream](https://github.com/celestiaorg/quantum-gravity-bridge#how-it-works).

## Overview

Blobstream,
consists of two components: an [Orchestrator](../blobstream-orchestrator)
and a [Relayer](../blobstream-relayer).

In the following diagram, we show how a layer 2 would post the data to
Celestia. This will later be attested to by the Celestia validator set, and
eventually posted to the target EVM chain (in this case, Ethereum). Then,
the layer 2, or any party, will be able to verify the attestations, i.e. valsets
and data commitments, directly on the EVM chain on the Blobstream smart contract. You can
reference
[the Blobstream smart contract](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/Blobstream.sol).

![Blobstream-Architecture](../img/blobstream/blobstream-diagram.png)

The specification of Blobstream `Valset`s, which track the Celestia validator set
changes, can be found in [ADR 002](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-002-qgb-valset.md).

Blobstream data commitments, which represent commitments over sets of blocks
defined by a data commitment window, are
discussed more in-depth in
[ADR 003](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-003-qgb-data-commitments.md).

The Orchestrator is part of the validator setup and works as follows:

- Celestia App: creates an attestation on the state machine level that needs to
  be signed
- The Orchestrator: queries the attestation, signs it, then submits the signature
  back to Celestia App

The diagram below goes over this process.

![Blobstream-Orchestrator](../img/blobstream/blobstream-orchestrator.png)

The Relayer deploys the Blobstream smart contract first to the EVM L1 chain (if it is
not deployed before), and then relays the attestations from Celestia App to the
EVM L1 Chain.

The diagram below goes over this process.

![Blobstream-Relayer](../img/blobstream/blobstream-relayer.png)

You can learn more about the mechanics behind the Relayer in
[ADR 004](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-004-qgb-relayer-security.md).

## Blobstream and data availability committees (DACs)

### Decentralization and security

Blobstream is built on Celestia, which uses a CometBFT-based proof-of-stake
system. An incorrect data availability attestation in this system can be
penalized, ensuring validators act in good faith. In contrast, data availability
committees (DACs), are typically centralized or semi-centralized, relying on
a specific set of entities or individuals to vouch for data avaiability.

### Mechanism of verification

Blobstream uses data availability attestations, which are Merkle roots of the
L2 data, to confirm that the necessary data is present on Celestia. When
Ethereum's L2 contract updates its state, it checks with Blobstream to confirm
that data's presence on Celestia. In contrast, a DAC would rely on attestations
or confirmations from its permissioned members.

### Flexibility and scalability

Blobstream offers high-throughput data availability for Ethereum L2s, striking
a balance between scalability and security. It isn't bound by Ethereum's gas
costs, as Celestia's resource pricing is more byte-focused rather than
computation-centric. The scalability costs of a DAC would largely hinge on its
specific design, but it may not achieve the same balance as Blobstream.

In summary, both Blobstream and DACs aim to ensure off-chain data availability,
but Blobstream offers a more decentralized, secure, and scalable solution
compared to the potential centralized nature of DACs.

## Setting up the Blobstream

The following sections in this category presume you have the following setup:

- A Celestia App
[validator node](../consensus-node#optional-setting-up-a-validator) running
- A Celestia Node [bridge node](../bridge-node) running

## Next steps

1. [Install the binary](../blobstream-binary)
2. [Blobstream Orchestrator](../blobstream-orchestrator)
3. [Key management](../blobstream-keys)
4. [Blobstream Relayer](../blobstream-relayer)
5. [Deploy the Blobstream contract](../blobstream-deploy)
