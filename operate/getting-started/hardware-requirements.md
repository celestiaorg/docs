# Hardware requirements

## Data availability nodes

### Non-archival data availability nodes

| Node type   | Memory     | CPU         | Disk        | Bandwidth |
| ----------- | ---------- | ----------- | ----------- | --------- |
| Light node  | 500 MB RAM | Single core | 20 GB SSD   | 56 Kbps   |
| Bridge node | 64 GB RAM  | 32 cores    | 25 TiB NVME | 1 Gbps    |

Non-archival node requirements are based on the maximum possible throughput at 128MB/6s for 7 days. Operators may provision less by pruning more aggressively **at their own risk**.

### Archival data availability nodes

| Node type                     | Memory     | CPU         | Disk           | Bandwidth |
| ----------------------------- | ---------- | ----------- | -------------- | --------- |
| Light node (unpruned headers) | 500 MB RAM | Single core | 7 TiB NVME\*   | 56 Kbps   |
| Bridge node                   | 64 GB RAM  | 32 cores    | 637 TiB NVME\* | 1 Gbps    |

\*Archival disk requirement is based on the current v6 128MB/6s throughput at maximum capacity for one year. In reality the requirement can be much lower and we advise regularly checking disk usage and having at least 1 month worth of max throughput of extra disk space.

## Consensus nodes

### Non-archival consensus nodes

| Node type      | Memory    | CPU      | Disk        | Bandwidth |
| -------------- | --------- | -------- | ----------- | --------- |
| Validator      | 32 GB RAM | 32 cores | 12 TiB NVME | 1 Gbps    |
| Consensus node | 32 GB RAM | 32 cores | 12 TiB NVME | 1 Gbps    |

Non-archival node requirements are based on the maximum possible throughput at 128MB/6s for 7 days. Operators may provision less by pruning more aggressively **at their own risk**.

#### Archival consensus nodes

| Node type      | Memory    | CPU      | Disk           | Bandwidth |
| -------------- | --------- | -------- | -------------- | --------- |
| Consensus node | 64 GB RAM | 32 cores | 624 TiB NVME\* | 1 Gbps    |

\*Archival disk requirement is based on the current v6 128MB/6s throughput at maximum capacity for one year. In reality the requirement can be much lower and we advise regularly checking disk usage and having at least 1 month worth of max throughput of extra disk space.

When upgrading to 128MB/6s, validators must use hardware that passes the [CPU benchmark](https://github.com/celestiaorg/celestia-app/blob/main/tools/cpu_requirements/README.md). If your server does not pass, upgrade to a more powerful machine.

For a list of CPUs tested for 128MB/6s, see the [release notes](https://github.com/celestiaorg/celestia-app/blob/main/docs/release-notes/release-notes.md#v6---128mb6s). Other CPUs are acceptable if they pass the benchmark. Recommended CPU specs:

- 32 or more cores
- GFNI (Galois Field New Instructions) support
- SHA-NI (SHA New Instructions) support

---