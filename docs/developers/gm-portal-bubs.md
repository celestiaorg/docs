---
sidebar_label: Deploy a GM Portal dapp on Bubs testnet
description: Make your own GM Portal dapp on the OP Stack.
---

# Deploying a dapp on Bubs testnet

First, review the [Bubs testnet page](../bubs-testnet) and the
[Deploy a smart contract to Bubs testnet](../deploy-on-bubs) tutorial.

**You will need a funded account to deploy your smart contract.**

Next, clone the `gm-portal` from Github and start the frontend:

```bash
cd $HOME
git clone https://github.com/jcstein/gm-portal.git
cd gm-portal/frontend
yarn && yarn dev
```

In a new terminal instance, set your private key for the
faucet as a variable and the RPC URL you're using:

```bash
export PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export BUBS_RPC_URL=https://bubs.calderachain.xyz/http
```

Now, change into the `gm-portal/contracts` directory in the same terminal and deploy
the contract using Foundry:

<!-- markdownlint-disable MD013 -->

```bash
cd $HOME/gm-portal/contracts
forge script script/GmPortal.s.sol:GmPortalScript --rpc-url $BUBS_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

<!-- markdownlint-enable MD013 -->

![gm-contract](../img/gm/gm_contract.png)

In the output of the deployment, find the contract address and set it as a variable:

```bash
export CONTRACT_ADDRESS=<your contract address from the output above>
```

Next, you're ready to interact with the contract from your terminal!

First, send a "gm" to the contract:

```bash
cast send $CONTRACT_ADDRESS \
"gm(string)" "gm" \
--private-key $PRIVATE_KEY \
--rpc-url $BUBS_RPC_URL
```

Now that you've posted to the contract, you can read all "gms" (GMs) from the
contract with
this command:

```bash
cast call $CONTRACT_ADDRESS "getAllGms()" --rpc-url $BUBS_RPC_URL
```

Next, query the total number of gms, which will be returned as a hex value:

```bash
cast call $CONTRACT_ADDRESS "getTotalGms()" --rpc-url $BUBS_RPC_URL
```

In order to interact with the contract on the frontend, you'll need to fund an
account that you have in your Ethereum wallet. Transfer to an external account
with this command:

```bash
export RECEIVER=<receiver ETH address>
cast send --private-key $PRIVATE_KEY $RECEIVER --value 1ether --rpc-url $BUBS_RPC_URL
```

If you are in a different terminal than the one you set the private key in, you
may need to set it again.

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

![gm-bubs](../img/gm/gm_bubs.png)

## Next steps

There are many possibilities of what could be built with this stack.
These projects would be good to build on this stack:

- on-chain gaming
- decentralized social media
- an NFT ticketing rollup
- Optimism on CelOPstia
- OP Craft on Celestia
