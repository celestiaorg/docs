# Troy Testnet

![Troy Testnet](/img/troy-testnet.png)

Developers can begin testing Solidity and Vyper smart contracts
using the new Troy testnet, an experimental EVM compatible sovereign rollup.

[Start building](./troy-smart-contract-tutorial.md)

## About Troy testnet

[Optimint](https://github.com/celestiaorg/optimint) and
[Ethermint](https://docs.ethermint.zone/intro/overview.html), in tandem with the
[Cosmos SDK](https://github.com/cosmos/cosmos-sdk/), serve as the basis for
Troy. Optimint is an ABCI client for Cosmos SDK chains that enables them to become
rollups on Celestia. Ethermint is an EVM-compatible execution environment that plugs
into the Cosmos SDK.

Together, the combination creates an experimental EVM compatible sovereign rollup
testnet.

Any rollup testnets that are deployed on top of the [Mamaki](/nodes/mamaki-testnet)
testnet are purely for developer experimentation. At no point will they transition
to mainnets.

In addition, Troy will run in “pessimistic” mode with a centralized sequencer
and without fraud proofs. Decentralized sequencers and fraud proofs are part
of our ongoing development process with Optimint.
