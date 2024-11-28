# Setting up a Celestia local testnet

This guide walks through setting up a local Celestia testnet with a validator node, bridge node, and light node.

## Prerequisites

- celestia-app installed (based on [compatible versions](./participate.md))
- celestia node binary installed
- jq installed
- nc (netcat) installed

## Bash script

This method will start up the testnet with a bash script. It still assumes you have the prerequisites installed.

```bash
bash -c "$(curl -sL https://docs.celestia.org/start-local.sh)"
```

To interact with the nodes, you can use the `celestia` and `celestia-appd` CLIs. Use the [funding and testing](#funding-and-testing) section below as a guide.

## Manual setup

### Starting the validator node

First, navigate to the celestia-app scripts directory and run the single node script:

```bash
cd celestia-app/scripts
bash single-node.sh
```

### Setting up the bridge node

Once your validator node is running, get the genesis block hash:

```bash
curl -X GET "localhost:26657/block?height=1" | jq -r '.result .block_id.hash'
```

This will return a hash like:
```
1D53B32ACB02563E425BA1F8B5178B06A748E0F7B9748A8B1D07C34B454AF595
```

Set this as an environment variable:

```bash
export CELESTIA_CUSTOM=test:1D53B32ACB02563E425BA1F8B5178B06A748E0F7B9748A8B1D07C34B454AF595
```

Initialize the bridge node:

```bash
celestia bridge init \
    --node.store $HOME/.celestia-custom-bridge \
    --core.ip localhost \
    --core.grpc.port 9090 \
    --core.rpc.port 26657 \
    --p2p.network test
```

Start the bridge node:

```bash
celestia bridge start \
    --node.store $HOME/.celestia-custom-bridge \
    --core.ip localhost \
    --core.grpc.port 9090 \
    --core.rpc.port 26657 \
    --p2p.network test
```

### Setting up the light node

In a new terminal, set the same environment variable:

```bash
export CELESTIA_CUSTOM=test:1D53B32ACB02563E425BA1F8B5178B06A748E0F7B9748A8B1D07C34B454AF595
```

Initialize the light node:

```bash
celestia light init \
    --p2p.network test \
    --core.ip localhost:26657 \
    --node.store $HOME/.celestia-custom-light/
```

Get the bridge node's peer info:

```bash
celestia p2p info --node.store $HOME/.celestia-custom-bridge
```

From the output, locate the relevant IP4 address and peer ID. The output will look similar to this example output:

```json
{
  "result": {
    "id": "12D3KooWAVsZ36CdczaEXNNnDpsPcVyAnbeBe5EPG7AjttRGfux7",
    "peer_addr": [
      "/ip4/10.0.0.125/tcp/2121",
      "/ip4/10.0.0.125/udp/2121/webrtc-direct/certhash/uEiBXDYwH1McBsLM2aEc3SdvAuhq2ZQ0RUgbjgTvXMQm7LA",
      "/ip4/192.0.2.0/tcp/16279",
      "/ip4/192.0.2.0/udp/16279/webrtc-direct/certhash/uEiBXDYwH1McBsLM2aEc3SdvAuhq2ZQ0RUgbjgTvXMQm7LA",
      "/ip4/127.0.0.1/udp/2121/webrtc-direct/certhash/uEiBXDYwH1McBsLM2aEc3SdvAuhq2ZQ0RUgbjgTvXMQm7LA",
      "/ip6/::1/tcp/2121",
      "/ip6/::1/udp/2121/webrtc-direct/certhash/uEiBXDYwH1McBsLM2aEc3SdvAuhq2ZQ0RUgbjgTvXMQm7LA"
    ]
  }
}
```

Start the light node with custom RPC port and trusted peer:

```bash
celestia light start \
    --p2p.network test \
    --core.ip localhost:26657 \
    --node.store $HOME/.celestia-custom-light/ \
    --headers.trusted-peers /ip4/10.0.0.125/udp/2121/webrtc-direct/certhash/uEiBXDYwH1McBsLM2aEc3SdvAuhq2ZQ0RUgbjgTvXMQm7LA/p2p/12D3KooWAVsZ36CdczaEXNNnDpsPcVyAnbeBe5EPG7AjttRGfux7 \
    --rpc.port 42069
```

### Funding and testing

Get the bridge node's account address:

```bash
celestia state account-address --node.store $HOME/.celestia-custom-bridge
```

Get the light node's account address:

```bash
celestia state account-address --node.store $HOME/.celestia-custom-light --url http://localhost:42069
```

Send funds to the light node:

```bash
celestia-appd tx bank send validator celestia1p8yx4yveuu6ushyccepsuknaqpqn9ppq07m4n3 10000000utia \
    --chain-id test \
    --keyring-backend test \
    --fees 500utia
```

Test by submitting a blob from the light node:

```bash
celestia blob submit 0x4772756763686174 '"Simplicity is the ultimate sophistication." -Leonardo da Vinci' \
    --node.store $HOME/.celestia-custom-light \
    --url http://localhost:42069
```
