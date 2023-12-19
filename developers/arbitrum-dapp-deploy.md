---
description: Make your own GM Portal dapp on your Arbitrum rollup.
---

# Deploy a dapp on your Arbitrum rollup devnet

First, review the [Arbitrum integration](./arbitrum-integration.md),
[Deploy an Arbitrum rollup devnet](./arbitrum-deploy.md), and
[Deploy a smart contract to your Arbitrum rollup](./arbitrum-smart-contract.md)
pages.

## Dependencies

- a funded account to deploy your smart contract
- an [Arbitrum rollup devnet](./arbitrum-deploy.md) running

## Setup and contract deployment

1. Clone the `gm-portal` from Github and start the frontend:

    ```bash
    cd $HOME
    git clone https://github.com/jcstein/gm-portal.git
    cd gm-portal && git checkout arbitrum
    cd frontend && yarn && yarn dev
    ```

2. In a new terminal instance, set your private key for the
    faucet as a variable and the RPC URL you're using:

    ```bash
    export PRIVATE_KEY=0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659
    export ARB_RPC_URL=http://localhost:8547
    ```

3. Change into the `gm-portal/contracts` directory in the same terminal and deploy
    the contract using Foundry:

    <!-- markdownlint-disable MD013 -->
    ```bash
    cd $HOME/gm-portal/contracts
    forge script script/GmPortal.s.sol:GmPortalScript --rpc-url $ARB_RPC_URL --private-key $PRIVATE_KEY --broadcast
    ```
    <!-- markdownlint-enable MD013 -->

4. In the output of the deployment, find the contract address and set it as a variable:

    ```bash
    export CONTRACT_ADDRESS=<your-contract-address-from-the-output-above>
    ```

### Interact with the contract

Next, you're ready to interact with the contract from your terminal!

1. Send a "gm" to the contract:

    ```bash
    cast send $CONTRACT_ADDRESS \
    "gm(string)" "gm" \
    --private-key $PRIVATE_KEY \
    --rpc-url $ARB_RPC_URL
    ```

2. Now that you've posted to the contract, you can read all "gms" (GMs) from the
    contract with
    this command:

    ```bash
    cast call $CONTRACT_ADDRESS "getAllGms()" --rpc-url $ARB_RPC_URL
    ```

3. Next, query the total number of gms, which will be returned as a hex value:

    ```bash
    cast call $CONTRACT_ADDRESS "getTotalGms()" --rpc-url $ARB_RPC_URL
    ```

4. (Optional) In order to interact with the contract on the frontend, you'll
    need to fund an account that you have in your Ethereum wallet. Transfer to an
    external account with this command:

    ```bash
    export RECEIVER=<receiver ETH address>
    cast send --private-key $PRIVATE_KEY $RECEIVER --value 1ether --rpc-url $ARB_RPC_URL
    ```

    :::tip
    If you are in a different terminal than the one you set the
    private key in, you may need to set it again.
    :::

## Update the frontend

Next, you will need to update a few things before you can interact with the
contract on the frontend:

1. Change the contract address on `gm-portal/frontend/src/App.tsx` to your
   contract address
2. Match the chain info on `gm-portal/frontend/src/main.tsx` with the chain
   config of your L2
3. If you changed the contract, update the ABI in
   `gm-portal/frontend/GmPortal.json` from
   `gm-portal/contracts/out/GmPortal.sol/GmPortal.json`. This can be done with:

```bash
cd $HOME
cp dev/gm-portal/contracts/out/GmPortal.sol/GmPortal.json dev/gm-portal/frontend
```

## Interact with the frontend

Now, login with your wallet that you funded, and post a GM on your GM portal!

![gm-arb](/img/gm-arb.png)
