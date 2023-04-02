# The Blockspace Race

![Banner](/img/blockspace_race.jpg)

## Table of Contents

* [Overview](#overview)
  * [Consensus Network](#consensus-network)
  * [Data Availability Network](#data-availability-network)
  * [Getting Started](#getting-started)
  * [Security Policy](#security-policy)
  * [Points and Rewards](#points-and-rewards)
  * [Participation Rules](#participation-rules)
  * [Software Version Numbers](#software-version-numbers)
  * [Participation By Node Count](#participation-by-node-count)
* [Testnet Phases](#testnet-phases)
* [Useful links](#useful-links)
* [Terms and Conditions](#terms-and-conditions)

## Overview

Celestia is the first modular blockchain network. Its mission is
to make deploying a blockchain as easy as deploying a new smart
contract. Celestia introduces what is called the data availability
layer for enabling efficient scaling and allowing L2 rollups to
do data sampling for transactions they need.

The Blockspace Race will help put the Celestia network through its
paces to harden features and prepare node operators for mainnet launch.
Learn more about the design of the program and its importance for the
Celestia community at our announcement post [here](https://blog.celestia.org/the-blockspace-race/).

Since Celestia is made up of two networks (consensus and data
availability), the incentivized testnet consists of multiple node types.

### Consensus Network

* Validator Node: Orders transactions in the block and participate
  in consensus.
* Consensus Full Nodes: Syncs the chain history but does not sign
  the transaction block.

### Data Availability Network

* Bridge Node: Bridges blocks between the data availability network
  and the consensus network.
* Light Node: Conducts data availability sampling on the data
  availability network.
* Full Storage Node: Stores all the data but does not connect to
  the consensus network.

Participants have been selected to run a node type from the above
list, with a limit of one node per participant. The Blockspace Race
will consist of five phases. Each phase will have different tasks
depending on which node type participant will operate. Points are earned
by completing these tasks, with additional bonus tasks that the team
will evaluate at their sole discretion.

The Celestia Labs team will provide all information, support,
announcements and updates on [Discord](https://discord.com/invite/YsnTPcSfWQ)
and [official website](https://celestia.org). We also encourage
participants to familiarise themselves with the [Supplemental Incentivized
Testnet Terms](https://docs.celestia.org/community/itn-tos/), which
govern participation in the program.

> **NOTE**: Node operator tasks will include three data availability node subtypes:
  Bridge Nodes, Full Storage Nodes and Light Nodes. If you have been selected
  to run one of the three data availability node subtypes, please make sure
  to only perform the tasks corresponding to your node type. You will only
  receive points for completed tasks corresponding to your node types.
  If there is no indication that a node operator task is specific to any
  of the three subtypes (such as the Bonus tasks), you are eligible for
  that task also.

### Getting Started

* All participants should join [Celestia Discord](https://discord.gg/celestiacommunity).
* All participants will receive access to their profile on [Knack portal](https://www.knack.com/).
  Wait for an email for further instructions on profile setup.
* Participants will be granted appropriate tags on Discord based on the
  node type they were selected for.
* Setup guides, timelines, and other relevant information is posted within the phases.

### Security Policy

In the interest of reporting security issues and vulnerabilities, please
refer to our Security Policy found [here](https://blog.celestia.org/the-blockspace-race/).

### Points And Rewards

Celestia is allocating 15,000,000.00 TIA tokens in rewards for
participants of the Blockspace Race. Points earned during the event
will be converted into TIA tokens after the event ends.

Please note that the points you receive for participating and
completing the incentivized testnet program will be available to
claim once the Celestia mainnet launches. Eligibility requirements
and restrictions related to points and tokens are described in
the [Supplemental Incentivized Testnet Terms](https://docs.celestia.org/community/itn-tos/).

### Participation Rules

As a participant in the incentivized testnet program, you must observe the following
participation rules:

* Abuse of the incentivized testnet faucet or other violations of
  the [Supplemental Incentivized Testnet Terms](https://docs.celestia.org/community/itn-tos/)
  are punishable by removal from the incentivized testnet program.
  **Your balance or usage of testnet faucet tokens will not translate
  into any points or mainnet tokens**.
* Validators are required to also run bridge nodes but cannot gain
  points for running both
* Please ensure you submit your own work (node id, tx hashes, etc).
  Submitting another participant’s work will result in immediate removal
  from the incentivized testnet. We will be monitoring it and have security
  checks in place.

### Software Version Numbers

Here we list the relevant version numbers for the software packages and libraries
that will be used in the incentivized testnet:

* Celestia Node - v0.8.0
* Celestia App - v0.12.1
* Rollkit - v0.7.1

### Participation By Node Count

#### Consensus Participants

* 100 validator nodes

#### Data Availability Participants

* 740 light nodes
* 50 bridge nodes
* 50 full storage nodes

#### RPC Endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

We will be listing RPC endpoints
provided by the community here.

* [https://rpc-blockspacerace.pops.one/](https://rpc-blockspacerace.pops.one/)
* [https://rpc-1.celestia.nodes.guru/](https://rpc-1.celestia.nodes.guru/)
* [https://rpc-2.celestia.nodes.guru/](https://rpc-2.celestia.nodes.guru/)
* [https://celestia-testnet.rpc.kjnodes.com/](https://celestia-testnet.rpc.kjnodes.com/)
* [https://celestia.rpc.waynewayner.de/](https://celestia.rpc.waynewayner.de/)
* [https://rpc-blockspacerace.mzonder.com/](https://rpc-blockspacerace.mzonder.com/)
* [https://rpc-t.celestia.nodestake.top/](https://rpc-t.celestia.nodestake.top/)
* [https://rpc-blockspacerace.ryabina.io/](https://rpc-blockspacerace.ryabina.io/)
* [https://celest-archive.rpc.theamsolutions.info/](https://celest-archive.rpc.theamsolutions.info/)
* [https://blockspacerace-rpc.chainode.tech/](https://blockspacerace-rpc.chainode.tech/)
* [https://rpc-blockspacerace.suntzu.pro/](https://rpc-blockspacerace.suntzu.pro/)
* [https://public.celestia.w3hitchhiker.com/](https://public.celestia.w3hitchhiker.com/)
* [https://rpc.celestia.stakewith.us/](https://rpc.celestia.stakewith.us/)
* [https://celestia-rpc.validatrium.club/](https://celestia-rpc.validatrium.club/)
* [https://celrace-rpc.easy2stake.com/](https://celrace-rpc.easy2stake.com/)
* [http://rpc.celestia.blockscope.net/](http://rpc.celestia.blockscope.net/)
* [https://rpc-celestia-testnet-blockspacerace.keplr.app/](https://rpc-celestia-testnet-blockspacerace.keplr.app/)
* [http://celestiarpc.bloclick.com/](http://celestiarpc.bloclick.com/)
* [https://celestia-testnet-rpc.swiss-staking.ch/](https://celestia-testnet-rpc.swiss-staking.ch/)
* [https://rpc-blockspacerace.moonli.me/](https://rpc-blockspacerace.moonli.me/)
* [http://rpc-celestia.gpvalidator.com/](https://rpc-celestia.gpvalidator.com/)
* [https://rpc-celestia.activenodes.io/](https://rpc-celestia.activenodes.io/)
* [https://rpc-testnet.celestia.forbole.com/](https://rpc-testnet.celestia.forbole.com/)
* [http://209.126.86.119:26657](http://209.126.86.119:26657)

#### gRPC Endpoints

The gRPC endpoint is to allow users to interact with a celestia-node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

* [https://grpc-blockspacerace.pops.one/](https://grpc-blockspacerace.pops.one/)
* [http://rpc-1.celestia.nodes.guru:10790/](http://rpc-1.celestia.nodes.guru:10790/)
* [http://rpc-2.celestia.nodes.guru:10790/](http://rpc-2.celestia.nodes.guru:10790/)
* [https://celestia-testnet.grpc.kjnodes.com/](https://celestia-testnet.grpc.kjnodes.com/)
* [https://celestia.waynewayner.de/grpc/](https://celestia.waynewayner.de/grpc/)
* [https://grpc-blockspacerace.mzonder.com:443/](https://grpc-blockspacerace.mzonder.com:443/)
* [https://grpc-t.celestia.nodestake.top/](https://grpc-t.celestia.nodestake.top/)
* [https://grpc-blockspacerace.ryabina.io:9090/](https://grpc-blockspacerace.ryabina.io:9090)
* [https://celest-archive.grpc.theamsolutions.info:9090/](https://celest-archive.grpc.theamsolutions.info:9090/)
* [https://blockspacerace-grpc.chainode.tech/](https://blockspacerace-grpc.chainode.tech/)
* [https://grpc-blockspacerace.suntzu.pro:9090/](https://grpc-blockspacerace.suntzu.pro:9090/)
* [https://public.celestia.w3hitchhiker.com/](https://public.celestia.w3hitchhiker.com/)
* [https://grpc.celestia.stakewith.us/](https://grpc.celestia.stakewith.us/)
* [https://celrace-grpc.easy2stake.com/](https://celrace-grpc.easy2stake.com/)
* [http://rpc.celestia.blockscope.net:9191/](http://rpc.celestia.blockscope.net:9191/)
* [https://grpc-celestia-testnet-blockspacerace.keplr.app/](https://grpc-celestia-testnet-blockspacerace.keplr.app/)
* [http://celestiarpc.bloclick.com:9090/](http://celestiarpc.bloclick.com:9090/)
* [http://celestia-testnet-grpc.swiss-staking.ch:10690/](http://celestia-testnet-grpc.swiss-staking.ch:10690/)
* [http://rpc-celestia.gpvalidator.com:9090/](https://rpc-celestia.gpvalidator.com:9090/)

#### API Endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

* [https://api-blockspacerace.pops.one/](https://api-blockspacerace.pops.one/)
* [https://api-1.celestia.nodes.guru/](https://api-1.celestia.nodes.guru/)
* [https://api-2.celestia.nodes.guru/](https://api-2.celestia.nodes.guru/)
* [https://celestia-testnet.api.kjnodes.com](https://celestia-testnet.api.kjnodes.com)
* [https://celestia.waynewayner.de/api](https://celestia.waynewayner.de/api)
* [https://api-blockspacerace.mzonder.com/](https://api-blockspacerace.mzonder.com/)
* [https://api-t.celestia.nodestake.top/](https://api-t.celestia.nodestake.top/)
* [https://api-blockspacerace.ryabina.io/](https://api-blockspacerace.ryabina.io/)
* [https://celest-archive.api.theamsolutions.info/](https://celest-archive.api.theamsolutions.info/)
* [https://blockspacerace-api.chainode.tech/](https://blockspacerace-api.chainode.tech/)
* [https://api-blockspacerace.suntzu.pro/](https://api-blockspacerace.suntzu.pro/)
* [https://public.celestia.w3hitchhiker.com/](https://public.celestia.w3hitchhiker.com/)
* [https://api.celestia.stakewith.us/](https://api.celestia.stakewith.us/)
* [https://celestia-api.validatrium.club/](https://celestia-api.validatrium.club/)
* [https://celrace-lcd.easy2stake.com/](https://celrace-lcd.easy2stake.com/)
* [http://rpc.celestia.blockscope.net/](http://rpc.celestia.blockscope.net/)
* [https://lcd-celestia-testnet-blockspacerace.keplr.app/](https://lcd-celestia-testnet-blockspacerace.keplr.app/)
* [http://celestiarpc.bloclick.com/](http://celestiarpc.bloclick.com/)
* [https://celestia-testnet-api.swiss-staking.ch/](https://celestia-testnet-api.swiss-staking.ch/)
* [http://rpc-celestia.gpvalidator.com/](https://rpc-celestia.gpvalidator.com/)

### Blockspace Race testnet faucet

USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA
TOKENS DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES
OR OTHER PUBLIC DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Blockspace Race Testnet Faucet on the #faucet
channel in the Blockspace Race category on Celestia's
Discord server with the following command:

```bash
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

Note: Faucet has a limit of 50 tokens per week per address/Discord ID

## Testnet Phases

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
### Phase 1: Liftoff

![Banner](/img/phase1.jpg)

* Start: 7 March 2023
* End: 21 March 2023, 23:59 UTC
* Break: 7 days

<details>
<summary>Validator Tasks</summary>

| Validator Tasks | Task type | Points |
| ------------- | ------------- | ------------- |
| [Set up your validator](./itn-setup-validator.md) | Network  | 80 |
| [Sign the genesis block](./itn-sign-genesis.md) | Network  | 45 |
| [Maintain high uptime](./itn-high-uptime.md) | Network | Score at the end of Phase 5 / 350 |
</details>

### Phase 2: Staging

* Start: 29 Mar 2023
* End: 3 Apr 2023
* Break: 7 days

![Banner](/img/phase2.jpg)

<details>
<summary>Validator tasks</summary>

| Validator tasks  | Task type | Points |
| ------------- | ------------- | ------------- |
| [Maintain high uptime](./itn-high-uptime.md) | Network  | Score at the end of Phase 5 / 350 |
| [Claim your validator rewards](./itn-claim-rewards.md) | Network  | 20 |
</details>

<details>
<summary>Node operator tasks</summary>

| Node operator tasks | Task type | Points |
| ------------- | ------------- | ------------- |
| [Deploy light node](./itn-deploy-light.md) | Network  | 10 |
| [Deploy bridge node](./itn-deploy-bridge.md) | Network  | 30 |
| [Deploy full storage node](./itn-deploy-full.md) | Network  | 15 |
| [Restart your node with metrics flags for tracking uptime (all 3 node types)](./itn-enable-telemetry-nodes.md) | Network  | 5 |
| [Maintain high uptime throughout the Incentivized Testnet](./itn-high-uptime-node.md) (Light nodes) | Network | Score at the end of Phase 5 / 25 |
| [Maintain high uptime throughout the Incentivized Testnet](./itn-high-uptime-node.md) (Bridge nodes) | Network | Score at the end of Phase 5 / 110 |
| [Maintain high uptime throughout the Incentivized Testnet](./itn-high-uptime-node.md) (Full storage nodes) | Network | Score at the end of Phase 5 / 80 |
</details>

### Bonus phase

* Start: 29 Mar 2023
* End: 8 May 2023

<details>
<summary>Validator tasks</summary>

| Validator tasks | Task type | Points |
| ------------- | ------------- | ------------- |
| [Write a technical article](./itn-setup-writeup.md) | Bonus  | Bonus pool |
| [Create toolings for the Celestia Network](./itn-toolings.md) | Bonus  | Bonus pool |
| [Run a public seed or RPC node](./itn-rpc-node.md) | Bonus | Bonus pool |
| [Deploy a sovereign rollup](./itn-deploy-rollup.md) | Bonus  | Bonus pool |
</details>

<details>
<summary>Node operator tasks</summary>

| Node operator tasks | Task type | Points |
| ------------- | ------------- | ------------- |
| [Write a technical article](./itn-setup-writeup.md) (bridge and full storage nodes) | Bonus  | Bonus pool |
| [Create toolings for the Celestia Network](./itn-toolings.md) (all 3 node types) | Bonus  | Bonus pool |
| [Create a UI for submitting PayForBlob txs](./itn-pfb-ui.md) (all 3 node types) | Bonus | Bonus Pool |
| [Deploy a sovereign rollup](./itn-deploy-rollup.md) (all 3 node types) | Bonus  | Bonus Pool |
| [Conduct performance analysis of your node](./itn-node-analysis.md) (all 3 node types) | Bonus | Bonus Pool |
</details>

<!-- markdownlint-enable MD033 -->
<!-- markdownlint-enable MD013 -->

## Useful Links

* [Website](https://celestia.org/)
* [Documentation](https://docs.celestia.org/)
* [Task Submission Portal](https://www.knack.com/)
* [Metrics Dashboard](https://tiascan.com)

## Terms of Service

A link to Celestia’s Incentivized Testnet Supplemental Terms can be found
[here](https://docs.celestia.org/community/itn-tos/). Those incorporate
our website [Terms of Service](https://celestia.org/tos/) by reference.
We encourage you to review and familiarise yourself with all relevant terms.

## Community Code of Conduct

A link to our Community Code of Conduct can be found [here](https://docs.celestia.org/community/coc/).

## Privacy Policy

A link to our Privacy Policy can be found [here](https://celestia.org/privacy/).
