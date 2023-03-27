# Deploy A Bridge Node

## Description

Deploy a Celestia Bridge Node and Perform Data Availability
Sampling (DAS).

You can find resources on doing this by following the
tutorial [here](https://docs.celestia.org/nodes/bridge-node)
and [here](https://docs.celestia.org/developers/node-tutorial#submit-a-pfd-transaction).

For an RPC endpoint, you as a Bridge Node Operator must run your own
Consensus Full Node and connect your Bridge Node to it.

The docs for that are found [here](https://docs.celestia.org/nodes/consensus-full-node).

## Directions

1. Setup Your Celestia Bridge Node
2. How to find your bridge node id is found [here](https://docs.celestia.org/developers/node-api/#post-p2pinfo)
3. Make sure that the wallet address the node uses is funded
4. The keys directory under `.celestia-bridge-blockspacerace-0/keys` contains your `pubkey` for both DA and Tendermint networks. In the leaderboard your pubkey for DA nodes looks similar to this '12D3KooWSJoAF9pF7AkyEAhQCtNF9TA8JrAujWdqoPJ11uojuKZb' 
Please do a backup of the keys directory in order to not lose your progress.


## Judging Criteria

1. Full points for submitting node id and Wallet Address.
2. No points for not submitting both.

## Submission

Please submit your Bridge Node ID and wallet address.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestia1vsvx8n7f8dh5udesqqhgrjutyun7zqrgehdq2l`
