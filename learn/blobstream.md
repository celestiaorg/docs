# Blobstream

[Blobstream](https://blog.celestia.org/introducing-blobstream/)
allows Ethereum developers to build high-throughput L2s using Celestia,
the first DA layer with Data Availability Sampling.

This section covers Blobstream and how validators on Celestia can run it.

If you're looking to learn more, you can view
[the `orchestrator-relayer` repository](https://github.com/celestiaorg/orchestrator-relayer),
and [read more about Blobstream](https://github.com/celestiaorg/blobstream-contracts#how-it-works).

## Overview

Blobstream consists of two components: an [orchestrator](/operate/blobstream/orchestrator)
and a [relayer](/operate/blobstream/relayer).

In the following diagram, we show how a layer 2 would post data to
Celestia and then verify that it was published in the target EVM chain.

![Blobstream Architecture](/img/blobstream/Blobstream.png)

Data is first attested to by the Celestia validator set—they sign commitments to the data. Then, these signatures are relayed to the target EVM chain (in this case, Ethereum). Finally, the layer 2, or any party, can verify that the data was published to Celestia directly on the EVM chain via the Blobstream smart contract. You can reference [the Blobstream smart contract](https://github.com/celestiaorg/blobstream-contracts/blob/v3.0.0/src/Blobstream.sol).

The specification of Blobstream `Valset`s, which track the Celestia validator set changes, can be found in [ADR 002](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-002-qgb-valset.md).

Blobstream data commitments, which represent commitments over sets of blocks defined by a data commitment window, are discussed more in-depth in [ADR 003](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-003-qgb-data-commitments.md).

The orchestrator is part of the validator setup and works as follows:

- **Celestia App**: Creates an attestation on the state machine level that needs to be signed
- **The orchestrator**: Queries the attestation, signs it, then submits the signature to the Blobstream P2P network

The diagram below illustrates this process:

![Blobstream Orchestrator](/img/blobstream/blobstream-orchestrator.png)

The relayer submits the attestations' signatures from the Blobstream P2P network to the target EVM chain.

> **Note:** If the contract is still not deployed, it needs to be deployed before it's used by the relayer. Check the [deployment documentation](/operate/blobstream/deploy-contract) for more details.

The diagram below illustrates the relayer process:

![Blobstream Relayer](/img/blobstream/blobstream-relayer.png)

You can learn more about the mechanics behind the relayer in [ADR 004](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-004-qgb-relayer-security.md).

## Blobstream vs Data Availability Committees (DACs)

### Decentralization and security

Blobstream is built on Celestia, which uses a CometBFT-based proof-of-stake system. An incorrect data availability attestation in this system will ultimately be penalized (currently not implemented), ensuring validators act in good faith. Thus, Blobstream shares the same security assumptions as Celestia.

In contrast, data availability committees (DACs) are typically centralized or semi-centralized, relying on a specific set of entities or individuals to vouch for data availability.

### Mechanism of verification

Blobstream uses data availability attestations, which are Merkle roots of the batched L2 data, to confirm that the necessary data is present on Celestia. The L2 contract on Ethereum can check directly with Blobstream if the data is published on Celestia.

Similarly, a DAC would rely on attestations or confirmations from its permissioned members.

### Flexibility and scalability

Blobstream is designed to offer high-throughput data availability for Ethereum L2s, aiming to strike a balance between scalability and security. It operates independently of Ethereum's gas costs, as Celestia's resource pricing is more byte-focused rather than computation-centric.

On the other hand, the scalability and flexibility of a DAC would depend on its specific design and implementation.

In summary, both Blobstream and DACs aim to ensure offchain data availability, but Blobstream offers a more decentralized, secure, and scalable solution compared to the potential centralized nature of DACs.

## Build with Blobstream

If you are a developer looking to build on top of Blobstream, check out the [Build section](/build/blobstream/integrate-contracts).

## Operate Blobstream

If you are a validator or node operator looking to run Blobstream, check out the [Operate section](/operate/blobstream/install-binary) to learn how to deploy your own instance.