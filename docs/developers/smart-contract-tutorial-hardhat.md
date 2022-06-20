# Deploying a Smart Contract to Celestia Ethermint with Hardhat
<!-- markdownlint-disable MD013 -->

In this guide you'll learn how to deploy a Solidity smart contract to Celestia Ethermint with [Hardhat](https://hardhat.org/).

## About Hardhat

Hardhat is a Solidity development environment built with Node.js that allows you to write tests and scripts using JavaScript.

Hardhat gives you the tools necessary to deploy smart contracts, debug Solidity code, and run tests using a local test EVM network instead of having to deal with a live network.

We'll use all Hardhat to create, test, and deploy our Solidity project.

## Getting started

To deploy to Celestia Ethermint you will need to request tokens from the test faucet.

### Celestia Ethermint Faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF CELESTIA OR CELESTIA ETHERMINT TOKENS. MAINNET CELESTIA AND CELESTIA ETHERMINT TOKENS DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC DISTRIBUTIONS OF ANY MAINNET CELESTIA OR CELESTIA ETHERMINT TOKENS.

You can request from Celestia Ethermint Faucet on the `#celestia-ethermint-faucet` channel on Celestia's Discord server with the following command:

```text
$request <EVM-WALLET-ADDRESS> 
```

### Initialize development environment

First, create a new project in an empty directory :

```sh
npx hardhat init

✔ What do you want to do? · Create a basic sample project
✔ Hardhat project root: · <your-project-root>
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers)? (Y/n) · y
```

Hardhat has created an example smart contract located at `contracts/Greeter.sol`.

Next, update the configuration at `hardhat.config.js` to include the Celestia Ethermint network:

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.13",
  networks: {
    hardhat: {},
    celestiaEthermint: {
      url: "http://35.208.160.145:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 69420
    }
  }
};
```

### Updating the contracts and tests

Let's update the contracts to include a basic counter example. Create a new file in the `src` directory named `Counter.sol` and add the following code:

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

Open `test/sample-test.js` and update the code with the following:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Should increment the counter", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(10);
    await counter.deployed();

    expect(await counter.getCount()).to.equal(10);

    await counter.incrementCounter();

    expect(await counter.getCount()).to.equal(11);

    await counter.decrementCounter();
    await counter.decrementCounter();

    expect(await counter.getCount()).to.equal(9);
  });
});
```

Next, we can test the contract with the following command:

```sh
npx hardhat test
```

### Updating the deployment script

Now that we've tested the contract, let's try deploying it locally.

To do so, update the deloyment script at `scripts/sample-script.js` with the following code:

```javascript
const hre = require("hardhat");

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy(10);

  await counter.deployed();
  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

### Deploying locally

Next start the local testnet:

```sh
npx hardhat node
```

Once started, Hardhat will give you a local RPC endpoint as well as a handful of Private Keys and Accounts that you can use.

We can now deploy locally. In a separate terminal window, run the following command:

```sh
npx hardhat run scripts/sample-script.js --network localhost
```

You can now interact with the network from your application via the JSON-RPC server at `http://127.0.0.1:8545/`.

### Deploying to Celestia Ethermint

Now that we've deployed and tested the contract, we can deploy to Celestia Ethermint.

To do so, run the following script:

```sh
npx hardhat run scripts/sample-script.js --network celestiaEthermint
```

Once the contract has been deployed to Celestia Ethermint, you can interact with the network from your application via the JSON-RPC endpoint at `http://35.208.160.145:8545`.
