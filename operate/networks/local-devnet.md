# Local devnet setup

This guide covers how to set up a local devnet with both consensus and bridge
nodes for development and testing purposes. A local devnet allows you to run a
complete Celestia network environment on your local machine.

## Choose your setup method

Pick the approach you want to follow:

## Default endpoints

Once your local devnet is running, you can access these endpoints:

| Service         | Endpoint                 |
| --------------- | ------------------------ |
| Consensus RPC   | `http://localhost:26657` |
| Consensus gRPC  | `http://localhost:9090`  |
| Consensus P2P   | `http://localhost:26656` |
| Bridge node API | `http://localhost:26658` |

## Multi-validator private networks (not local-only)

This page focuses on a single-machine devnet. If you instead want to create a private
testnet across multiple machines/participants (genesis + gentx flow), start from:

- [Signing genesis for a new network](/operate/consensus-validators/cli-reference#signing-genesis-for-a-new-network)
- [Optional: Set persistent peers](/operate/consensus-validators/consensus-node#optional-set-persistent-peers)

## Next steps

With your local devnet running, you can:

- [Submit blob data](/learn/TIA/submit-data)
- Test rollup integrations
- Develop applications using the [Celestia Node API](/build/rpc/node-api)
- Practice validator operations without risking real tokens