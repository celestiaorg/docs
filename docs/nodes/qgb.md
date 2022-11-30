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

The specification of the QGB `Valset`s, which track the Celestia validator set
changes, can be found in this [ADR](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-002-qgb-valset.md).

The QGB data commitments, which represent commitments over sets of blocks
defined by a data commitment window, are
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
