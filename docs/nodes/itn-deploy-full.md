# Deploy a full storage node

## Description

Deploy a Celestia Full Storage Node and Perform Data Availability
Sampling (DAS).

You can find resources on doing this by following the
tutorial [here](https://docs.celestia.org/nodes/full-storage-node).

For an RPC endpoint to connect to, please see the list [here](https://docs.celestia.org/nodes/blockspace-race/#rpc-endpoints).

## Directions

1. Setup Your Celestia Full Storage Node
2. How to find your full storage node id is found
  [here](https://docs.celestia.org/developers/node-gateway-docs/#post-p2pinfo)
3. Make sure that the wallet address the node uses is funded.
4. The keys directory under `.celestia-full-blockspacerace-0/keys`
  contains your `pubkey` for both DA and Tendermint networks. In the
  leaderboard your pubkey for DA nodes looks similar to this
  `12D3KooWSJoAF9pF7AkyEAhQCtNF9TA8JrAujWdqoPJ11uojuKZb`

Please do a backup of the keys directory in order to not lose your progress.

## Judging criteria

1. Full points for submitting node id and wallet address.
2. No points for not submitting both.

## Submission

Please submit your Full Storage Node ID and Wallet Address.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestia1vsvx8n7f8dh5udesqqhgrjutyun7zqrgehdq2l`
