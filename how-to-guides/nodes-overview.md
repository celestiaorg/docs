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
- [Full storage node](/how-to-guides/full-storage-node.md): This node stores all
  the data but does not connect to Consensus.
- [Light node](/how-to-guides/light-node.md): Light clients conduct data availability
  sampling on the Data Availability network.

You can learn more about how to set up each different node by going through
each tutorial guide.

## Recommended Celestia node requirements

## Data availability nodes

### Non-archival data availability nodes

| Node type         | Memory      | CPU         | Disk       | Bandwidth |
|-------------------|-------------|-------------|------------|-----------|
| Light node        | 500 MB RAM  | Single core | 100 GB SSD | 56 Kbps   |
| Bridge node       | 64 GB RAM   | 8 cores     | 5 TiB NVME  | 1 Gbps    |
| Full storage node | 64 GB RAM   | 8 cores   | 5 TiB NVME  | 1 Gbps    |

### Archival data availability nodes

| Node type         | Memory      | CPU         | Disk       | Bandwidth |
|-------------------|-------------|-------------|------------|-----------|
| Light node        | 500 MB RAM  | Single core | 100 GB SSD | 56 Kbps   |
| Bridge node       | 64 GB RAM   | 8 cores     | 6 TiB NVME  | 1 Gbps    |
| Full storage node | 64 GB RAM   | 8 cores   | 6 TiB NVME  | 1 Gbps    |

### Consensus nodes

#### Non-archival consensus nodes

| Node type        | Memory      | CPU         | Disk       | Bandwidth |
|------------------|-------------|-------------|------------|-----------|
| Validator        | 24 GB RAM   | 8 cores     | 3 TiB NVME   | 1 Gbps    |
| Consensus node   | 24 GB RAM   | 8 cores     | 3 TiB NVME   | 1 Gbps    |

#### Archival consensus nodes

| Node type        | Memory      | CPU         | Disk       | Bandwidth |
|------------------|-------------|-------------|------------|-----------|
| Consensus node   | 64 GB RAM   | 8 cores   | 6 TiB NVME  | 1 Gbps    |


Please provide any feedback on the tutorials and guides. If you notice
a bug or issue, feel free to make a pull request or write up a Github
issue!
