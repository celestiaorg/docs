---
description: How to get started with local development on the Arbitrum Nitro stack.
---

# Quickstart: Local development with Nitro testnode

1. Install docker and docker compose.
1. Run a celestia-node
1. Run the [nitro-das-celestia server](https://github.com/celestiaorg/nitro-das-celestia).
1. Clone nitro
    ```
    git clone -b release --recurse-submodules https://github.com/celestiaorg/nitro.git && git checkout v3.2.1-rc.2 && cd /nitro/nitro-testnode
    ```
1. `./test-node.bash --init --dev`
  1. Some useful optional commands:
      - `--validate` (heavy computation, validates all blocks in WASM)
      - `--blockscout` (builds or launches blockscout)
      - `--l2-anytrsut` (launches anytrust DAC locally, useful to test anytrust fallbacks)

## Additional arguments

Use the following command to see a list of all available commands.

```bash
./test-node.bash --help
```

## Helper scripts

The repository includes a set of helper scripts for basic actions like funding accounts or bridging funds. You can see a list of the available scripts by running:

```bash
./test-node.bash script --help
```

If you want to see information of a particular script, you can add the name of the script to the help command.

```bash
./test-node.bash script send-l1 --help
```

Here's an example of how to run the script that funds an address on L2. Replace`0x11223344556677889900` with the address you want to fund.

`./test-node.bash script send-l2 --to address_0x11223344556677889900 --ethamount 5`

## Blockscout

Nitro comes with a local [Blockscout](https://www.blockscout.com/) block explorer. To access it, add the param `--blockscout` when running your node.

```bash
./test-node.bash --blockscout
```

The block explorer will be available at `http://localhost:4000`.

## Default endpoints and addresses

Node RPC endpoints are available at:

| Node | Chain id | RPC endpoint |
| --- | --- | --- |
| L1 geth devnet | 1337 | `http://localhost:8545` |
| L2 nitro devnet | 412346 | `http://localhost:8547` and `ws://localhost:8548` |
| L3 nitro (if enabled) | 333333 | `http://localhost:3347` |
| Celestia DA server |  | `http://localhost:9875` |
| Anytrust  |  | `http://localhost:9876` |
| Celestia |  | `http://localhost:26658` |

Some important addresses:

| Role | Public address | Private key |
| --- | --- | --- |
| Sequencer | `0xe2148eE53c0755215Df69b2616E552154EdC584f` | `0xcb5790da63720727af975f42c79f69918580209889225fa7128c92402a6d3a65` |
| Validator | `0x6A568afe0f82d34759347bb36F14A6bB171d2CBe` | `0x182fecf15bdf909556a0f617a63e05ab22f1493d25a9f1e27c228266c772a890` |
| L2 rollup owner | `0x5E1497dD1f08C87b2d8FE23e9AAB6c1De833D927` | `0xdc04c5399f82306ec4b4d654a342f40e2e0620fe39950d967e1e574b32d4dd36` |
| L3 rollup owner (if enabled) | `0x863c904166E801527125D8672442D736194A3362` | `0xecdf21cb41c65afb51f91df408b7656e2c8739a5877f2814add0afd780cc210e` |
| L3 sequencer (if enabled) | `0x3E6134aAD4C4d422FF2A4391Dc315c4DDf98D1a5` | `0x90f899754eb42949567d3576224bf533a20857bf0a60318507b75fcb3edc6f5f` |
| Dev account (prefunded with ETH in all networks) | `0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E` | `0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659` |

## Optional parameters

Here, We show a list of the parameters that might be useful when running a local devnode. You can also use the flag `./test-node.bash --help` to get them.

| Flag | Description |
| --- | --- |
| `--init` | Removes all the data, rebuilds, and deploys a new rollup |
| proof-of-stake chain (using Prysm for consensus) |  |
| heavy computation |  |
| up the L3 chain to use a custom fee token. Only valid if `--l3node` flag is provided |  |
| `--l3-fee-token-decimals` | Number of decimals to use for a custom fee token. Only valid if |
| `--l3-fee-token` flag is provided |  |
| valid if `--l3node` flag is provided |  |
| `--redundantsequencers` | Redundant sequencers [0-3] |
| running them |  |
| configuration: one node as a sequencer/batch-poster/staker (default unless using `--dev`) |  |
| `--tokenbridge` | Deploy an L1-L2 token bridge |
| launching the token bridge |  |
| `--no-simple` | Runs a full configuration with separate sequencer/batch-poster/validator/relayer |
