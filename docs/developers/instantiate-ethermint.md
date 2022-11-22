# Setting Up Your Environment for Ethermint on Celestia

Now the `ethermintd` binary is built, we need to setup a local network
that communicates between `ethermintd` and Rollmint.

## Run A Celestia Light Node

All sovereign rollups need to submit their transaction data to
Celestia.

Here, we must first setup a Celestia Light Node with testnet tokens.

You can do this by following this tutorial [here](./node-tutorial.mdx).

## Instantiating the Ethermint Rollup

With a Celestia Light Node running in one terminal session,
we can proceed to generate the Ethermint rollup.

In the `ethermint` directory, we have a helpful bash script that
allows you to instantiate a local Ethermint sovereign rollup on Celestia.

Run the following:

```sh
cd ethermint
bash init.sh
```

This bash script does everything needed to initialize your Ethermint
rollup.

First, we need to setup some environment variables.

<!-- markdownlint-disable MD013 -->
```sh
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 15; echo;)
DA_BLOCK_HEIGHT=$(curl https://rpc.limani.celestia-devops.dev/block?height | jq -r '.result.block.header.height')
```
<!-- markdownlint-enable MD013 -->

If you are running this on Arabica testnet, you need to get

With it complete, we can now start our Ethermint Rollup:

<!-- markdownlint-disable MD013 -->
```sh
ethermintd start --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000}' --rollmint.namespace_id $NAMESPACE_ID --rollmint.da_start_height $DA_BLOCK_HEIGHT 
```
<!-- markdownlint-enable MD013 -->

You should start seeing logs about the chain starting.

With that, we have kickstarted our `ethermintd` network!
