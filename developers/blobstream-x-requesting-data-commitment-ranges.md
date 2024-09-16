---
prev:
    text: "Overview of Blobstream X"
    link: "/developers/blobstreamx"
---

# Requesting data commitment ranges

By default, the Blobstream X deployments on Ethereum will be
updated every 4 hours, and on Arbitrum One
and Base, updating every 1 hour. If you wish for the Blobstream X contract
to be updated at a different cadence, then you have several different
options for how to update the smart contract.

To request proofs to be submitted to the Blobstream X contract at a
different cadence, you can do one of the following:

> **_NOTE:_** The requested proof ranges cannot include
> blocks that were already used in a previous batch.
> The ranges should start from the last proven block, aka, 
> [`latest_block`](https://github.com/succinctlabs/blobstreamx/blob/aac0842f17056e5343f66de7df44020c1637e8b7/contracts/src/BlobstreamX.sol#L16-L17)
> and they should end in a block already committed by Celestia.
> In other words, it's the end-inclusive range defined 
> by `[latest_block, target_block]` with `target_block` <= Celestia tip.

## Local proving

To run the Blobstream X operator with local proving, follow this [guide](https://hackmd.io/@succinctlabs/HJE7XRrup).

Local proving allows self-generating the proofs and submitting them to an existing BlobstreamX contract.
Alternatively, if a team needs a very specific cadence that starts at very specific heights, they can deploy their own
BlobstreamX contract and submit proofs to it. Deployment instructions can be found in the [BlobstreamX deploy](./blobstream-x-deploy.md) 
documentation.

::: tip
Requires a large cloud machine to run in a reasonable
amount of time. EC2 r6a.16xlarge, i.e., 64CPU 512GB RAM, takes ~30 minutes to generate a
header range proof.
:::

## Request proofs from the Succinct platform

> **_NOTE:_** Requesting a proof from the succinct platform requires
> having a Succinct API key. It can be requested using 
> this [form](https://alpha.succinct.xyz/partner).

Run the Blobstream X operator with hosted proving on the Succinct
platform, by running an operator script that pings the platform with
proof requests at a specified cadence.

Follow [these instructions](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#operator-with-hosted-proving)
to run the operator script.

Here are example values for the `.env` file:

1. `TENDERMINT_RPC_URL` from
   [the public Celestia list](https://docs.celestia.org/nodes/mainnet#consensus-nodes).
2. `SUCCINCT_RPC_URL` = `https://alpha.succinct.xyz/api`
3. Request for `SUCCINCT_API_KEY` from
   [the Succinct team](https://alpha.succinct.xyz/partner).
4. `CHAIN_ID` is the chain ID of the deployed Blobstream X contract.
5. `CONTRACT_ADDRESS`: Blobstream X proxy contract address.
6. `NEXT_HEADER_FUNCTION_ID` & `HEADER_RANGE_FUNCTION_ID`: Get the
   `functionId`'s from the Blobstream X contract by using the
   `nextHeaderFunctionId` and `headerRangeFunctionId` respectively,
   which are public storage variables.

## Request proofs onchain

Directly request a proof via the Blobstream X contract interface.
Unlike the Blobstream X operator which handles requests off-chain,
requesting on-chain requires gas, but the proof will be generated
and relayed by the Succinct platform.

1. Call `requestHeaderRange(uint64 _targetBlock)` with the end
   of the range you want a commitment for.

2. A `DataCommitmentStored(uint256, uint64, uint64, bytes32)`
   will be emitted for the requested range when it is stored in the
   contract. Listen to this event to know that the proof has been
   generated successfully.
