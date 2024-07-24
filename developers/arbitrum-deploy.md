---
description: A guide on how to deploy an Arbitrum Orbit rollup using the Arbitrum Orbit deployment UI and deploying the rollup to Mocha testnet.
---

# Quickstart: Deploy an Arbitrum Orbit rollup

This guide covers deploying a rollup using the
[Celestia Orbit chain deployment portal](https://orbit.celestia.org).

After completing this tutorial, you will have a local development network rollup
capable of hosting EVM-compatible smart contracts. This rollup will process
transactions locally, settle on the public Arbitrum Sepolia testnet, and post data to
Celestia's Mocha testnet.

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
on **v0.13.7**
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
[Celestia Orbit chain deployment portal](https://orbit.celestia.org).
This portal offers the following options:

1. **Celestia Rollup: Transaction data is posted to Celestia**
2. Rollup: Transaction data is posted to Ethereum
3. AnyTrust: Transaction data is posted by a Data Availability Committee

Connect your wallet to the deployment portal. You may be prompted to
add the Arbitrum Sepolia network to your wallet and/or switch your
wallet to this network; approve this.

In this guide, we will select **Celestia ✨** and deploy a rollup
which posts data to Celestia (1 above).

![Choose Celestia for DA](/arbitrum/choose_da.png)

Click **Next**. In the next step, we will configure the deployment.

### Step 3: Configure your Orbit chain's deployment

The deployment portal will then display a form that looks like this:

![configuration](/arbitrum/configuration.png)

Parameter descriptions can be found in the table below (more in-depth
descriptions can be found in the deployment UI). We recommend sticking
to the defaults; to learn more about customizing your Orbit chain's
deployment configuration, visit
[How to customize your Orbit chain's deployment configuration](https://docs.arbitrum.io/launch-orbit-chain/how-tos/customize-deployment-configuration):

<!-- markdownlint-disable MD013 -->
| Parameter | Description |
|-|-|
| **Chain ID** | This is a unique integer identifier for your chain's network, primarily used on chain indexes like [Chainlist.org](https://chainlist.org). It's not crucial for development networks, but in production, you'll need to choose a unique ID.|
| **Chain Name** | The name you assign to your Orbit chain, which helps users and developers distinguish it from other chains. It should be memorable and recognizable.                                                            |
| **Challenge Period Blocks** | Determines the time frame within which validators can dispute the state of the chain posted to the base chain. It's measured in blocks on the underlying L1 chain. A longer period allows more time for disputes but also delays withdrawals.  |
| **Stake Token** | Specifies the token that validators must stake to participate in the validation process, using the token's contract address on the base chain. This can be ETH or another token, defined by its address.         |
| **Base Stake** | The minimum amount of stake token required for validators to post state assertions. A lower base stake lowers the barrier to entry but increases vulnerability to attacks, whereas a higher stake encourages honest participation but raises the entry barrier.|
| **Owner** | The account address that has the authority to deploy, own, and update the base contracts of your Orbit chain on its base chain. In production, this is usually a high-stakes address controlled by a DAO or a multisig setup. For development chains, it's a lower-stakes administrative account.|
| **Gas Token** | The token used for gas payments on the network, which must be natively deployed on the parent chain. There are specific requirements for custom gas tokens, such as having 18 decimals and not being a rebasing or fee-on-transfer token. This feature is primarily for Orbit AnyTrust chains.|
| **Validators** | This is the number of validators for your chain, including their addresses. The first validator is auto-generated and immutable. Validators are crucial for maintaining the integrity of the chain and posting state assertions to the base chain.|
| **Batch Poster** | Responsible for posting transaction batches from your Orbit chain to the base chain. An address for this role is automatically generated, with the private key stored in a configuration file.
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

![download config](/arbitrum/download-config.png)

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

### Step 6: Run your light node for Mocha testnet

First, be sure that your light node is running, using a command similar to:

:::tip
If you are on Linux (or are not using Docker desktop), you may need to add the extra flags:
`--rpc.addr 0.0.0.0` and `--rpc.port 26658` to your start command
for your light node.

Additionally, you will need to add `host.docker.internal` as
a host in your `docker-compose.yml`:

```yaml
extra_hosts:
      - "host.docker.internal:host-gateway"
```

:::

```bash
celestia light start --p2p.network mocha --core.ip <RPC_URL>
```

To set your light node's auth token, you will use the auth
token that returns when you run:

```bash
celestia light auth admin --p2p.network mocha
```

<!-- markdownlint-disable MD033 -->

Since the contracts deployed through the factories above are already configured
to communicate with Blobstream, you now only have to configure your node
accordingly. First understand the different variables that will be set in the config:

- **`enable`:** set it to true if you are using Celestia DA 😁
- **`gas-price`:** how much to pay for gas (in uTIA)
- **`gas-multiplier`:** will increase the gas price linearly based on the number
you provide. 1.01 increases the gas by 1%.
- **`rpc`:** RPC endpoint for **celestia-node**
- **`namespace-id`:** namespace being used to post data to Celestia
- **`auth-token`:** auth token for your Celestia Node
- **`noop-writer`:** setting this to true allows you to force fallbacks by
disabling storing posting data to Celestia
- **`validator-config` (optional):** optional validator configuration as
described on [Running a full node and/or validator](./arbitrum-full-node.md)

Now enable Celestia DA in your Arbitrum chain params in
`config/nodeConfig.json`. If you'd like to use your own namespace,
use a custom 10 byte value or random value using
`openssl rand -hex 10` for `namespace-id`:

:::warning
The Orbit contracts depend on
[the existing Blobstream X deployments](#blobstream-x-contract-deployments).
Before using these addresses, **please verify the contract addresses** on
[the official source below](#blobstream-x-contract-deployments)
to avoid any issues due to incorrect addresses.
This is crucial to protect against potential misuse by copy-paste errors.
:::

```ts
"celestia-cfg": {
  "enable": true,
  "gas-price": 0.01,
  "gas-multiplier", 1.01,
  "rpc": "http://host.docker.internal:26658",
  "namespace-id": "<YOUR_10_BYTE_NAMESPACE>",
  "auth-token": "<YOUR_AUTH_TOKEN>",
  "noop-writer": false,
}
```

[See the compatibility matrix in the appendix to verify you're using the right versions.](#compatibility-matrix)

### Step 7: Run your chain's node and block explorer

Start Docker, then run `docker-compose up -d` from the root of
the `orbit-setup-script` repository.

A Nitro node and BlockScout explorer instance will be started. Visit
http://localhost/ to access your BlockScout explorer instance -
this will allow you to view your chain's transactions and
blocks, which can be useful for debugging.

![blockscout](/arbitrum/blockscout.png)

After you have some activity on your rollup, it will look more like this:

![explorer-view](/arbitrum/explorer-view.png)

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
```bash
Funding batch-poster accounts on parent chain with 0.3 ETH
Transaction hash on parent chain: 0x6c7360a96165c570dcb7ce609d748d612c5fa5b76e229cd81ba5f5c93c00f805
Transaction was mined in block 28217647 on parent chain
Funding staker accounts on parent chain with 0.3 ETH
Transaction hash on parent chain: 0x59d2db6c5095b9e329c80211b7a761d20064379e3382d156b69e5cf3b5fe2fc7
Transaction was mined in block 28217653 on parent chain
Running Orbit Chain Native token deposit to Deposit ETH or native ERC20 token from parent chain to your account on Orbit chain ... 💰💰💰💰💰💰
Transaction hash on parent chain:  0x8dee6e88d3b62b258c1574cbb7005e1c3cf193b60a99b5c2fcfae00819b7ed82
0.4 ETHs are deposited to your account
Balance not changed yet. Waiting for another 30 seconds ⏰⏰⏰⏰⏰⏰
Balance of your account on Orbit chain increased by the native token you have just sent.
Running tokenBridgeDeployment or erc20TokenBridge script to deploy token bridge contracts on parent chain and your Orbit chain 🌉🌉🌉🌉🌉
Creating token bridge for rollup 0x7fbEB5BC73a11b438891022786feb2C624f275F0
Token bridge deployed in transaction 0x4888fdf44251d456bbfca92bfc6e180cfe0b096ffbea2f6da2a203a16902214f
Waiting for retryables...
Retryable #1: 0xc61382d5609ab0ece36b2776349c8bdceeafdd13dde9624cdf3d746fb4cf7d79
Retryable #2: 0xf31fd34f8a9d9057198d8b13e755e583766bd528459733d948d9ffbc980c9506
Done!
Weth gateway set in tx 0xf2ddc2dad90e7e2b20a772bf89f989224165659d50824b98d7340e12265abf01
Waiting for retryables...
Retryable #1: 0xf47dc66514fd78e4666e35abd12df7d1ae2c79f69f7dfedb8d98e4106142ab7c
Done!
network.json updated
Done!
Running l3Configuration script to configure your Orbit chain 📝📝📝📝📝
Setting the Minimum Base Fee for the Orbit chain
Minimum Base Fee is set on the block number 13 on the Orbit chain
Setting the  network fee receiver for the Orbit chain
network fee receiver is set on the block number 14 on the Orbit chain
Setting the infrastructure fee collector address for the Orbit chain
infrastructure fee collector address is set on the block number 15 on the Orbit chain
Getting L1 base fee estimate
L1 Base Fee estimate on L2 is 4989526079
Setting L1 base fee estimate on L3 to 5158076079
L1 base fee estimate is set on the block number 16 on the Orbit chain
All things done! Enjoy your Orbit chain. LFG 🚀🚀🚀🚀
Transferring ownership on L3, from rollup owner to upgrade executor 🔃🔃🔃
Adding Upgrade Executor contract to the chain owners
Executor has been added to chain owners on TX: 0x97b50f60b60d0e658fdbf185969db0a0327bd0ae9e57cd65af2a7f9be0eeb5b0
Executing removeChainOwner through the UpgradeExecutor contract
Transaction complete, rollup owner removed from chain owners on TX: 0x019850732270d8c436585c7921219252422228b5d0f559da0da219f0fa2b7216
✨  Done in 58.49s.
```
<!-- markdownlint-enable MD013 -->

Find your PFB on Celenium by looking at the namespace or account you posted from.

See an [example blob that was posted while making this guide](https://mocha.celenium.io/tx/63e902dd25e7919d4f32f6ae193acc8437dad754b549a15af7ae68e6969c1d0f).

### Congratulations with Celestia underneath

Your local Orbit rollup is now running. You'll see an `outputInfo.json`
file in the
main directory of your script folder - this contains more information
about your chain,
including the addresses of your chain's base contracts.

In the next guides, learn how to
[run a full and validating full node](./arbitrum-full-node.md)
or [bridge in and out of your rollup](./arbitrum-bridge.md).

## Appendix

Extra resources in Arbitrum documentation:

- [Logging](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart#appendix-a-logging)
- [Depositing ETH/native token](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart#appendix-b-depositing-ethnative-token)
- [Troubleshooting: `error getting latest batch count`](https://docs.arbitrum.io/launch-orbit-chain/orbit-quickstart#appendix-c-troubleshooting)

### Compatibility matrix
<!-- markdownlint-disable MD013 -->
| Component | Version | Details |
|-----------|---------|---------|
| Nitro | [v2.3.3](https://github.com/celestiaorg/nitro/releases/tag/v2.3.3) | Includes the replay binary for the WASM root `0x9286b47ebb3f668fbba011c0e541655a7ecc833032154bba0d8d5ce4f2411f2a`. [Read the overview for overall changes](../developers/arbitrum-integration.md). |
| Contracts | [v1.2.1-celestia](https://github.com/celestiaorg/nitro-contracts/releases/tag/v1.2.1-celestia) | Integrates Blobstream X functionality into nitro-contracts v1.2.1 |
| Orbit SDK | [v0.8.2 Orbit SDK for Celestia DA](https://github.com/celestiaorg/arbitrum-orbit-sdk/releases/tag/v0.8.2) | This is not compatible with Orbit SDK v0.8.2 or with the latest changes to nitro-contracts for the Atlas upgrade. The Orbit SDK itself is in Alpha. |
| celestia-node | [v0.13.7](https://github.com/celestiaorg/celestia-node/releases/tag/v0.13.7) | This integration has only been tested with celestia-node 0.13.7 and only works with said version, and with future versions after that. Under the hood, the Nitro node uses [this commit](https://github.com/celestiaorg/celestia-openrpc/commit/64f04840aa97d4deb821b654b1fb59167d242bd1) of celestia-openrpc. |
<!-- markdownlint-enable MD013 -->

### Blobstream X contract deployments

The Orbit contracts depend on the following Blobstream X deployments.
The current deployments, which can be
[found on the Blobstream page](../developers/blobstream#deployed-contracts), relays
headers from the **Mocha-4** testnet to the chains below:

- Ethereum Sepolia
- Arbitrum Sepolia
- Base Sepolia

#### Ethereum Sepolia

- RollupCreator: `0xcE2F52d9439e5bea4b15B5E44E963a9597049358`
- [Find additional Ethereum Sepolia deployments below](#ethereum-sepolia-additional-deployments)

#### Arbitrum Sepolia

- RollupCreator: `0x37C8904a69FEdCDA11aa4aE803fC30aDB3391c4E`
- [Find additional Arbitrum Sepolia deployments below](#arbitrum-sepolia-additional-deployments)

#### Base Sepolia

- RollupCreator: `0x55de945C429857f6A6B919e1CEc98272751Bf5C2`
- [Find additional Base Sepolia deployments below](#base-sepolia-additional-deployments)

### Ethereum Sepolia additional deployments

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| Bridge                  | `0x19cFAaDAD418CcDb65e08d47c14Ab022beDa7Edd` |
| SequencerInbox          | `0xe34175f465fB01C6939c3D7512B67672AA6C4F52` |
| Inbox                   | `0x037b75442a06cfb9c5b3a516BF1cC2073ABa8256` |
| RollupEventInbox        | `0xE1Dc6f0A70Ba97CAb913E651eEBD3702e2D236aB` |
| Outbox                  | `0xF74E9F7CDb5949E8B6f029a95DAF00f853D8e895` |
| ERC20Bridge             | `0xc3Fef4dDd01667CcA276f1fEFF23d7d91650c88d` |
| SequencerInbox          | `0xE1581f6d80a52994F8b2dbfc344285Fb01B00e31` |
| ERC20Inbox              | `0x8E48bb3439D2c7C47c722E1126AD755654dBbD26` |
| ERC20RollupEventInbox   | `0x0BBC1b9c8a5d840b433AF0759a9cd6a78d4CddA5` |
| ERC20Outbox             | `0x17a072942e841F4fF4ee04FE65c63295D84d8c69` |
| BridgeCreator           | `0x8B5484c5FEdFfEb51d5Dad355eb073b6cB2c3374` |
| OneStepProver0          | `0x0C444a48B4DE38B8CAC62204D7F341D7954fC1cD` |
| OneStepProverMemory     | `0xE0d12F3aD9A1FD70B2607C242e11F9714b388873` |
| OneStepProverMath       | `0x35e1050DC615638F8f3dd83d773f5671D0B30841` |
| OneStepProverHostIo     | `0x47DF395ae223dA4aa6d2E87cC71876c445FC3129` |
| OneStepProofEntry       | `0x469970f779e2e356e48eDf9c94378eAfcb13Fc5D` |
| ChallengeManager        | `0xf16754a2D015b27A44E42ac70043AfC29000C0C9` |
| RollupAdminLogic        | `0x93b980A95AAdb4fd5f3259E79c0b8760C426573D` |
| RollupUserLogic         | `0x2778Ef247800f1dbCA9917b2412CDEc85A5F723a` |
| ValidatorUtils          | `0x8A5cAA7719b021F7cf2fE315bCf3e17F876a6AE4` |
| ValidatorWalletCreator  | `0xfBD3Fac05f89ad8fdD75C6a7701953E895c669d4` |
| RollupCreator           | `0xcE2F52d9439e5bea4b15B5E44E963a9597049358` |
| DeployHelper            | `0x387c3F8699D661D6AA722d59ee894EC753094e68` |

### Arbitrum Sepolia additional deployments

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| Bridge                  | `0x88D5e7B38f4eeb98BC5067723B8acF60247dE1Ad` |
| SequencerInbox          | `0x42a3D30F996811316fDaC96d0E8531Bb805A0608` |
| Inbox                   | `0x1B65BA336CE6484f63b7f7D3F080f793a2E7aA76` |
| RollupEventInbox        | `0x34ABbc93e5521C9089d4e4Ae46Ed7501759bBbA5` |
| Outbox                  | `0x86e0A15aF8df110CF1C8b34491c0aa07794685b1` |
| ERC20Bridge             | `0xC0864848a6c73374652EEa92fc19cFF7D9DD52e4` |
| SequencerInbox          | `0xB49156413cCdc31bbdC7f68b95C50b1B4bDc240F` |
| ERC20Inbox              | `0xCAa6919eC04964E9bC700A3EdF6215DC9bF5c632` |
| ERC20RollupEventInbox   | `0x4180D0a68e5201FF033ED476C6F2A6B8879BE62d` |
| ERC20Outbox             | `0x31081a17a3FD0AFEc0F33609b697Ea4e91d8cDed` |
| BridgeCreator           | `0x25651083abd09c56d34Ffe1c83eD421DDac176B1` |
| OneStepProver0          | `0x8964C627f5D6da05f3f95747D3ACd82a80e9c1aD` |
| OneStepProverMemory     | `0x16512eE886b5f818D1BC5EC6E3700D0Bf2c18E5D` |
| OneStepProverMath       | `0xaddc57a97CB62b986603bA68531eFefEf3d5ceF1` |
| OneStepProverHostIo     | `0x9dCA3D96a0e38E07D411C7E7cAC15163B748E87B` |
| OneStepProofEntry       | `0x5E5e332f76bc9a24A80EfAB94D04196A3dcD6C27` |
| ChallengeManager        | `0x1AE8AF97c665864880A6EEE28337da7e0b60c476` |
| RollupAdminLogic        | `0xBE24ff3d857e70FC081A1A58CaC6805c2644DEa4` |
| RollupUserLogic         | `0x76924eb22cd3B3Fd8037654EBD6aD664B726fb23` |
| ValidatorUtils          | `0x2E0848589d85Bb55a3F3e0f5cE5bFAcd24f3E197` |
| ValidatorWalletCreator  | `0x03568A3aAAC150D0D22230729126B92Ee7988D44` |
| RollupCreator           | `0x37C8904a69FEdCDA11aa4aE803fC30aDB3391c4E` |
| DeployHelper            | `0x0f626da2FAa65eF03fE6e93338315393E76cD1DB` |

### Base Sepolia additional deployments

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| Bridge                  | `0x780c064b1a94B4a7d78c39717383F3d9CC9c2eDD` |
| SequencerInbox          | `0x5D523203002f32d95f3647bAB766805160a414Ba` |
| Inbox                   | `0x0D9759cDAfBAc4bE7a8d6a577A11AD0184a3e8cD` |
| RollupEventInbox        | `0x1de5Af878007BEf2B1185719CbBf81256d625Cde` |
| Outbox                  | `0x8D6DbB897F12c0aAF1C9Dc2671ED4ae1baB46Dd0` |
| ERC20Bridge             | `0x004A652B34B3d87FA40894D319CCA760cA7F0F56` |
| SequencerInbox          | `0xE618FC0C9357e172F9cF939730356Dc75E78A5c2` |
| ERC20Inbox              | `0xd27fFe4c99b652E66f3e872E3030704341b77adc` |
| ERC20RollupEventInbox   | `0x8D9a646A251B91494e7b1668c0675A43DCCA5356` |
| ERC20Outbox             | `0xA85AEaBC72c5359E9A0b02C7850F8a8A2274ccE4` |
| BridgeCreator           | `0x1C4fF8E18a07851f274c74A24f3d97c9b10d3823` |
| OneStepProver0          | `0x3118377300Cc90167b9e0b287f385d1c016D5576` |
| OneStepProverMemory     | `0x95Fd0bA3c36195cb27Ed6743Cb838DF2cb9a74e2` |
| OneStepProverMath       | `0xD1bbf860EE98530F3F294402eA8012DFE522303A` |
| OneStepProverHostIo     | `0x5dcF9F45C0015B0aad10B90A0f5F346a1fF0F326` |
| OneStepProofEntry       | `0x8a2Dee18a58a3D2fBdc39e92c5633797077F7B55` |
| ChallengeManager        | `0x376687d089370E1d50d8d6a8Ab215Ac2d7b5f93E` |
| RollupAdminLogic        | `0x022adaEdd9374cFB0d8302ea0B8a8280f2d24e44` |
| RollupUserLogic         | `0x26f2Ce42cB44F573118a0631f6723f909FA58F14` |
| ValidatorUtils          | `0xACD2811D5AfA03B984A29803a01Fd45C0c6468e5` |
| ValidatorWalletCreator  | `0x102d6A9814b0216A802a47Edc32C9a4f541748bd` |
| RollupCreator           | `0x55de945C429857f6A6B919e1CEc98272751Bf5C2` |
| DeployHelper            | `0x1c17b66d3707537B1073fbac319AD9b090414e3C` |
