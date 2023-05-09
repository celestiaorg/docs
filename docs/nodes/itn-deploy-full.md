---
sidebar_label: Deploy a full storage node
description: Instructions for deploying a Celestia Full Storage Node.
---

# Deploy a full storage node

## Description

Deploy a Celestia Full Storage Node and Perform Data Availability
Sampling (DAS).

You can find resources on doing this by following the
tutorial [here](https://docs.celestia.org/nodes/full-storage-node).

For an RPC endpoint to connect to, please see the list [here](https://docs.celestia.org/nodes/blockspace-race/#rpc-endpoints).

:::tip
If you encounter errors, please visit the [upgrading your binary](../nodes/celestia-node.mdx#upgrading-your-binary)
and the [troubleshooting](../nodes/celestia-node.mdx#troubleshooting)
sections on the Install Celestia Node page.

The errors you may encounter for a full node are:

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
./cel-key list --node.type full --keyring-backend test --p2p.network blockspacerace
```

The keys directory under
`.celestia-full-blockspacerace-0/keys`
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

1. Setup Your Celestia Full Storage Node
2. How to find your full storage Node ID is found
  [here](https://docs.celestia.org/developers/node-gateway-docs/#post-p2pinfo)
3. Make sure that the wallet address the node uses is funded.
4. The keys directory under `.celestia-full-blockspacerace-0/keys`
  contains your `pubkey` for both DA and Tendermint networks. In the
  leaderboard your pubkey for DA nodes looks similar to this
  `12D3KooWSJoAF9pF7AkyEAhQCtNF9TA8JrAujWdqoPJ11uojuKZb`

Please do a backup of the keys directory in order to not lose your progress.

## Judging criteria

1. Full points for submitting Node ID and wallet address.
2. No points for not submitting both.

## Submission

Please submit your Full Storage Node ID and Wallet Address.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestia1vsvx8n7f8dh5udesqqhgrjutyun7zqrgehdq2l`
