# Troy - EVM on Celestia

Developers can begin experimenting with solidity and vyper smart contracts
using the new Troy testnet, an EVM compatible sovereign rollup.

[Start building](./troy-smart-contract-tutorial.md)

## About Troy testnet

Previously, developers that wanted to experiment with smart contracts on
Celestia’s Mamaki testnet had to spin up their own local sovereign rollup.
For devs that also want to explore the process of deploying their own rollup,
this step is not a problem. We recognize that there is a need for smart
contract developers to have easier access while minimizing the friction
for deploying on testnets.

With the addition of the Troy testnet, smart contract developers will be
relieved of unnecessary friction. Troy will serve as the place for developers
to test and deploy Ethereum-style smart contracts without creating their own
local network.

Troy is an EVM compatible sovereign rollup built using Ethermint and Optimint.

### About Optimint

[Optimint](https://github.com/celestiaorg/optimint) is our open source software
that turns Cosmos SDK chains into rollups. Ethermint is an EVM execution environment
that plugs into the Cosmos SDK.

### Mamaki Testnet

[Mamaki](http://localhost:3000/nodes/mamaki-testnet) is the Celestia testnet.

Any rollup testnets that are deployed on top of the Mamaki testnet are purely
for developer experimentation. At no point will they transition to mainnets.

In addition, Troy will run in “pessimistic” mode with a centralized sequencer
and without fraud proofs. Decentralized sequencers and fraud proofs are part
of our ongoing development process with Optimint.
