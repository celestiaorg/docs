---
description: An overview on how to participate in the Celestia network.
---

# Overview to running nodes on Celestia

There are many ways you can participate in the Celestia
[networks](/how-to-guides/participate.md).

Celestia node operators can run several options on the network.

Consensus:

- [Validator node](/how-to-guides/validator-node.md):
  This type of node participates
  in consensus by producing and voting on blocks.
- [Consensus node](/how-to-guides/consensus-node.md): A celestia-app full node
  to sync blockchain history.

Data Availability:

- [Bridge node](/how-to-guides/bridge-node.md): This node bridges blocks between the
  Data-Availability network and the Consensus network.
- [Light node](/how-to-guides/light-node.md): Light clients conduct data availability
  sampling on the Data Availability network.

You can learn more about how to set up each different node by going through
each tutorial guide.

## Recommended Celestia node requirements

## Data availability nodes

### Non-archival data availability nodes

| Node type   | Memory     | CPU         | Disk        | Bandwidth |
| ----------- | ---------- | ----------- | ----------- | --------- |
| Light node  | 500 MB RAM | Single core | 20 GB SSD   | 56 Kbps   |
| Bridge node | 64 GB RAM  | 8 cores     | 25 TiB NVME | 1 Gbps    |

### Archival data availability nodes

| Node type                     | Memory     | CPU         | Disk           | Bandwidth |
| ----------------------------- | ---------- | ----------- | -------------- | --------- |
| Light node (unpruned headers) | 500 MB RAM | Single core | 7 TiB NVME\*   | 56 Kbps   |
| Bridge node                   | 64 GB RAM  | 8 cores     | 637 TiB NVME\* | 1 Gbps    |

\*Archival disk requirement is based on the current v6 128MB/6s throughput at maximum capacity. In reality the requirement can be much lower and we advise regularly checking disk usage and having at least 1 month worth of max throughput of extra disk space.

### Consensus nodes

#### Non-archival consensus nodes

| Node type      | Memory    | CPU      | Disk        | Bandwidth |
| -------------- | --------- | -------- | ----------- | --------- |
| Validator      | 32 GB RAM | 16 cores | 12 TiB NVME | 1 Gbps    |
| Consensus node | 32 GB RAM | 16 cores | 12 TiB NVME | 1 Gbps    |

When upgrading to 128mb/6s, validators must use hardware that passes the [CPU benchmark](https://github.com/celestiaorg/celestia-app/blob/main/tools/cpu_requirements/README.md). If your server does not pass, upgrade to a more powerful machine.

For a list of CPUs tested for 128mb/6s, see the [release notes](https://github.com/celestiaorg/celestia-app/blob/main/docs/release-notes/release-notes.md#v6---128mb6s). Other CPUs are acceptable if they pass the benchmark. Recommended CPU specs:

- 32 or more cores
- GFNI (Galois Field New Instructions) support
- SHA-NI (SHA New Instructions) support

#### Archival consensus nodes

| Node type      | Memory    | CPU      | Disk           | Bandwidth |
| -------------- | --------- | -------- | -------------- | --------- |
| Consensus node | 64 GB RAM | 16 cores | 624 TiB NVME\* | 1 Gbps    |

\*Archival disk requirement is based on the current v6 128MB/6s throughput at maximum capacity. In reality the requirement can be much lower and we advise regularly checking disk usage and having at least 1 month worth of max throughput of extra disk space.

Please provide any feedback on the tutorials and guides. If you notice
a bug or issue, feel free to make a pull request or write up a Github
issue!
