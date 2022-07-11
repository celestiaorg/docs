# Contract Deployment on CosmWasm with Optimint
<!-- markdownlint-disable MD013 -->

## Compile the Smart Contract

We will run the following commands to pull down the Nameservice
smart contract and compile it:

```sh
git clone https://github.com/InterWasm/cw-contracts
cd cw-contracts
cd contracts/nameservice
cargo wasm
```

The compiled contract is outputted to the following repository:
`target/wasm32-unknown-unknown/release/cw_nameservice.wasm`.

## Unit Tests

If we want to run tests, we can do so with the following command:

```sh
RUST_BACKTRACE=1 cargo unit-test
```

## Optimized Smart Contract

Because we are deploying the compiled smart contract to `wasmd`,
we want it to be as small as possible.

CosmWasm team provides a tool called `rust-optimizer` which we need
Docker for in order to compile.

Run the following command:

```sh
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.6
```

This will compile our code inside `artifacts/cw_nameservice.wasm` directory.

## Contract Deployment

Let's now deploy our smart contract!

Run the following:

```sh
TX_HASH=$(wasmd tx wasm store artifacts/cw_nameservice.wasm --from $KEY_NAME --keyring-backend test $TXFLAG --output json -y | jq -r '.txhash') 
```

This will get you the transaction hash for the smart contract deployment. Given
we are using Optimint, there will be a delay on the transaction being included
due to Optimint waiting on Celestia's Data Availability Layer to confirm the block
has been included before submitting a new block.
