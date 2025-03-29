---
description: How to get started with local development on the Arbitrum Nitro stack.
---

# Quickstart: Run a local devnet

1. Install docker and docker compose.
1. Clone [@celestiaorg/nitro](https://github.com/celestiaorg/nitro.git):

    ```
    git clone -b release --recurse-submodules https://github.com/celestiaorg/nitro.git
    git checkout v3.2.5 && cd /nitro/nitro-testnode
    ```

1. `./celestia-start.sh`
1. Some useful optional commands to use with the start script:
    - `--validate` (heavy computation, validates all blocks in WASM)
    - `--anytrsut` (launches anytrust DAC locally, useful to test anytrust fallbacks)

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

## Default endpoints and addresses

Node RPC endpoints are available at:

| Node | Chain id | RPC endpoint |
| --- | --- | --- |
| L1 geth devnet | 1337 | `http://localhost:8545` |
| L2 nitro devnet | 412346 | `http://localhost:8547` and `ws://localhost:8548` |
| L3 nitro (if enabled) | 333333 | `http://localhost:3347` |
| Celestia DA server |  | `http://localhost:9875` |
| Anytrust  |  | `http://localhost:9876` |
| Celestia Node |  | `http://localhost:26658` |
