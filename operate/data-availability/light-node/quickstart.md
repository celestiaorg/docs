# Light node: overview & quickstart

Celestia light nodes perform data availability sampling (DAS) to verify that
block data is available without downloading it all. They can also post and
retrieve blobs (data) from the Celestia network.

## Overview

Light nodes are the most common way to interact with Celestia networks.

![light-node](/img/nodes/LightNodes.png)

Light nodes:

1. Listen for `ExtendedHeaders` (block headers + DA metadata).
2. Perform DAS on received headers.

## Optional: run a light node in your browser

You can run Lumina in your browser on the decentralized explorer,
[Celenium](https://celenium.io).

<img
  width="1000"
  alt="Celenium running a light node with Lumina"
  src="https://github.com/user-attachments/assets/28183a24-8bb1-4f77-850c-d0528de075c7"
/>

## Run a light node (CLI)

This guide assumes you've completed:

- [Hardware requirements](/operate/getting-started/hardware-requirements)
- [Environment setup](/operate/getting-started/environment-setup)

### Install `celestia-node`

Follow the [Install celestia-node](/operate/data-availability/install-celestia-node)
guide (from source or using the pre-built binary installer).

### Initialize the node store

This creates the node store and a key for the network you choose.

Want to sync faster (skip sampling from genesis)? See
[Fast sync with a trusted hash](/operate/data-availability/light-node/advanced#fast-sync-with-a-trusted-hash).

**Mainnet Beta**

```bash
celestia light init
```

**Mocha**

```bash
celestia light init --p2p.network mocha
```

### Start the light node

Light nodes connect to a consensus node **gRPC** endpoint (usually port `9090`)
for state access (balances, submitting `PayForBlobs`, etc.).

**Mainnet Beta**

```bash
celestia light start \
  --core.ip public-endpoint.celestia-mainnet.quiknode.pro \
  --core.port 9090 --core.tls --p2p.network celestia
```

**Mocha**

```bash
celestia light start \
  --core.ip public-endpoint.celestia-mocha.quiknode.pro \
  --core.port 9090 --core.tls --p2p.network mocha
```

You can use any consensus node gRPC endpoint listed on
either [Mainnet Beta](/operate/networks/mainnet-beta#integrations) or
[Mocha testnet](/operate/networks/mocha-testnet#community-data-availability-da-grpc-endpoints-for-state-access).

If you're running on a server, make sure required ports are open. See
[Troubleshooting ports](/operate/maintenance/troubleshooting#ports).

### Get some testnet tokens (for blob posting)

To submit blobs on testnets, fund your light node address:

```bash
celestia state account-address
```

Then use a faucet:

- [Mocha faucet](/operate/networks/mocha-testnet#mocha-testnet-faucet)

On Mainnet Beta, fund this address with TIA to submit blobs.

### Check your balance (optional)

```bash
celestia state balance
```

### Post your first blob

Use `celestia blob submit <namespace> <data>` to post your first blob.
The example below uses a hex-encoded namespace and `0x`-prefixed hex data
to submit the text `gm`:

```bash
celestia blob submit 0x676d 0x676d
```

Keep the `0x` prefix when passing hex-encoded data. This explicit-hex form
works both before and after the blob submission fix in celestia-node #5262.
On builds containing that fix, unprefixed data is submitted as literal text:
`hello` submits `hello`, and `cafe` submits the four characters `cafe`.

Save the returned `height` and the first value in `commitments`. Commitments
are still returned as `0x`-prefixed hex strings.

### Retrieve your first blob

Replace `<height>` and `<commitment>` with the values from `blob submit`:

```bash
celestia blob get <height> 0x676d <commitment>
```

The returned `data` field should be `"gm"`.

If you see `header: syncing in progress`, wait for the node to sync or use
[fast sync](/operate/data-availability/light-node/advanced#fast-sync-with-a-trusted-hash).

## Next steps

- More operations and configuration: [Advanced](/operate/data-availability/light-node/advanced)
- Submitting blobs from an app: [Submit data](/learn/TIA/submit-data)