# Setting Up A Validator Node

Validator nodes allow you to participate in consensus in the Celestia network.

> Note: For this guide, you must complete the steps found in Bridge Node Tutorial
  [here](../nodes/bridge-node.md) in order to proceed.


## Run a Validator Bridge Node

Optionally, if you want to join the active validator list, you can create your
own validator on-chain following the instructions below. Keep in mind that
these steps are necessary ONLY if you want to participate in the consensus.

Pick a MONIKER name of your choice! This is the validator name that will show
up on public dashboards and explorers. `VALIDATOR_WALLET` must be the same you
defined previously. Parameter `--min-self-delegation=1000000` defines the
amount of tokens that are self delegated from your validator wallet.

Now, connect to the network of your choice.

You have the following option of connecting to list of networks shown below:

- [Devnet-2](../nodes/devnet-2.md#connect-validator)
