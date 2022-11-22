---
sidebar_label: Contract Deployment
---

# Contract Deployment on CosmWasm with Rollmint
<!-- markdownlint-disable MD013 -->

## Compile the Smart Contract

In a new terminal instance, we will run the following commands to pull down the
Nameservice smart contract and compile it:

```sh
git clone https://github.com/InterWasm/cw-contracts
cd cw-contracts
cd contracts/nameservice
cargo wasm
```

The compiled contract is outputted to:
`target/wasm32-unknown-unknown/release/cw_nameservice.wasm`.

## Unit Tests

If we want to run tests, we can do so with the following command in the
`~/cw-contracts/contracts/nameservice` directory:

```sh
cargo unit-test
```

## Optimized Smart Contract

Because we are deploying the compiled smart contract to `wasmd`,
we want it to be as small as possible.

The CosmWasm team provides a tool called `rust-optimizer` which we need
[Docker](./cosmwasm-dependency.md/#docker-installation) for in order to compile.

Run the following command in the `~/cw-contracts/contracts/nameservice`
directory:

```sh
sudo docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.6
```

This will place the optimized Wasm bytecode at `artifacts/cw_nameservice.wasm`.

## Contract Deployment

Let's now deploy our smart contract!

Run the following:

```sh
TX_HASH=$(wasmd tx wasm store artifacts/cw_nameservice.wasm --from $KEY_NAME --keyring-backend test $TXFLAG $NODEIP --output json -y | jq -r '.txhash')
```

Your output will be the gas estimate:

```sh
gas estimate: 1344759
```

This will get you the transaction hash for the smart contract deployment. Given
we are using Rollmint, there will be a delay on the transaction being included
due to Rollmint waiting on Celestia's Data Availability Layer to confirm the block
has been included before submitting a new block.
