# Mammoth testnet

![mamo-1.png](/img/mamo-1.png)

The Mammoth testnet is designed to demonstrate Celestia's high throughput capabilities with a larger validator set that closely mirrors real network conditions. This testnet will allow teams to stress test the network and verify our scaling capabilities. Read more about `mamo-1` in [the blog post](https://blog.celestia.org/mamo-1/).

## Overview

| Parameter | Value |
|-----------|--------|
| Chain ID | `mamo-1` |
| Genesis Hash | `8BED0B775B983596B90EEDDC245C13EF7EB4054EEA60E1F25393868C4A2C6660` |
| Target Block Time | 6 seconds |
| Target Throughput | 21.33MB/s at 128MB/6s |

## Chain details

The Mammoth testnet runs across 3 regions (Paris, Warsaw, Amsterdam) with 7 validators and 2 bridge nodes in each region (21 validators & 6 bridge nodes total). It includes an archival node to assist bridge nodes in network synchronization.

### Block explorer

Explorer for Mammoth testnet is available at [mammoth.celenium.io](https://mammoth.celenium.io)

### Software versions

| Software | Version |
|----------|---------|
| `celestia-node` | `v0.21.9-mammoth-v0.0.16` |
| `celestia-app` | `v3.4.2-mammoth-v0.6.0` |

The testnet includes custom versions with:
- Datastore sharding
- 1-day sampling and pruning window
- Optimized block time consistency
- Maximum transaction size of 32MB, specifically where `max_tx_bytes: 33554400`

### RPC Endpoints

| Location | gRPC | RPC | API |
|----------|------|-----|-----|
| Amsterdam | https://global.grpc.mamochain.com | https://rpc.ams.mamochain.com | https://api.ams.mamochain.com |
| Paris | https://global.grpc.mamochain.com | https://rpc.par.mamochain.com | https://api.par.mamochain.com |
| Warsaw | https://global.grpc.mamochain.com | https://rpc.waw.mamochain.com | https://api.waw.mamochain.com |

<details>
<summary><b>Amsterdam validators</b></summary>

- conval-8.ams.mamochain.com
- conval-9.ams.mamochain.com
- conval-10.ams.mamochain.com
- conval-11.ams.mamochain.com
- conval-12.ams.mamochain.com
- conval-13.ams.mamochain.com
</details>

<details>
<summary><b>Paris validators</b></summary>

- conval-0.par.mamochain.com
- conval-1.par.mamochain.com
- conval-2.par.mamochain.com
- conval-3.par.mamochain.com
- conval-4.par.mamochain.com
- conval-5.par.mamochain.com
- conval-6.par.mamochain.com
- conval-7.par.mamochain.com
</details>

<details>
<summary><b>Warsaw validators</b></summary>

- conval-14.waw.mamochain.com
- conval-15.waw.mamochain.com
- conval-16.waw.mamochain.com
- conval-17.waw.mamochain.com
- conval-18.waw.mamochain.com
- conval-19.waw.mamochain.com
- conval-20.waw.mamochain.com
</details>

Status: <https://rpc.ams.mamochain.com/status>

## Post data to Mammoth testnet

### Set up your light node

Install celestia-node version `v0.21.9-mammoth-v0.0.16`, by using this quick install command:

```bash
# quick install
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)" -- -v v0.21.9-mammoth-v0.0.16
```

If you'd like to build from source, checkout to `v0.21.9-mammoth-v0.0.16` and run the commands from the [celestia-node](/how-to-guides/celestia-node.md) page.

Once installed, initialize your node:

```bash
celestia light init --p2p.network mammoth
```

Start your light node with state access (with a consensus endpoint):

:::tip
The `rpc.skip-auth` flag is being used to skip auth for the [demo app](#optional-post-a-blob-with-a-frontend), but this is optional.
:::

```bash
celestia light start --p2p.network mammoth --core.ip global.grpc.mamochain.com --core.port 9090 --rpc.skip-auth
```

Find your account address:

```bash
celestia state account-address
```

### Visit the faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS.
:::

Head to the faucet at [celenium.io/faucet](https://celenium.io/faucet) or [faucet.mamochain.com](https://faucet.mamochain.com) to request tokens for the Mammoth testnet.

Check your balance:

```bash
celestia state balance
```

### Post your first blob

#### Send the blob

Use the CLI to post your first blob.

```bash
celestia blob submit 676d 676d
```

Where the response will look similar to:

```json
{
  "result": {
    "height": 39651,
    "commitments": [
      "0xb4774f791439fb1c09ee293812bf7dc7cfc75f20c49dd16d061459dc8f5febff"
    ]
  }
}
```

#### Retrieve the blob

Retrieve your blob with the data from the response from your submission:

:::tip
You'll have to have your node synced all the way to the tip of the chain to retrieve the blob you just posted. You can check the syncing status with `celestia das sampling-stats`. Alternatively, you can [follow the guide to set a trusted hash and height](/how-to-guides/celestia-node-trusted-hash.md) and skip sampling the entire chain.
:::

```bash
# example
# celestia blob get <height> <namespace> <commitment>
celestia blob get 5235704 0x676d 0xb4774f791439fb1c09ee293812bf7dc7cfc75f20c49dd16d061459dc8f5febff
```

Your result should look similar to:

```json
{
  "result": {
    "namespace": "0x676d",
    "data": "0x676d",
    "share_version": 0,
    "commitment": "0xb4774f791439fb1c09ee293812bf7dc7cfc75f20c49dd16d061459dc8f5febff",
    "index": 9
  }
}
```

### Optional: Post and retrieve the blob in one command

This command will post and retrieve the blob immediately:

```bash
celestia blob submit 676d 676d | tee /dev/tty | jq -r '"\(.result.height) 676d \(.result.commitments[0])"' | xargs -n3 celestia blob get
```

### Optional: Post a blob with a frontend

Head to [gmamo.vercel.app](https://gmamo.vercel.app) to explore an interactive UI that offers several features:
- [View your node information and transfer TIA](#see-your-node-s-info)
- [Monitor sampling statistics](#see-your-node-s-sampling-stats)
- [Upload and retrieve blobs or images](#upload-and-retrieve-blob-or-image-to-mammoth)
- [Create encrypted database rollups](#create-a-private-database-rollup)

#### See your node's info

The dashboard tab provides a comprehensive view of your node's information and allows you to send TIA to other addresses:

![node info](/img/mamo/mamo-nodeinfo.png)

#### See your node's sampling stats

Monitor your light node's performance and sampling statistics in real-time:

![sampling stats](/img/mamo/mamo-sampler.png)

#### Upload and retrieve blob or image to Mammoth

Use the blob management interface to upload and retrieve data, supporting images up to 32 MB:

![uploader](/img/mamo/mamo-blob.png)

Here's what the process looks like in action:

When uploading an image:
![mamo-post.png](/img/mamo/mamo-post.png)

When retrieving an image:
![mamo-retrieve.png](/img/mamo/mamo-retrieve.png)

#### Create a private database rollup

Create and manage your own encrypted database rollup with a custom schema. Your encryption key is securely stored in your browser's local storage for private access:

![mamo-dbstart.png](/img/mamo/mamo-dbstart.png)

After setting up your database, you can add entries according to your defined schema:

![mamo-dbenter.png](/img/mamo/mamo-dbenter.png)
