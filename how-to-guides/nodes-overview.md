---
description: An overview on how to participate in the Celestia network.
---

# Overview to running nodes on Celestia

There are many ways you can participate in the Celestia
[networks](./participate.md).

Celestia node operators can run several options on the network.

Consensus:

- [Validator node](./validator-node):
  This type of node participates
  in consensus by producing and voting on blocks.
- [Consensus node](./consensus-node): A celestia-app full node
  to sync blockchain history.

Data Availability:

- [Bridge node](./bridge-node.md): This node bridges blocks between the
  Data-Availability network and the Consensus network.
- [Full storage node](./full-storage-node.md): This node stores all
  the data but does not connect to Consensus.
- [Light node](./light-node.md): Light clients conduct data availability
  sampling on the Data Availability network.

You can learn more about how to set up each different node by going through
each tutorial guide.

## Recommended Celestia node requirements

## Data availability nodes

| Node type         | Memory      | CPU         | Disk       | Bandwidth |
|-------------------|-------------|-------------|------------|-----------|
| Light node        | 500 MB RAM  | Single core | 100 GB SSD | 56 Kbps   |
| Bridge node       | 16 GB RAM   | 6 cores     | 2 TB NVME  | 1 Gbps    |
| Full storage node | 16 GB RAM   | Quad-core   | 2 TB NVME  | 1 Gbps    |

## Consensus nodes

| Node type        | Memory      | CPU         | Disk       | Bandwidth |
|------------------|-------------|-------------|------------|-----------|
| Validator        | 16 GB RAM   | 8 cores     | 2 TB SSD   | 1 Gbps    |
| Consensus node   | 16 GB RAM   | Quad-core   | 2 TB SSD   | 1 Gbps    |


Please provide any feedback on the tutorials and guides. If you notice
a bug or issue, feel free to make a pull request or write up a Github
issue!
