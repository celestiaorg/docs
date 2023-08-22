---
sidebar_label: Deploy a bridge node
description: Instructions for deploying a Celestia bridge node.
---

# Deploy a bridge node

## Description

Deploy a Celestia bridge node and Perform Data Availability
Sampling (DAS).

You can find resources on doing this by following the
tutorial [here](../../nodes/bridge-node)
and [here](../../developers/node-tutorial#submit-a-pfb-transaction).

For an RPC endpoint, you as a bridge node Operator must run your own
full consensus node and connect your bridge node to it.

The docs for that are found [here](https://docs.celestia.org/nodes/full-consensus-node).

:::tip
If you encounter errors, please visit the [upgrading your binary](../nodes/celestia-node.mdx#upgrading-your-binary)
and the [troubleshooting](../nodes/celestia-node.mdx#troubleshooting)
sections on the Install Celestia Node page.

The errors you may encounter for a bridge node are:

<!-- markdownlint-disable MD013 -->
```bash
storing EDS to eds.Store for block height XXXXX: failed to check if root already exists in index: failed to acquire reader of mount on initialization: mount fetch failed: open /home/avril14th/.celestia-bridge-blockspacerace-0/transients/transient-B82CC0ED0F163D0BB3604A176B650D3E83A47D68505362CC54EAEE4ABCF84DA9.partial: too many open files
```
<!-- markdownlint-enable MD013 -->

:::

:::caution
Make sure that the wallet address the node uses is funded.
To find your auto generated wallet by your node, use:

```bash
./cel-key list --node.type bridge --keyring-backend test --p2p.network blockspacerace
```

The keys directory under
`.celestia-bridge-blockspacerace-0/keys`
contains your pubkey for both DA and Tendermint networks.
In the leaderboard your pubkey for DA nodes looks similar to this:

```bash
12D3KooWJ3K6x9mXvy9oAJMr2gjeJ45KtU1LH6aL5stKF8YtRkkm
```

If you move the keys folder, you will need to upgrade permissions with:

```bash
chmod 600 keys
```

To learn more, visit the
[Wallet with Celestia Node](../../developers/celestia-node-key/) page.
:::

## Directions

1. Setup Your Celestia bridge node
2. How to find your bridge node ID is found
  [here](../../developers/node-tutorial/#get-your-node-id)
3. Make sure that the wallet address the node uses is funded
4. The keys directory under `.celestia-bridge-blockspacerace-0/keys`
  contains your `pubkey` for both DA and Tendermint networks. In
  the leaderboard your pubkey for DA nodes looks similar to this
  `12D3KooWSJoAF9pF7AkyEAhQCtNF9TA8JrAujWdqoPJ11uojuKZb`

Please do a backup of the keys directory in order to not lose your progress.

## Judging criteria

1. Full points for submitting Node ID and wallet address.
2. No points for not submitting both.

## Submission

Please submit your bridge node ID and wallet address.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestia1vsvx8n7f8dh5udesqqhgrjutyun7zqrgehdq2l`
