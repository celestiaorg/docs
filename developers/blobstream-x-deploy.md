# New Blobstream X deployments

If you want to deploy Blobstream X to a new chain, where a Gateway 
contract does not exist, you need to do the following.

If Succinct Gateway already exists on this chain, you can skip
this step.
You can check the list of deployed `SuccinctGateway` contracts in this [list](https://docs.succinct.xyz/platform/onchain-integration#succinctgateway).

## Deploy a new `SuccinctGateway` contract

To Deploy a new `SuccinctGateway` contract to the new chain, follow 
the [succinct documentation](https://docs.succinct.xyz/platform/onchain-integration#gateway-deployment).

## Deploy a `BlobstreamX` contract to the new chain

To deploy a `BlobstreamX` contract to the new chain,
follow this [guide](https://github.com/succinctlabs/blobstreamx/blob/main/README.md#blobstreamx-contract-overview).

## Run a local prover

Now that you have the contracts deployed, you can
run a local prover which will generate proofs and relay them to your target `Blobstream X` contract.
Follow this [guide](https://hackmd.io/@succinctlabs/HJE7XRrup) on how to run a relayer.
