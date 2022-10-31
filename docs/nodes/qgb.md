# Quantum Gravity Bridge

The Quantum Gravity Bridge, covered previously in the Celestia blog post
found [here](https://blog.celestia.org/celestiums/), introduces the concept
of a Celestium, which is an EVM L2 rollup that uses Celestia for data availability
but settles on Ethereum (or any other EVM L1 chain).

This tutorial goes over the Quantum Gravity Bridge and how Validators on Celestia
can enable and run it.

## Overview

The Quantum Gravity Bridge (will be referred as QGB for the remainder of this article),
consists of two components: an Orchestrator and a Relayer.

In the following diagram, we show how an EVM L2 Rollup would post the data to
Celestia while the Celestia Validators attest to transactions in a one-way bridge
connected to an EVM L1 Layer (in this case, Ethereum). Then, the EVM L2 Rollup will
verify the attestations directly on Ethereum on the QGB smart contract. You can
reference the QGB smart contract [here](https://github.com/celestiaorg/quantum-gravity-bridge/blob/master/src/QuantumGravityBridge.sol).

![QGB-Architecture](/img/nodes/qgb-diagram.png)

The QGB Validator set specification that is doing the attestation can be found in
this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-002-qgb-valset.md).

The QGB attestation process is defined more in-depth in this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-003-qgb-data-commitments.md).

The Orchestrator is part of the Validator setup and works as follows:

* Celestia App submits an attestation to the Orchestrator
* The Orchestrator then submits a signed attestation back to Celestia App

The diagram below goes over this process.

![QGB-Orchestrator](/img/nodes/qgb-orchestrator.png)

The Relayer deploys the QGB smart contract first to the EVM L1 chain (if it is
not deployed before) and then relays the attestations from Celestia App to the
EVM L1 Chain.

The diagram below goes over this process.

![QGB-Relayer](/img/nodes/qgb-relayer.png)

You can learn more about the mechanics behind the Relayer in this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-004-qgb-relayer-security.md).

## Setting Up the QGB

The following section presumes you have the following setup:

* A Celestia App [Validator](./validator-node.md) running
* A Celestia Node - [Bridge Node](./bridge-node.md) running

### Validator QGB Flags

Be sure that your Validator node has the following flags running before starting
the QGB: `--orchestrator-address` and `--evm-address`.

So, your setup for your Validator node should look like this:

```sh
celestia-appd start --orchestrator-address <key-name> --evm-address <EVM-ADDRESS>
```

Here, your `orchestrator-address` can be your Validator address but we recommend
generating a new Celestia address for the orchestrator.

Your EVM address can be generated with Metamask or any other EVM key generation
tools in order to get the public address that stars with `0x`.

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
SHOW LOGS
```

With that, you have started the orchestrator! Now, let's move on to the Relayer.

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
SHOW LOGS
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
SHOW LOG
```

With that, the QGB for your Validator is running. You can check the smart contract
address on Sepolia Block Explorer to view the attestations being submitted to the
smart contract.
