---
description: A guide on how to install Arbitrum Nitro and deploy an instance on an Ubuntu AMD machine, including the installation of necessary dependencies, cloning the repository, installing Nitro from source, and deploying the rollup to Mocha testnet.
---

# Quickstart: Deploy an Orbit rollup

This guide covers deploying a rollup using the
[Celestia Orbit chain deployment portal](https://arbitrum-orbit-deployment-ui.vercel.app/).

After completing this tutorial, you'll have a local devnet
rollup that can host EVM-compatible smart contracts. Your chain will process
transactions locally while settling to the public Arbitrum Sepolia
testnet and posting data to Celestia's Mocha testnet.

If you're looking to learn more about the integration of Celestia and Orbit,
read the [Arbitrum Orbit integration overview](./arbitrum-integration.md). If you're
looking to learn more about Orbit, read
[A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction).

:::info Thank you, Offchain Labs!
This guide was made possible with the support and information provided by the
[Offchain Labs team](https://www.offchainlabs.com/), the creators of Arbitrum.
For more detailed information and support, visit
[Arbitrum documentation](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart)
and [the original deployment guide](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart).
:::

## Prerequisites

- Familiarity with Ethereum, Ethereum's testnets, Arbitrum, and Celestia
- [A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
- [Arbitrum Orbit integration overview](./arbitrum-integration.md)
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
  running on your machine
- [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- A fully synced and funded Mocha testnet [light node](../nodes/light-node.md)
on **v0.13.1**
  - [Mocha testnet faucet](../nodes/mocha-testnet.md#mocha-testnet-faucet)
- A browser-based Ethereum wallet (like [MetaMask](https://metamask.io))
- At least 1 Arbitrum Sepolia testnet ETH (for custom gas token chains,
0.6 ETH and 0.4 native tokens)

## Setup

This section was adapted from
[Arbitrum's Orbit quickstart](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart).

### Step 1: Acquire Arbitrum Sepolia ETH

You'll need at least 1 testnet ETH for a regular Orbit rollup
or 0.6 ETH plus 0.4 of your desired native token for Orbit rollups
with a custom gas token. The funds will cover the cost of deploying the
base contracts to the base chain, in this case, Arbitrum Sepolia.

The simplest way to do this is to:

1. Use an L1 testnet ETH faucet like [sepoliafaucet.com](https://sepoliafaucet.com/)
to acquire some testnet ETH on Ethereum Sepolia testnet.
2. Bridge your L1 testnet ETH to L2 Arbitrum Sepolia using the
[Arbitrum bridge](https://bridge.arbitrum.io/).

### Step 2: Pick your deployment type

Visit the
[Celestia Orbit chain deployment portal](https://arbitrum-orbit-deployment-ui.vercel.app/).
This portal offers the following options:

1. **Celestia Rollup: Transaction data is posted to Celestia**
2. Rollup: Transaction data is posted to Ethereum
3. AnyTrust: Transaction data is posted by a Data Availability Committee

Connect your wallet to the deployment portal. You may be prompted to
add the Arbitrum Sepolia network to your wallet and/or switch to your
wallet to this network; approve this.

In this guide, we will select **Celestia ✨** and deploy a rollup
which posts data to Celestia (1 above).

![Choose Celestia for DA](/public/arbitrum/choose_da.png)

Click **Next**. In the next step we will configure the deployment.

### Step 3: Configure your Orbit chain's deployment

The deployment portal will then display a form that looks like this:

![configuration](/public/arbitrum/configuration.png)

Parameter descriptions can be found in the table below (more in-depth
descriptions can be found in the deployment UI). We recommend sticking
to the defaults; to learn more about customizing your Orbit chain's
deployment configuration, visit [**TODO**: How (and when) to customize your Orbit chain's deployment config](/):

<!-- markdownlint-disable MD013 -->
| Parameter | Description |
|-|-|
| **Chain ID**           | This is a unique integer identifier for your chain's network, primarily used on chain indexes like [Chainlist.org](https://chainlist.org). It's not crucial for development networks, but in production, you'll need to choose a unique ID.|
| **Chain Name**         | The name you assign to your Orbit chain, which helps users and developers distinguish it from other chains. It should be memorable and recognizable.                                                            |
| **Challenge Period Blocks** | Determines the time frame within which validators can dispute the state of the chain posted to the base chain. It's measured in blocks on the underlying L1 chain. A longer period allows more time for disputes but also delays withdrawals.  |
| **Stake Token**        | Specifies the token that validators must stake to participate in the validation process, using the token's contract address on the base chain. This can be ETH or another token, defined by its address.         |
| **Base Stake**         | The minimum amount of stake token required for validators to post state assertions. A lower base stake lowers the barrier to entry but increases vulnerability to attacks, whereas a higher stake encourages honest participation but raises the entry barrier.|
| **Owner**              | The account address that has the authority to deploy, own, and update the base contracts of your Orbit chain on its base chain. In production, this is usually a high-stakes address controlled by a DAO or a multisig setup. For development chains, it's a lower-stakes administrative account.|
| **Gas Token**          | The token used for gas payments on the network, which must be natively deployed on the parent chain. There are specific requirements for custom gas tokens, such as having 18 decimals and not being a rebasing or fee-on-transfer token. This feature is primarily for Orbit AnyTrust chains.|
| **Validators**         | This is the number of validators for your chain, including their addresses. The first validator is auto-generated and immutable. Validators are crucial for maintaining the integrity of the chain and posting state assertions to the base chain.|
| **Batch Poster**       | Responsible for posting transaction batches from your Orbit chain to the base chain. An address for this role is automatically generated, with the private key stored in a configuration file.
<!-- markdownlint-enable MD013 -->

In the **Configure Validators** section, specify the number of validators
and their addresses for your chain. The initial validator's address is
pre-generated and immutable, with its key stored in a JSON file.
Validators ensure transaction integrity and state assertions on the base
chain. They're added to an allow-list for validation and staking.
**Base contracts** refer to your Orbit chain's L2 contracts, and **base chain**
to the L2 chain they're deployed on.

In the **Configure Batch Poster** section, a batch poster address is
auto-generated for posting transaction batches to the base contracts
on the base chain. The address and its private key are also stored in
a JSON configuration file. After configuring, proceed to review and
deploy your Orbit chain.

After configuring your batch poster, proceed to the next step.

### Step 3: Review & Deploy your Orbit chain

Now, deploy your chain's base contracts to Arbitrum Sepolia!

Click the **Deploy** button on the **Review & Deploy** page.
Your wallet should prompt you to submit a transaction to the
Arbitrum testnet. You'll have to pay a little gas; your wallet
may denominate this in ETH; as long as you see your chosen
Arbitrum testnet in the transaction details, this gas fee will
be paid in testnet ETH.

Before proceeding, let's briefly review what just happened:

1. You submitted a deployment transaction to an Orbit "factory"
smart contract on the Arbitrum testnet, the public L2 chain
that your local Orbit chain will settle transactions to.
2. This Orbit smart contract then initialized your Orbit
chain's base contracts with the values that you specified in
the previous step, and deployed these base contracts to the
Arbitrum testnet.

Your Orbit chain's base contracts are responsible for
facilitating the exchange of information between your chain's
node(s) and its base chain's nodes. This includes the batch
posting of transactions from your Orbit chain to its base
chain, the staking of tokens by your Orbit chain's validators
the challenge mechanism, bridging mechanisms, and more.

Once your transaction is complete, continue to Step 4 to
download your chain's configuration files and launch your chain.

### Step 4: Download your chain's configuration files and launch your chain

After configuring your chain, you will need to download the necessary configuration files to launch your chain. Click the **Download zip files** button to download both the Rollup Config and L3 Config in a single ZIP file.

- **Rollup Config**: This is the `nodeConfig.json` file, encapsulating your chain's node configuration. It is crucial as it contains the private keys for your validator and batch poster, essential for signing transactions for RBlocks and batch postings to your chain's base contracts on the L2 chain.

- **L3 Config**: This is the `orbitSetupScriptConfig.json` file, which holds your chain's configuration, including configurations needed for your Token Bridge contracts.

Ensure to securely store these downloaded files as they contain sensitive information crucial for your chain's operation.

![download config](/public/arbitrum/download-config.png)

### Step 5: Clone the setup script repository and add your configuration files

1. Clone the [orbit-setup-script](https://github.com/celestiaorg/orbit-setup-script/tree/main)
repository:

    ```bash
    git clone https://github.com/celestiaorg/orbit-setup-script.git
    ```

2. Move the `nodeConfig.json` and `orbitSetupScriptConfig.json`
files that you downloaded into the `config` directory in the
root of your cloned `orbit-setup-script` repository.

3. Install dependencies by running `yarn install` from the root of the `orbit-setup-script` repository.

### Step 6: Run your chain's node and block explorer

Start Docker, then run `docker-compose up -d` from the root of
the `orbit-setup-script` repository.

A Nitro node and BlockScout explorer instance will be started. Visit
http://localhost/ to access your BlockScout explorer instance -
this will allow you to view your chain's transactions and
blocks, which can be useful for debugging.

![blockscout](/public/arbitrum/blockscout.png)

### Step 7: Finalize deployment to Mocha testnet

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

:::warning
**This section is a WIP.**
:::

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

[See the compatibility matrix in the appendix to verify you're using the right versions.](#compatibility-matrix)

### Step 8: Finish setting up your chain

The Offchain Labs team has provided a Hardhat script that
handles the following tasks:

1. Fund the **batch-poster** and **validator** (staker) accounts on your underlying L2 chain.
2. Deposit ETH into your account on the chain using your chain's newly deployed bridge.
3. Deploy your Token Bridge contracts on both L2 and local Orbit chains.
4. Configure parameters on the chain.

To run this script, issue the following command from the root
of the `orbit-setup-script` repository, replacing
`YourPrivateKey` with the private key of the `Owner` account you
used to deploy your chain's contracts, and replacing `http://localhost:8449` with the RPC URL of your chain's node.

First, export your private key as a variable:

```bash
PRIVATE_KEY="YourPrivateKey" \
  L2_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc" \
  L3_RPC_URL="http://localhost:8449" yarn run setup
```

Successful logs will appear similar to:

<!-- markdownlint-disable MD013 -->
```log
Funding batch-poster accounts on parent chain with 0.3 ETH
Transaction hash on parent chain: 0x2049f87e8ef2ab098cdd70e6b132eacbbd3de40d4ac9baafbec6a22460bfbbc8
Transaction was mined in block 27032755 on parent chain
Funding staker accounts on parent chain with 0.3 ETH
Transaction hash on parent chain: 0xabcbcc1683cb73be35f58b4c3e15f2c7c66e80d270f672c408b2395bef706c84
Transaction was mined in block 27032778 on parent chain
Running Orbit Chain Native token deposit to Deposit ETH or native ERC20 token from parent chain to your account on Orbit chain ... 💰💰💰💰💰💰
```
<!-- markdownlint-enable MD013 -->

### Congratulations with Celestia underneath

Your local Orbit rollup is now running. You'll see an `outputInfo.json`
file in the
main directory of your script folder - this contains more information
about your chain,
including the addresses of your chain's base contracts.

## Appendix

TODO: Using Arbitrum Sepolia:
Extras:
- Logging: TODO: show how to view logs
- Depositing ETH/native token: TODO: Show how to deposit more ETH or native tokens to the Orbit chain account.
- TODO: Troubleshooting: `error getting latest batch count` safe to ignore.

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
