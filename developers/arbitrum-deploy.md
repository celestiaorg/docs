---
description: A guide on how to install Arbitrum Nitro and deploy an instance on an Ubuntu AMD machine, including the installation of necessary dependencies, cloning the repository, installing Nitro from source, and deploying the rollup to Mocha testnet.
---

# Deploy an Arbitrum local rollup devnet

We will go over installation of Arbitrum Nitro and deploying a rollup instance using the Celestia Orbit chain deployment portal. After completing this tutorial,
you'll have a local devnet chain that can host EVM-compatible smart contracts. Your
chain will process transactions locally while settling to the public Arbitrum Sepolia
testnet.

If you're looking to learn more about the integration of Celestia and Orbit,
read the [Arbitrum integration overview](./arbitrum-integration.md). If you're
looking to learn more about Orbit, read [A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction).

## Prerequisites

- Familiarity with Ethereum, Ethereum's testnets, Arbitrum, and Celestia
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
  running on your machine
- [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- [A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
- A fully synced and funded Mocha testnet [light node](../nodes/light-node.md) on **v0.13.1**
  - [Mocha testnet faucet](../nodes/mocha-testnet.md#mocha-testnet-faucet)
- **[TODO: check against Orbit docs](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart)**
- A browser-based Ethereum wallet (like [MetaMask](https://metamask.io))
- At least 1 Arbitrum Sepolia testnet ETH (for custom gas token chains, 0.6 ETH and 0.4 native tokens)

## Setup

This is a WIP, copied from [Arbitrum's Orbit quickstart](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart).

- Step 1: Acquire Arbitrum Testnet ETH (and the native token for Orbit chains with custom gas tokens)
  - tl;dr acquire testnet ETH
- Step 2: Choose your chain type: Rollup
- Step 3: Configure your Orbit chain's deployment
  - tl;dr use the Celestia Orbit chain deployment portal to deploy the chain. Add Arbitrum Sepolia to walle tif not already. TODO: add screenshot of the portal. TODO: add table of description of parameters.
- Step 4: Configure your chain's validator(s)
  - tl;dr TODO: add configure validator screenshot. TODO: describe fields in setup.
- Step 5: Configure your chain's batch poster
  - tl;dr TODO: screenshot of batch poster section. TODO: describe batch poster.
- Step 6: Review & Deploy your Orbit chain
  - tl;dr TODO: Click Deploy and explain what is happening.
- Step 7: Download your chain's configuration files and launch your chain
  - tl;dr TODO: Download the chain config files with Rollup Config and L3 Config. Download these from the UI. Explain what happens.
- Step 8: Clone the setup script repository and add your configuration files
  - tl;dr TODO: Clone the Orbit Celestia setup script repo and config steps.
- Step 9: Run your chain's node and block explorer
  - tl;dr TODO: Start Docker. Start node from orbit-setup-script repo. Visit block explorer.
- Step 10: Finish setting up your chain
  - tl;dr TODO: Fund batch-poster and validator on the L2 chain (Arbitrum Sepolia). Deposit ETH into the account using the newly deployed bridge. Deploy Token Bridge contracts on the L2 and local Orbit chains. Configure params. TODO: Run the script.

Extras:
- Logging: TODO: show how to view logs
- Depositing ETH/native token: TODO: Show how to deposit more ETH or native tokens to the Orbit chain account.
- Troubleshooting: `error getting latest batch count` safe to ignore.

## Clone the repository

<!-- TODO: change git checkout to celestia-development or release. It is locked
to this version so that the tutorial works for anyone using it ATM. -->

```bash
git clone https://github.com/celestiaorg/nitro.git && cd nitro/
git fetch --all
git checkout tags/v2.3.1
git submodule update --init
git submodule update --init --recursive
```

[See the compatibility matrix in the appendix to verify you're using the right version.](#compatibility-matrix)

## Deploy an Arbitrum rollup to Mocha testnet

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This section covers deploying an Arbitrum Nitro rollup to
[Mocha testnet](../nodes/mocha-testnet.md) using Celestia as DA.

### Configuration

Since the contracts deployed through the factories above are already configured to communicate with Blobstream, you now only have to configure your node accordingly,  so lets walk through [an example found in nitro-testnode](https://github.com/celestiaorg/nitro-testnode/blob/celestia-v2.3.1/scripts/config.ts#L223-L233).

First of all, you will need to enable Celestia DA in your Arbitrum chain params, which [you can see an example of](https://github.com/celestiaorg/nitro-testnode/blob/celestia-v2.3.1/scripts/config.ts#L358).

For the configuration, use the following:

:::warning
The Orbit contracts depend on [the existing Blobstream X deployments](#blobstream-x-contract-deployments). Before using these addresses, **please verify the contract addresses** on the official source below to avoid any issues due to incorrect addresses. This is crucial to protect against potential misuse by copy-paste errors.
:::

```ts
"celestia-cfg": {
  "enable": true,
    "rpc": "http://host.docker.internal:26658",
    "tendermint-rpc": "http://consensus-full-mocha-4.celestia-mocha.com:26657",
    "namespace-id": "000008e5f679bf7116cb",
    "auth-token": "",
    "is-poster": true,
    "gas-price": 0.3,
    "event-channel-size": 100,
    "blobstreamx-address": "0xa8973BDEf20fe4112C920582938EF2F022C911f5",
    }
```

- **`enable`:** self explanatory, set it to true if you are using Celestia DA 😁
- **`rpc`:** rpc endpoint for **celestia-node**
- **`tendermint-rpc`:** a celestia-core endpoint from a full node (**NOTE:** only needed for a batch poster node
- **`namespace-id`:** namespace being used to post data to Celestia
- **`auth-token`:** auth token for your Celestia Node
- **`is-poster`:** is the node with Celestia DA the batch poster, set to true if so.
- **`gas-price`:** how much to pay for gas (in uTIA)
- **`event-channel-size`:** size of the events channel used by the batch poster to wait for a range of headers that contains the header for the block in which it posted a blob, before posting the batch to the base layer for verification on Blobstream.
- **`blobstreamx-address`:** address of the BlobstreamX contract on the base chain.
    - Note that the `SequencerInbox` contract for each chain has a constant address for the `BlobstreamX` contract, thus make sure that the blobstream address in the `SequencerInbox` being used for the templates in `RollupCreator` matches the one in your config.

## Appendix

### Compatibility matrix

| Component | Version | Details |
|-----------|---------|---------|
| Nitro | [v2.3.1](https://github.com/celestiaorg/nitro/releases/tag/v2.3.1) | Includes the replay binary for the WASM root `0xa17295e3918d39e4026503302f1d627608101a52d4341647ebf7ad18edbe31a3`. [Read the overview for overall changes](../developers/arbitrum-integration.md). |
| Contracts | [v1.2.1-celestia](https://github.com/celestiaorg/nitro-contracts/releases/tag/v1.2.1-celestia) | Integrates Blobstream X functionality into nitro-contracts v1.2.1 |
| Orbit SDK | [v0.8.2 Orbit SDK for Celestia DA](https://github.com/celestiaorg/arbitrum-orbit-sdk/releases/tag/v0.8.2) | This is not compatible with Orbit SDK v0.8.2 or with the latest changes to nitro-contracts for the Atlas upgrade. The Orbit SDK itself is in Alpha. |
| celestia-node | [v0.13.1](https://github.com/celestiaorg/celestia-node/releases/tag/v0.13.1) | This integration has only been tested with celestia-node 0.13.1 and only works with said version, and with future versions after that. Under the hood, the Nitro node uses [this commit](https://github.com/celestiaorg/celestia-openrpc/commit/64f04840aa97d4deb821b654b1fb59167d242bd1) of celestia-openrpc. |

### Blobstream X contract deployments

The Orbit contracts depend on the following BlobstreamX deployments. The current deployments, which can be found at `0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2` in both chains, relays headers from the **Mocha-4** testnet to the chains below:
  - Arbitrum Sepolia
  - Base Sepolia

#### Arbitrum Sepolia

- RollupCreator: `0x79751B011BCc20F413a2c4E3AF019b6E2a9738B9`
- TokenBridgeCreator: `0xaAe3A04931345Df5AC6e784bB6bDeb29B1fF0286`
- TokenBridgeRetryableSender: `0x22a6580faECA49cF86Cbb2F18f2B7f98031FC6Ad`
- [Find additional Arbitrum Sepolia deployments below](#arbitrum-sepolia-additional-deployments)

#### Base Sepolia

- RollupCreator: `0x1Bb8ADd5e878b12Fa37756392642eB94C53A1Cf4`
- TokenBridgeCreator: `0xAa3b8B63cCCa3c98b948FD1d6eD875d378dE2C6c`
- TokenBridgeRetryableSender: `0x4270889AdcB82338C5FF5e64B45c0A3d31CFd08C`
- [Find additional Base Sepolia deployments below](#base-sepolia-additional-deployments)

### Arbitrum Sepolia additional deployments

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| Bridge                  | `0xBaabdD650B8cbb87B82Bc2E820B6Ca3e43eD1bDB` |
| SequencerInbox          | `0xA6F190545D71dC878C716302385a1E9C9548F211` |
| Inbox                   | `0x9aea22b874E88F1518c4cFB118c4bb5712E0B8C9` |
| RollupEventInbox        | `0xb7e1fCe320b550F031ddd61173A44447b812875B` |
| Outbox                  | `0x08122dF5dB980Aeb9fE0Bb7794C67cB887f8CB92` |
| ERC20Bridge             | `0xf4407e920973707a887BC80e08A36B059138Db35` |
| SequencerInbox          | `0x7Ef18e7fE88a838BDE0AFaFf883672fC976c5F8F` |
| ERC20Inbox              | `0x3D792da1EcA88D7f460eaDbAb95d50d2064b41eA` |
| ERC20RollupEventInbox   | `0x7709d8E56d5A9926386075C04Dac7063FEe032FB` |
| ERC20Outbox             | `0x9bC852F319afbCac2De7fe04C9E940e83304Df78` |
| BridgeCreator           | `0x3Bc040EAca40b91FA06cf55Ea91842FaC88b1AF4` |
| OneStepProver0          | `0x5810F0916BAE1067Ca1efcc00AaaF30301af001c` |
| OneStepProverMemory     | `0xaC3427E621C6F10dC2ABdAB00188D92690503914` |
| OneStepProverMath       | `0xFB612fb83959b8ACD3E49540B29C93c5A67e05f1` |
| OneStepProverHostIo     | `0x630093954CbF19Fe4532A2edD0bD3B10dEcA7A4D` |
| OneStepProofEntry       | `0x53DEA3A90Fd6C82840a1f7224F799D622f142Df4` |
| ChallengeManager        | `0x01B5905B154F21a393F5B5a0C6d15B53a493C05e` |
| RollupAdminLogic        | `0xe371AFcb8437bF61bd831EF57Be7A2496D88488B` |
| RollupUserLogic         | `0xE24a60b758b51b0a3dA5E8F4F6ddf1cd0aFF646C` |
| ValidatorUtils          | `0x7973D0b475E898082dF25c1617CBce1917cFED17` |
| ValidatorWalletCreator  | `0xe2662ff9b41f39e63A850E50E013Ea66e60A4F37` |
| RollupCreator           | `0x79751B011BCc20F413a2c4E3AF019b6E2a9738B9` |
| DeployHelper            | `0xd2D353916B34a877793628049c99858f04123eE1` |

### Base Sepolia additional deployments

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| Bridge                  | `0xF51A45Faac5838560cBa318E489947672B30992a` |
| SequencerInbox          | `0x692363a48fc3CCa86EFc70b12Bc2D4FA6a4e106B` |
| Inbox                   | `0xaDfdDb5FEED40C8507652479458b023B545c7C08` |
| RollupEventInbox        | `0x0A4E8d82662b1aAD01F136CACE479bDabf24C2C9` |
| Outbox                  | `0x1825F410562e8B67CD5a717a8E8E8E1Cb65d9A07` |
| ERC20Bridge             | `0x6e0F72d93ECEff59861DaA4980447A2B2E64D1e3` |
| SequencerInbox          | `0x1cFc40470AF5Aac39C8F8a63a2EEab8ce69D12f6` |
| ERC20Inbox              | `0x974440C340502FfF93793b25b95DB462240D8C8E` |
| ERC20RollupEventInbox   | `0x4435FC82d8ced74Bb752b63FFC8e03dfD67C571c` |
| ERC20Outbox             | `0xbe2876170971Ed84685d18BC910F891E2B9Adf02` |
| BridgeCreator           | `0xC7535F078CB3880a0FD5E54FA7A3B4EAf09b3924` |
| OneStepProver0          | `0xf889a3174Fddd9f78E6cd250Ebf4c16F1bDd1b6a` |
| OneStepProverMemory     | `0x61254e43e5c1e9E801F9C56B47a9ac3EADF6d1E9` |
| OneStepProverMath       | `0x55527d53fdA37Dbf1924482b40AcF8625E1cAA5B` |
| OneStepProverHostIo     | `0x03B43F7B61Fa100611191F481Ef48aa1fc98F434` |
| OneStepProofEntry       | `0x89b7c7970c13BB587893a70697AD6d2A335b6A15` |
| ChallengeManager        | `0x04CAe899Fc0B7Ef45c529f8Bf075D54F6fB70eD9` |
| RollupAdminLogic        | `0x99E9D2F04352B42C18F1DA5Dd93a970F82C08aFe` |
| RollupUserLogic         | `0x1ae3A8DC1e7eFD37F418B2987D3DF74c5a917a8B` |
| ValidatorUtils          | `0x1cc4551922C069A9aDE06756BF14bF0410eA44fF` |
| ValidatorWalletCreator  | `0x78f8B2941ddE5a8A312814Ebd29c2E2A36f25E91` |
| RollupCreator           | `0x1Bb8ADd5e878b12Fa37756392642eB94C53A1Cf4` |
| DeployHelper            | `0x20d8153AaCC4E6D29558fa3916BfF422BEDE9B5E` |
