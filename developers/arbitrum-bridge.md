---
description: A guide on how to bridge in and out of your Arbitrum Orbit rollup.
---

# Bridging in and out of your Orbit rollup

This guide covers how to [bridge in (deposit)](#bridge-in-deposit-to-your-rollup)
and bridge out (withdrawal)
from your Arbitrum Orbit L3 rollup.

This guide will cover bridging in and out of your Orbit rollup.

Below are two example transactions, one to deposit and one to withdrawal:

![bridge-overview-deposit-and-withdrawal-l3](/arbitrum/bridge-overview-deposit-and-withdrawal-l3.png)

## Bridge in (deposit) to your rollup

###  Step 1: Add your custom chain config

**(1a)** In the [Arbitrum Bridge UI](https://bridge.arbitrum.io/),
click the menu dropdown in the top right.
Select **Settings**.

![bridge-settings](/arbitrum/bridge-settings.png)

**(1b)** Under **Developer Mode**, select **Turn on testnet mode**.
Add your custom chain config from `outputInfo.json` in the root of your
`orbit-setup-script` directory.

![add-testnet-orbit-chain](/arbitrum/add-custom-chain-to-bridge.png)

**(1c)** You'll then see the chain under **Live Orbit Chains**:

![live-orbit-chains](/arbitrum/live-orbit-chains.png)

### Step 2: Deposit to your Orbit rollup

**(2a)** Choose an amount of Arbitrum Sepolia ETH to bridge into
your rollup. Click **Move funds to <YOUR_ROLLUP_NAME>**,
in this case **Move funds to Arbitrum L3 Rollup**.
Approve the transaction in your wallet. 

![bridge-in-start](/arbitrum/bridge-in-start.png)

**(2b)** You'll then see it load in the **Pending transactions** tab:

![bridge-in-pending](/arbitrum/bridge-in-pending-txs.png)

**(2c)** Shortly after, in the **Settled transactions** tab you can see the transaction status. Click **Success**.

![bridge-in-settled-txs](/arbitrum/bridge-in-settled-txs.png)

**(2d)** View the transaction on your local instance of Blockscout
for your rollup:

![bridge-in-explorer-rollup-tx](/arbitrum/bridge-in-explorer-rollup-tx.png)

**(2e)** Optionally, click **See Details** for an overview of your deposit:

![bridge-in-success](/arbitrum/bridge-in-success.png)

**(2f)** From the details page, you can also
[see the transaction for your deposit on Arbitrum Sepolia](https://sepolia.arbiscan.io/tx/0xf700e6dde8b7891e27a806a78a0ab4efb7bb40fbea19ca966a2c8922c61c9c50):

![bridge-in-sepolia-tx-explorer](/arbitrum/bridge-in-sepolia-tx-explorer.png)

## Bridge out (withdrawal) from your rollup

### Step 1: Choose an amount to withdraw from your rollup

In the [Arbitrum Bridge UI](https://bridge.arbitrum.io/),
chooose your origin chain to your **Arbitrum L3 Rollup** and
the destination chain as **Arbitrum Sepolia**.

![bridge-out-small-screenshot](/arbitrum/bridge-out-small-screenshot.png)

Click **Move funds to Arbitrum Sepolia** and read the
disclaimer, check the boxes, and click **Continue**.

![bridge-out-begin](/arbitrum/bridge-out-begin.png)

Optionally, set a reminder on your calendar so you don't forget.

After approving the transaction in your wallet, you'll be
able to see the transaction in the **Pending transactions** tab:

![bridge-out-pending](/arbitrum/bridge-out-pending.png)

After approximately two hours, you will be able to proceed to
Step 2: Claim your withdrawal.

Click **See details** to see an overview of your withdrawal:

![bridge-out-begin-overview](/arbitrum/bridge-out-begin-overview.png)

Optionally, view the transaction on your local explorer.

![bridge-out-tx-details](/arbitrum/bridge-out-rollup-tx-details.png)

To learn more about what is going on, click the **Logs** tab:

![bridge-out-logs-details-1](/arbitrum/bridge-out-logs-details-1.png)

![bridge-out-logs-explorer-2](/arbitrum/bridge-out-logs-explorer-2.png)

### Step 2: Claim your withdrawal

After approximately 2 hours, you will be able to claim your
withdrawal.

Head back to the bridge UI and you will have a notification
to claim your withdrawal. Click **Claim** in the details
of the transaction:

![bridge-out-claim-withdrawal](/arbitrum/bridge-out-claim-withdrawal.png)

Approve the transaction in your wallet.

After your transaction goes through, you can see the details
in the bridge UI under **Settled transctions**:

![bridge-out-claim-success-withdrawal](/arbitrum/bridge-out-claim-success-withdrawal.png)
