# Quantum Gravity Bridge

The Quantum Gravity Bridge, covered previously in the Celestia blog post
found [here](https://blog.celestia.org/celestiums/), introduces the concept
of a Celestium, which is an EVM L2 rollup that uses Celestia for data availability
but settles on Ethereum (or any other EVM L1 chain).

This tutorial goes over the Quantum Gravity Bridge and how Validators on Celestia
can run it.

## Overview

The Quantum Gravity Bridge (will be referred as QGB for the remainder of this article),
consists of two components: an Orchestrator and a Relayer.

In the following diagram, we show how a celestium would post the data to
Celestia. This will later be attested to by the Celestia validator set, and
eventually posted to the target EVM chain (in this case, Ethereum). Then,
the celestium, or any party, will be able to verify the attestations, i.e. valsets
and data commitments, directly on the EVM chain on the QGB smart contract. You can
reference the QGB smart contract [here](https://github.com/celestiaorg/quantum-gravity-bridge/blob/master/src/QuantumGravityBridge.sol).

![QGB-Architecture](/img/nodes/qgb-diagram.png)

The specification of the QGB valsets, which track the Celestia validator set
changes, can be found in this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-002-qgb-valset.md).

The QGB data commitments, which represent commitments over sets of blocks, are
discussed more in-depth in the following [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-003-qgb-data-commitments.md).

The Orchestrator is part of the Validator setup and works as follows:

* Celestia App: creates an attestation on the state machine level that needs to
  be signed
* The Orchestrator: queries the attestation, signs it, then submits the signature
  back to Celestia App

The diagram below goes over this process.

![QGB-Orchestrator](/img/nodes/qgb-orchestrator.png)

The Relayer deploys the QGB smart contract first to the EVM L1 chain (if it is
not deployed before), and then relays the attestations from Celestia App to the
EVM L1 Chain.

The diagram below goes over this process.

![QGB-Relayer](/img/nodes/qgb-relayer.png)

You can learn more about the mechanics behind the Relayer in this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-004-qgb-relayer-security.md).

## Setting Up the QGB

The following section presumes you have the following setup:

* A Celestia App [Validator](./validator-node.md) running
* A Celestia Node - [Bridge Node](./bridge-node.md) running

### Validator QGB Flags

Make sure that your validator has already the correct Orchestrator address
and EVM address. These can be specified when creating a new Validator, or
editing an existing one, using the following flags:
`--orchestrator-address` and `--evm-address`.

So, your setup for your Validator node should look like this:

```sh
celestia-appd tx staking create-validator \
    --orchestrator-address="<orch_address>" \
    --evm-address="<evm_address>" \
    ... (other validator creation flags)
```

Here, your `orchestrator-address` can be your Validator address but we recommend
generating a new Celestia address for the orchestrator.

Your EVM address can be generated with Metamask or any other EVM key generation
tools in order to get the public address, in hex format, that stars with `0x`.

### Starting the Orchestrator

With your celestia-app Validator running in one Terminal session, open a new
Terminal session in order to run the Orchestrator.

You can run the following command to start the Orchestrator:

<!-- markdownlint-disable MD013 -->
```sh
celestia-appd orchestrator -x "mocha" -d <EVM-PRIVATE-KEY> --keyring-account validator --keyring-backend=test
```
<!-- markdownlint-enable MD013 -->

The `-x` flag references the chain-id of the Celestia network. Here, we are
connecting it to Mocha Testnet so we are using `mocha`.  

The `-d` flag refers to your EVM Private Key that will be used to sign the
transactions.

`keyring-account` refers to the validator key name on Celestia.

Running the orchestrator command above will show logs like the following
output:

```sh
D[2022-11-02|23:04:32.758] initializing orchestrator                    
D[2022-11-02|23:04:32.766] starting orchestrator                        
I[2022-11-02|23:04:32.766] listening for new block events...            
I[2022-11-02|23:04:32.768] syncing missing nonces                       latest_nonce=2 last_unbonding_height=0
D[2022-11-02|23:04:32.768] enqueueing missing attestation nonce         nonce=2
D[2022-11-02|23:04:32.768] enqueueing missing attestation nonce         nonce=1
I[2022-11-02|23:04:32.768] finished syncing missing nonces              latest_nonce=2 last_unbonding_height=0
E[2022-11-02|23:04:32.768] stopping enqueing missing attestations       
D[2022-11-02|23:04:32.768] processing nonce                             nonce=2
I[2022-11-02|23:04:32.919] signed commitment                            nonce=2 begin_block=0 end_block=5 commitment=A288BB22829DFF30508A7D22C3943507D3056D6FDEA3E42D845E55277D991996 tx_hash=BC372BF3018CF57A924E9687942EAC3FAC01688D943E5E62B9C85D9DD80175F4
D[2022-11-02|23:04:32.919] processing nonce                             nonce=1
I[2022-11-02|23:04:33.938] signed Valset                                nonce=1 tx_hash=0C4F6312D138CEA3D65DA4D5084C0A7BE4B8E680D083A326E150EC23DCBB8FC4
D[2022-11-02|23:04:36.993] enqueueing new attestation nonce             nonce=3
D[2022-11-02|23:04:36.993] processing nonce                             nonce=3
I[2022-11-02|23:04:38.012] signed commitment                            nonce=3 begin_block=5 end_block=10 commitment=7132B548311BA737EEC4085096B34FE436DCC5A78801C3E58F2AD20992567006 tx_hash=358702C95CC848D1511934A894AD9784507FB826BFDE31D2685E704111803302
D[2022-11-02|23:04:42.097] enqueueing new attestation nonce             nonce=4
D[2022-11-02|23:04:42.097] processing nonce                             nonce=4
I[2022-11-02|23:04:43.106] signed commitment                            nonce=4 begin_block=10 end_block=15 commitment=D541B8F010C615172570B181BBE57A8C2314CE3B9E785EF831EC2FF0A5B8D93A tx_hash=FBC01DAFBEE82B02F8041574B05154C9C09A8723A06F66B327F13C6D869868EE
```

