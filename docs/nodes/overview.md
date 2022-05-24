
## Overview

Devnet demonstrates Celestia’s data availability capabilities by running two individual but connected networks:


![Network Overview](diagrams/NetworkOverview.png)

1. A libp2p **DA network** with [Bridge Nodes](#bridge-nodes) which relay and process blocks from the celestia-core network and [Light Nodes](#celestia-light-nodes), which do data availability sampling those blocks.
2. A p2p **Consensus network** ("celestia-core network) with [**Validator Nodes**](#bridge-validator-nodes) that handles the underlying consensus and block production. 

> Note that mainnet may look very different from this devnet implementation, as the architecture continues to be improved. You can read more about devnet decisions here ([see ADR](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-003-march2022-testnet.md)).

### Celestia (Validator) Bridge Nodes
![Bridge Nodes](diagrams/BridgeNodes.png)
Specifically, Bridge Nodes: 

1. Import and process “raw” headers & blocks from a trusted Core process (meaning a trusted RPC connection to a celestia-core node) in the Consensus network. Bridge Nodes can run this Core process internally (embedded) or simply connect to a remote endpoint. Bridge Nodes also have the option of being an active validator in the Consensus network.
2. Validate and erasure code the "raw" blocks
3. Supply block shares with data availability headers to Light Nodes in the DA network.

From an implementation perspective, Bridge Nodes run two separate processes:

1. Celestia App with Celestia Core ([see repo](https://github.com/celestiaorg/celestia-app))
    - **Celestia App** is the state machine where the application and the proof-of-stake logic is run. Celestia App is built on [Cosmos SDK](https://docs.cosmos.network/) and also encompasses **Celestia Core**.
    - **Celestia Core** is the state interaction, consensus and block production layer. Celestia Core is built on [Tendermint Core](https://docs.tendermint.com/), modified to store data roots of erasure coded blocks among other changes ([see ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture)).
2. Celestia Node ([see repo](https://github.com/celestiaorg/celestia-node))
    - **Celestia Node** augments the above with a separate libp2p network that serves data availability sampling requests. The team sometimes refer to this as the "halo" network.

### Celestia Light Nodes
![Light Nodes](diagrams/LightNodes.png)

In the Devnet, Light Nodes:
1. Connect to a [Celestia Bridge Node](#celestia-validator-bridge-nodes) in the DA network. *Note: Light Nodes do not communicate with each other, but only with Bridge Nodes.*
2. Listen for `ExtendedHeader`s, i.e. wrapped “raw” headers, that notify Celestia Nodes of new block headers and relevant DA metadata.
3. Perform data availability sampling (DAS) on the received headers



# Overview to Running Nodes on Celestia

There are many ways you can participate in the Celestia network.

Celestia node operators can run several options on the network:

* [Bridge Node](../nodes/bridge-node.md): This node bridges blocks between the
  Data-Availability network and the Consensus network.
* [Validator Node](../nodes/validator-node.md): Node operators who run a Bridge
  Node have the option to also participate in Consensus by becoming a Validator.
* [Light Node](../nodes/light-node.md): Light clients conduct data availability
  sampling on the Data Availability network.

You can learn more about how to setup each different node by going through
this tutorial guide.

Both Bridge and Validator nodes are part of the same section.
Light Clients have their own section.

Please provide any feedback on the tutorials and guides. If you notice
a bug or issue, feel free to make a Pull Request or write up a Github
Issue ticket!
