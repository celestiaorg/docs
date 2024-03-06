# New Blobstream X deployments

If you want to deploy Blobstream X to a new chain, where a Gateway 
contract does not exist, you need to do the following.

If Succint Gateway already exists on this chain, you can skip
this step.
[You can check the list of deployed `SuccintGateway` contracts](https://docs.succinct.xyz/platform/onchain-integration#succinctgateway).

## Deploy a new `SuccinctGateway` contract

[Deploy a new `SuccinctGateway` contract to the new chain](https://docs.succinct.xyz/platform/onchain-integration#gateway-deployment).

## Deploy a `BlobstreamX` contract to the new chain

[Follow the guide to use your deployed `SuccinctGateway` to deploy a new Blobstream X contract](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#deploy-blobstream-x-contract).

## Run a local prover

Now that you have the contracts deployed, you can
[run a local prover](./requesting-data-commitment-ranges.md#local-proving).