With that, you have started the orchestrator! Now, let's move on to the Relayer.

PS: Validators don't need to run relayers or deploy the QGB smart contract.
They can, but it is not a must.

### Using the Relayer to Deploy the QGB Smart Contract

Open a new terminal session in order to deploy the QGB Smart Contract.

> NOTE: This step is necessary if no QGB Smart Contract is deployed on an EVM
  Chain. Here, we are deploying to the Ethereum Sepolia Testnet.

<!-- markdownlint-disable MD013 -->
```sh
celestia-appd deploy -x "test" -d <EVM-PRIVATE-KEY> -e https://rpc.sepolia.org -z 11155111
```
<!-- markdownlint-enable MD013 -->

For this to work, you will need Sepolia tokens on your EVM address you generated
earlier. You can use the Sepolia Faucet to get Sepolia tokens [here](https://sepolia-faucet.pk910.de/).

The `-e` flag references the RPC endpoint for Sepolia in order to connect to it.

The `-z` flag references the Chain ID of Sepolia.

When you run the command, you should get the following output that indicates
the QGB Smart Contract has been deployed:

```sh
I[2022-11-02|23:05:37.293] deployed QGB contract                        address=0x735e796b72c13E427C8eD9d1a24f6e6147217CE1 hash=0xbc06b4b861f6e9ffbd4c3f8bb393085182a441141e906e7b3b4f5cb38584c3cc
```

The logs will show you both the smart contract address for the deployed QGB
smart contract on Sepolia as well as the transaction hash. You can use the
Sepolia explorer to view the contract address [here](https://sepolia.etherscan.io/).

With that, you have successfully deployed the QGB Smart Contract. Let's now
run the Relayer.

### Run the Relayer

You can run the relayer in a separate terminal session with the following command:

<!-- markdownlint-disable MD013 -->
```sh
celestia-appd relayer -a <QGB-CONTRACT-ADDRESS> -d <EVM-PRIVATE-KEY> -e https://rpc.sepolia.org -z 11155111  -l 25000000
```
<!-- markdownlint-enable MD013 -->

The `-a` flag must be the QGB smart contract address that you received in the output
when you deployed the smart contract in the previous section.

The `-l` flag refers to the gas limit being set for the Relayer.

Running the command will give you the following output:

```sh
D[2022-11-02|23:06:18.029] found enough data commitment confirms to be relayed majThreshHold=2863311532 currThreshold=4294967296
I[2022-11-02|23:06:18.030] relaying data commitment 0-5...              
D[2022-11-02|23:06:18.813] waiting for data commitment to be confirmed  nonce=2 hash=0x16d4762e4955691589a1e8f22cd0f25e9f3a7e6783e2b014f708ddd8005fb58b
I[2022-11-02|23:06:37.018] relayed data commitment                      nonce=2 hash=0x16d4762e4955691589a1e8f22cd0f25e9f3a7e6783e2b014f708ddd8005fb58b
D[2022-11-02|23:06:37.206] found enough data commitment confirms to be relayed majThreshHold=2863311532 currThreshold=4294967296
I[2022-11-02|23:06:37.207] relaying data commitment 5-10...             
D[2022-11-02|23:06:38.023] waiting for data commitment to be confirmed  nonce=3 hash=0xe142d968897c20962211da34e4b61a38379d14e24f0057074bedce6028dc0c76
```

With that, the QGB for your Validator is running. You can check the smart contract
address on Sepolia Block Explorer to view the attestations being submitted to the
smart contract.

## Automated Network Generation

You have a few resources you can use for instantiating a local QGB Network.

### Shell Script

You have the following script [here](https://github.com/celestiaorg/celestia-app/blob/main/scripts/single-node.sh)
You can run it with the following command:

```sh
cd celestia-app/
git checkout qgb-integration # currently, the QGB V1 lives in a feature branch
make install
bash script/single-node.sh
```

This starts a local network with QGB enabled. You can then run the Orchestrator
and Relayer after which were covered in the previous sections.

### Docker Compose

You have a Docker Compose set up you can use to build all the nodes
and the QGB network for you.

You can start it with the following commands:

```sh
cd celestia-app/
git checkout qgb-integration
cd e2e/qgb/
docker-compose up
```

This will setup and install your QGB network with Docker Compose.
