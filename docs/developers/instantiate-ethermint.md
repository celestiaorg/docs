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

:::danger caution

If you are on macOS, you will need to install md5sha1sum before starting your
rollup:

```sh
brew install md5sha1sum
```

:::

Run the following:

```sh
cd ethermint
bash init.sh
```

This bash script does everything needed to initialize your Ethermint
rollup.

First, we need to setup some environment variables.

:::danger Networks

The commands below are for Arabica. If you're using Mocha, you'll need to
replace the RPC endpoint with [one for Mocha](../nodes/mocha-testnet.md#rpc-endpoints).

:::

<!-- markdownlint-disable MD013 -->
```sh
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
DA_BLOCK_HEIGHT=$(curl https://rpc.limani.celestia-devops.dev/block | jq -r '.result.block.header.height')
```
<!-- markdownlint-enable MD013 -->

If you are running this on Arabica devnet, you need to run your light node with
an account that has Arabica devnet tokens. Visit the faucet [here](../nodes/arabica-devnet.md#arabica-devnet-faucet).

With this setup complete, we can now start our Ethermint Rollup:

<!-- markdownlint-disable MD013 -->
```sh
ethermintd start --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000,"fee":6000}' --rollmint.namespace_id $NAMESPACE_ID --rollmint.da_start_height $DA_BLOCK_HEIGHT 
```
<!-- markdownlint-enable MD013 -->

You should start seeing logs about the chain starting.
They will look similar to below:

<!-- markdownlint-disable MD013 -->
```sh
1:27AM INF Unlocking keyring
1:27AM INF starting ABCI with Tendermint
1:27AM INF service start impl=EventBus module=events msg={}
1:27AM INF service start impl=PubSub module=pubsub msg={}
badger 2022/11/23 01:27:54 INFO: All 0 tables opened in 0s
badger 2022/11/23 01:27:54 INFO: Discard stats nextEmptySlot: 0
badger 2022/11/23 01:27:54 INFO: Set nextTxnTs to 0
1:27AM INF service start impl=IndexerService module=txindex msg={}
1:27AM INF WARNING: using default DA block time DABlockTime=30000 module=BlockManager
1:27AM INF initializing blockchain state from genesis.json
1:27AM INF created new capability module=ibc name=ports/transfer
1:27AM INF port binded module=x/ibc/port port=transfer
1:27AM INF claimed capability capability=1 module=transfer name=ports/transfer
1:27AM INF asserting crisis invariants inv=1/11 module=x/crisis name=gov/module-account
1:27AM INF asserting crisis invariants inv=2/11 module=x/crisis name=staking/module-accounts
1:27AM INF asserting crisis invariants inv=3/11 module=x/crisis name=staking/nonnegative-power
1:27AM INF asserting crisis invariants inv=4/11 module=x/crisis name=staking/positive-delegation
1:27AM INF asserting crisis invariants inv=5/11 module=x/crisis name=staking/delegator-shares
1:27AM INF asserting crisis invariants inv=6/11 module=x/crisis name=bank/nonnegative-outstanding
1:27AM INF asserting crisis invariants inv=7/11 module=x/crisis name=bank/total-supply
1:27AM INF asserting crisis invariants inv=8/11 module=x/crisis name=distribution/nonnegative-outstanding
1:27AM INF asserting crisis invariants inv=9/11 module=x/crisis name=distribution/can-withdraw
1:27AM INF asserting crisis invariants inv=10/11 module=x/crisis name=distribution/reference-count
1:27AM INF asserting crisis invariants inv=11/11 module=x/crisis name=distribution/module-account
1:27AM INF asserted all invariants duration=3.783918 height=0 module=x/crisis
1:27AM INF service start impl=RPC msg={}
1:27AM INF service start impl=Node msg={}
1:27AM INF serving HTTP listen address={"IP":"127.0.0.1","Port":26657,"Zone":""}
1:27AM INF starting P2P client
1:27AM INF listening on address=/ip4/143.244.145.92/tcp/26656/p2p/12D3KooWCrCqYheUBURCzzUqgxWFVFvFYPJ6nonTPN9uVQ4cXK5H module=p2p
1:27AM INF listening on address=/ip4/127.0.0.1/tcp/26656/p2p/12D3KooWCrCqYheUBURCzzUqgxWFVFvFYPJ6nonTPN9uVQ4cXK5H module=p2p
1:27AM INF no seed nodes - only listening for connections module=p2p
1:27AM INF starting Celestia Data Availability Layer Client baseURL=http://localhost:26659 module=da_client
1:27AM INF working in aggregator mode block time=30000
1:27AM INF Creating and publishing block height=1 module=BlockManager
1:27AM INF minted coins from module account amount=2059726034250856481aphoton from=mint module=x/bank
1:27AM INF submitting block to DA layer height=1 module=BlockManager
1:28AM INF Starting JSON-RPC server address=0.0.0.0:8545
1:28AM INF Starting JSON WebSocket server address=0.0.0.0:8546
1:28AM INF successfully submitted rollmint block to DA layer daHeight=25422 module=BlockManager rollmintHeight=1
1:28AM INF commit synced commit=436F6D6D697449447B5B323130203138352031373920362035322031333820373020313032203135322038302032323920313232203132342036332031382032313920313039203337203832203631203334203139302031323520393020323133203835203232382032323420323232203134203739203131305D3A317D
1:28AM INF indexed block height=1 module=txindex
1:28AM INF Creating and publishing block height=2 module=BlockManager
1:28AM INF minted coins from module account amount=2059726403014551280aphoton from=mint module=x/bank
1:28AM INF submitting block to DA layer height=2 module=BlockManager
1:28AM INF successfully submitted rollmint block to DA layer daHeight=25423 module=BlockManager rollmintHeight=2
1:28AM INF commit synced commit=436F6D6D697449447B5B3630203231332038372032313820383920313920323034203230322031363320383120323235203235352036352032323820313530203232392032333320323139203233322032343420313334203337203134342031303320313634203138382031393720323339203230342032303120323138203130325D3A327D
1:28AM INF indexed block height=2 module=txindex
1:28AM INF Creating and publishing block height=3 module=BlockManager
1:28AM INF minted coins from module account amount=2059726771778267119aphoton from=mint module=x/bank
1:28AM INF submitting block to DA layer height=3 module=BlockManager
1:29AM INF successfully submitted rollmint block to DA layer daHeight=25424 module=BlockManager rollmintHeight=3
1:29AM INF commit synced commit=436F6D6D697449447B5B313520323038203831203131203235332032322037322031393020333220323130203634203235332032303920313839203934203137203431203135203230302039362031383920323820313736203132332037352032392031393320313831203134312032303520323231203232325D3A337D
1:29AM INF indexed block height=3 module=txindex
1:29AM INF Creating and publishing block height=4 module=BlockManager
1:29AM INF minted coins from module account amount=2059727140542003996aphoton from=mint module=x/bank
1:29AM INF submitting block to DA layer height=4 module=BlockManager
1:29AM INF successfully submitted rollmint block to DA layer daHeight=25425 module=BlockManager rollmintHeight=4
1:29AM INF commit synced commit=436F6D6D697449447B5B313433203332203639203732203134342034352037302034302032392032303120393720313137203235312031393320313738203137362031353920323038203231372036312032362031353720353320393820323234203230352031373020313920313034203138372031323220385D3A347D
1:29AM INF indexed block height=4 module=txindex
1:29AM INF Creating and publishing block height=5 module=BlockManager
```
<!-- markdownlint-enable MD013 -->

With that, we have kickstarted our `ethermintd` network!
