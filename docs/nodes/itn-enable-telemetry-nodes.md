# Restart your node with metrics flags

## Description

Add metrics flags to your node start command
and restart your node to apply it.

The metrics endpoint will gather your node's data
to track your uptime.

## Directions

1. Add `--metrics.tls=false --metrics --metrics.endpoint otel.celestia.tools:4318`
  to your node's start command and restart your node.

## Judging criteria

:::tip
If you are having troubles after a node
restart, please do the following:

- Keep restarting the node process until
  it works (without deleting any folders)
- Do not be afraid of warnings or occasional
  errors - as long as blocks are syncing, it's fine
- Try using a different RPC from the list [here](https://docs.celestia.org/nodes/blockspace-race/#rpc-endpoints)
:::

1. Full points if we can see data from your Celestia Node
2. No points if we cannot
3. Note that we will keep track of your metrics throughout the whole
  ITN so make sure you leave it connected throughout all phases.
4. Make sure you can see your node ID on [Tiascan](https://tiascan.com) in
  your respective node category. You can also check your node uptime
  status there.

## How to submit

Please submit your Node ID so that we can confirm it is pushing metrics.

Submission link can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`
