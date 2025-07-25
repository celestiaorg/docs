---
description: What is BlobstreamX
prev:
  text: "New SP1 Blobstream deployments"
  link: "/how-to-guides/sp1-blobstream-deploy"
---

# Blobstream X: the previous zk implementation of Blobstream

![blobstream x draft diagram](/img/blobstream/Celestia_Blobstream_X1b.png)

## What is Blobstream X?

Blobstream X is the previous implementation of Blobstream. It uses
[plonky2x](https://github.com/succinctlabs/succinctx/tree/main/plonky2x) to create
circuits that verify the Celestia consensus and generate the corresponding proofs.

:::tip NOTE
The [Blobstream X repository](https://github.com/succinctlabs/blobstreamx) is now archived.
For current deployments and active development, see [SP1 Blobstream](https://github.com/succinctlabs/sp1-blobstream).
:::

Blobstream X is built and deployed with
[Succinct's protocol](https://docs.succinct.xyz).

:::tip NOTE
Current Blobstream deployments use SP1 Blobstream, not BlobstreamX circuits.
This documentation is maintained for historical reference.
:::

You can [find the repository for Blobstream X](https://github.com/succinctlabs/blobstreamx)
along with code for:

- [The Blobstream X smart contract - `BlobstreamX.sol`](https://github.com/succinctlabs/blobstreamx/blob/main/contracts/src/BlobstreamX.sol)
- The Blobstream X circuits
- [The Blobstream X contract Golang bindings](https://github.com/succinctlabs/blobstreamx/blob/main/bindings/BlobstreamX.go)

:::tip NOTE
Custom ranges can be requested using the `BlobstreamX` contract
to create proofs for specific Celestia block batches. These ranges
can be constructed as `[latestBlock, customTargetBlock)`, with
`latestBlock` as the latest block height that was committed to by the
`BlobstreamX` contract, and `latestBlock > customTargetBlock`,
and `customTargetBlock - latestBlock <= DATA_COMMITMENT_MAX`.

Block ranges that are before the contract's `latestBlock` can't be
proven a second time in different batches.

More information can be found in the [`requestHeaderRange(...)`](https://github.com/succinctlabs/blobstreamx/blob/364d3dc8c8dc9fd44b6f9f049cfb18479e56cec4/contracts/src/BlobstreamX.sol#L78-L101)
method.
:::

## How Blobstream X works

As shown in the diagram below, the entrypoint for updates to the Blobstream
X contract is through the `SuccinctGateway` smart contract, which is a
simple entrypoint contract that verifies proofs (against a deployed
onchain verifier for the Blobstream X circuit) and then calls the
`BlobstreamX.sol` contract to update it.

![blobstream x overview diagram draft](/img/blobstream/Celestia_Blobstream_X2b.png)

<!-- markdownlint-disable MD042 -->

:::tip NOTE
If the Blobstream X contract is not deployed on a desired chain,
it needs to be deployed before it can be used by your rollup.
:::

## Deploy Blobstream X

It is possible to deploy and maintain a Blobstream x instance and have the same security guarantees.

First, you will need to create a multisig that governs the Blobstream X contract and also the function identifiers.

Then, check the [deployment](https://github.com/succinctlabs/blobstreamx/blob/main/README.md#blobstreamx-contract-overview) documentation for how to deploy the contract.

Then, you will need to run a relayer, which will generate the proofs and relay them to your deployed Blobstream X contract. Check the [local proving documentation](/how-to-guides/blobstream-x-requesting-data-commitment-ranges.md#local-proving) for more information.

## Community implementations

Learn more about the community [implementation of Blobstream proofs by CryptoKass](https://github.com/CryptoKass/blobstreamx-example).
