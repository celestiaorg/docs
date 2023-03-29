# Deploy a light node

## Description

Deploy a Celestia Light Node and Perform Data Availability
Sampling (DAS).

You can find resources on doing this by following the
tutorial [here](https://docs.celestia.org/nodes/light-node).

For an RPC endpoint to connect to, please see the list [here](https://docs.celestia.org/nodes/blockspace-race/#rpc-endpoints).

## Directions

1. Setup Your Celestia Light Node
2. Perform Data Availability Sampling (DAS).
3. How to find your light node id is found [here](https://docs.celestia.org/developers/node-gateway-docs/#post-p2pinfo).
4. Make sure that the wallet address the node uses is funded.
  To find your auto generated wallet by your node, use
  `./cel-key list --node.type light --keyring-backend test --p2p.network blockspacerace`
5. The keys directory under `.celestia-light-blockspacerace-0/keys`
  contains your `pubkey` for both DA and Tendermint networks. In
  the leaderboard your pubkey for DA nodes looks similar to this
  `12D3KooWSJoAF9pF7AkyEAhQCtNF9TA8JrAujWdqoPJ11uojuKZb`

Please do a backup of the keys directory in order to not lose your progress.

## Judging criteria

1. Full points for submitting node id and wallet address.
2. No points for not submitting both.

## Submission

Please submit your Light Node ID and your wallet address.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestia1vsvx8n7f8dh5udesqqhgrjutyun7zqrgehdq2l`
