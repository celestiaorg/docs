# Deploying a smart contract to Celestia Ethermint with Foundry
<!-- markdownlint-disable MD013 -->

In this guide you'll learn how to deploy a Solidity smart contract to Celestia Ethermint with [Foundry](https://github.com/foundry-rs/foundry).

## About Foundry

Foundry is a portable, fast and modular toolkit for Ethereum application development.

Foundry is made up of three components:

[__Forge__](https://github.com/foundry-rs/foundry/tree/master/forge): Ethereum testing framework (like Truffle, Hardhat and DappTools).

[__Cast__](https://github.com/foundry-rs/foundry/tree/master/cast): CLI for interacting with EVM smart contracts, sending transactions, and getting chain data.

[__Anvil__](https://github.com/foundry-rs/foundry/tree/master/anvil): Local Ethereum node, similar to Ganache or Hardhat Network.

We'll use all three to create, test, and deploy our Solidity project.

> To learn more about Foundry, check out the [Foundry Book](https://book.getfoundry.sh/).

## Getting started

To deploy to Celestia Ethermint you will need to request tokens from the test faucet.

### Celestia Ethermint Faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF CELESTIA OR CELESTIA ETHERMINT TOKENS. MAINNET CELESTIA AND CELESTIA ETHERMINT TOKENS DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC DISTRIBUTIONS OF ANY MAINNET CELESTIA OR CELESTIA ETHERMINT TOKENS.

You can request from Celestia Ethermint Faucet on the `#celestia-ethermint-faucet` channel on Celestia's Discord server with the following command:

```sh
$request <EVM-WALLET-ADDRESS> 
```

### Initialize development environment

First, be sure to [install Foundry](https://book.getfoundry.sh/getting-started/installation.html) on your local development envrionment.

Next, create a new project and change into the directory:

```sh
forge init celestia-ethermint-app

cd celestia-ethermint-app
```

Foundry has created an example smart contract located at __src/Contract.sol__.

### Updating the contract and tests

Let's update the contracts to include a basic counter example. Create a new file in the __src__ directory named __Counter.sol__ and add the following code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    int private count;
    
    constructor(int _count) {
        count = _count;
    }

    function incrementCounter() public {
        count += 1;
    }
    function decrementCounter() public {
        count -= 1;
    }

    function getCount() public view returns (int) {
        return count;
    }
}
```

Next, let's create a test for this contract.

Open __test/Contract.T.Sol__ and update the code with the following:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import 'src/Counter.sol';

contract ContractTest is Test {
    Counter counter;
    function setUp() public {
        counter = new Counter(10);
    }

    function testGetCount() public {
        int value = counter.getCount();
        assertEq(value, 10);
        emit log_int(value);
    }

    function testIncrement() public {
        counter.incrementCounter();
        counter.incrementCounter();
        int value = counter.getCount();
        assertEq(value, 12);
        emit log_int(value);
    }

    function testDecrement() public {
        counter.decrementCounter();
        int value = counter.getCount();
        assertEq(value, 9);
        emit log_int(value);
    }
}
```

Foundry uses [Dappsys Test](https://book.getfoundry.sh/reference/ds-test.html) to provide basic logging and assertion functionality. It's included in the Forge Standard Library.

Here, we are using `assertEq` to assert equality. You can view all of the assertion functions available [here](https://book.getfoundry.sh/reference/ds-test.html?highlight=log_int#asserting).

Next, we can test the contract using __Forge__ with the following command:

```sh
forge test -vv
```

### Updating the deployment script

Now that we've tested the contract, let's try deploying it locally using [Solidity Scripting](https://book.getfoundry.sh/tutorials/solidity-scripting.html).

To do so, update the deloyment script at __script/Contracts.s.sol__ with the following code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {Counter} from "src/Counter.sol";

contract ContractScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new Counter(10);
        vm.stopBroadcast();
    }
}
```

Now we can use this script to deploy our smart contract to either a live or test network.

### Deploying locally

Next start Anvil, the local testnet:

```sh
anvil
```

Once started, Anvil will give you a local RPC endpoint as well as a handful of Private Keys and Accounts that you can use.

We can now use the local RPC along with one of the private keys to deploy locally:

```sh
forge script script/Contract.s.sol:ContractScript --fork-url http://localhost:8545 \
--private-key $PRIVATE_KEY --broadcast
```

Once the contract has been deployed locally, we can test sending transactions to it with `cast send`:

```sh
cast send <contract-address> "incrementCounter()" \
--private-key $PRIVATE_KEY
```

We can then perform read operations with `cast call`:

```sh
cast call <contract-address> "getCount()(int)"
```

### Deploying to Celestia Ethermint

Now that we've deployed and tested locally, we can deploy to Celestia Ethermint.

> Be sure to be using the private key for the account which holds the test CET tokens requested from the faucet.

To do so, run the following script:

```sh
forge script script/Contract.s.sol:ContractScript --rpc-url http://35.208.160.145:8545 \
 --private-key $PRIVATE_KEY --broadcast
```

Once the contract has been deployed to Celestia Ethermint, we can use `cast send` to test sending transactions to it:

```sh
cast send <contract-address> "incrementCounter()" --rpc-url http://35.208.160.145:8545 \
--private-key $PRIVATE_KEY 
```

We can then perform read operations with `cast call`:

```sh
cast call <contract-address> "getCount()(int)" --rpc-url http://35.208.160.145:8545
```
