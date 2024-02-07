# Non-canonical Blobstream X deployments

If you want to deploy Blobstream X to a new chain, where a
canonical Succinct Gateway contract does not exist, you
need to do the following.

## Deploy a new `SuccinctGateway` contract

Deploy a new `SuccinctGateway` contract to the new chain.

1. Clone the repository.

    ```bash
    git clone https://github.com/succinctlabs/succinctx
    cd succintx/contracts
    ```

2. Fill in `contracts/.env`
    [following `.env.example`](https://github.com/succinctlabs/succinctx/blob/main/contracts/.env.example).
    The following is an example:

    ```bash
    PRIVATE_KEY=
    WALLET_TYPE=PRIVATE_KEY
    UPGRADE_VIA_EOA=true

    CREATE2_SALT=0x04

    # Sepolia testnet
    TIMELOCK_11155111=0xDEd0000E32f8F40414d3ab3a830f735a3553E18e
    GUARDIAN_11155111=0xDEd0000E32f8F40414d3ab3a830f735a3553E18e

    RPC_11155111=https://ethereum-sepolia.publicnode.com
    ETHERSCAN_API_KEY_11155111=<YOUR_API_KEY>
    ```

    TODO(@Succinct): Document the following: - Where to get the timelock
    and guardian - The env variables names contain the chainID, we should
    mention that different chains will require different variables.

3. Deploy the `SuccinctGateway` contract.

    Example of deploying `SuccinctGateway` on Ethereum Sepolia:

    ```bash
    ./script/deploy.sh "SuccinctGateway" "11155111"

    ./script/verify.sh "SuccinctGateway" "11155111" "true"
    ```

## Register the function IDs on the `SuccinctGateway` contract

1. Download the `FunctionVerifier.sol` of the
    [nextHeader](https://alpha.succinct.xyz/celestia/blobstreamx/releases/6)
    circuit and the [headerRange](https://alpha.succinct.xyz/celestia/blobstreamx/releases/7)
    circuit from the `Build Files` section of the release page on the Succinct
    Platform.

    ![blobstream x overview diagram draft](/img/blobstream/blobstream_x_succint.png)

2. Deploy both `FunctionVerifier.sol` contracts to the new chain. Keep
    track of the addresses.
3. (TODO) `cast` command to register the `functionId`'s with the deployed
    `SuccinctGateway`.
    1. Pass the addresses from the previous step in as arguments.

## Deploy a `BlobstreamX` contract to the new chain

[Follow the guide](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#deploy-blobstream-x-contract).

## Set up a local `BlobstreamX` operator

Set up the local `BlobstreamX` operator to locally prove & relay to the new chain.
[Follow the guide](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#local-proving--relaying).
Run the operator, and it should post proofs to the new `BlobstreamX` contract!
