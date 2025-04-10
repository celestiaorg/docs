# Mammoth testnet

![mamo-1.png](/img/mamo-1.png)

The Mammoth testnet is designed to demonstrate Celestia's high throughput capabilities with a larger validator set that closely mirrors real network conditions. This testnet will allow teams to stress test the network and verify our scaling capabilities.

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
| `celestia-node` | `v0.21.9-mammoth-v0.0.10` |
| `celestia-app` | `v3.4.2-mammoth-v0.6.0` |

The testnet includes custom versions with:
- Datastore sharding
- 1-day sampling and pruning window
- Optimized block time consistency
- Maximum transaction size of 32MB, specifically where `max_tx_bytes: 33554400`

### RPC Endpoints

| Location | gRPC | RPC | API |
|----------|------|-----|-----|
| Amsterdam | | https://rpc.ams.mamochain.com | https://api.ams.mamochain.com |
| Paris | https://grpc.mamochain.com | https://rpc.par.mamochain.com | https://api.par.mamochain.com |
| Warsaw | | https://rpc.waw.mamochain.com | https://api.waw.mamochain.com |

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

Install celestia-node version `v0.21.9-mammoth-v0.0.10`, by using this quick install command:

```bash
# quick install
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)" -- -v v0.21.9-mammoth-v0.0.10
```

If you'd like to build from source, checkout to `v0.21.9-mammoth-v0.0.10` and run the commands from the [celestia-node](/how-to-guides/celestia-node.md) page.

Once installed, initialize your node:

```bash
celestia light init --p2p.network mammoth
```

Start your light node with state access (with a consensus endpoint):

```bash
celestia light start --p2p.network mammoth --core.ip conval-8.ams.mamochain.com --core.port 9090 --rpc.skip-auth
```

Find your account address:

```bash
celestia state account-address
```

### Visit the faucet

Head to the faucet at [faucet.mamochain.com](https://faucet.mamochain.com) to request tokens for the Mammoth testnet.

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

```bash
{
  "result": {
    "height": 5235704,
    "commitments": [
      "0xb4774f791439fb1c09ee293812bf7dc7cfc75f20c49dd16d061459dc8f5febff"
    ]
  }
}
```

#### Retrieve the blob

Retrieve your blob with the data from the response from your submission:

```bash
# example
# celestia blob get <height> <namespace> <commitment>
celestia blob get 5235704 0x676d 0xb4774f791439fb1c09ee293812bf7dc7cfc75f20c49dd16d061459dc8f5febff
```

### Optional: Post a blob with a frontend

Head to [gmamo.vercel.app](https://gmamo.vercel.app) to post a blob through a UI, learn about your node, and run a locally encrypted database rollup.
