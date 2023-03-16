# Setup Your Validator

## Description

Prepare your nodes and submit gentx to start the network.

Check out the Discord channel #validator if you need assistance
or want to assist other validators.

## Directions

This task is for you to setup your own validator.

1. Relevant docs: [environment setup](https://docs.celestia.org/nodes/environment/),
  [Celestia app installation](https://docs.celestia.org/nodes/celestia-app/),
  [Celestia node installation](https://docs.celestia.org/nodes/celestia-node/).
2. Genesis instructions are found [here](https://docs.celestia.org/nodes/celestia-app-commands#signing-genesis-for-a-new-network).
  Please use chain-id blockspacerace-0 and staking amount for gentx
  5000000000000utia. The repo to submit gentx is found on Discord.
  Make sure you name the PR and the gentx after your validator name.
3. **Gentx submission deadline is Friday, March 10th 2023 23:59 UTC.**
4. You will find the final `genesis.json` file [here](https://github.com/celestiaorg/networks/blob/master/blockspacerace/genesis.json).
  Move it to your `~/.celestia-app/config` directory. For a refresher
  on setting up your validator, please follow the guide [here](https://docs.celestia.org/nodes/validator-node/)
  Note that the guide refers to Mocha testnet, you will need to
  change to `blockspacerace-0` chain-id for your validator. **Please DO
  NOT use pruning for now due to the bridge node, if this changes, we
  will let you know.**
5. **OPTIONAL** Enable geolocation for your validator:
  a. Open `~/celestia-app/config/config.toml`
  b. Look for `[rpc]` section
  c. Make sure the `laddr` is set like this: `laddr = "tcp://0.0.0.0:26657"`
  d. In your infrastructure settings, allow the port 26657 to be accessible publicly
  e. Then restart your validator
6. **Make sure to wait for official node release AFTER genesis,
  before setting it up.** Instructions to start a bridge
  node are found [here](https://docs.celestia.org/nodes/bridge-node/#deploy-the-celestia-bridge-node).
  Please use your own celestia-app node as the endpoint for your
  bridge node and make sure to add
  `--metrics.tls=false --metrics --metrics.endpoint otel.celestia.tools:4318`
  to your bridge node's start command.
7. How to find your bridge node id is found [here](https://docs.celestia.org/developers/node-api/#post-p2pinfo).

## Judging Criteria

1. Full points if validator and bridge node are successfully setup.
2. No points if either of them has not been successfully set up.
3. Having a running validator and bridge node is a prerequisite for
  participation in the testnet.

## Submission

Validators need to submit their `celestiavaloper` operator address and
their Bridge Node ID.

Link to submit can be found [here](https://celestia.knack.com/theblockspacerace#testnet-portal).

## Example

**This is only a submission example! Do NOT use it on your task submission.**

`12D3KooWFXnqPbzeAEwMuuaxuEsBG1XV6xVDqzNZJyk8qYxEAVDw`

`celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p`
