# Hardware requirements

## Disk sizing

The consensus and bridge disk recommendations below are Mainnet Beta starting
points based on [node-store measurements from 30 September 2026](https://gist.github.com/rootulp/6680db718f4260948cf391ef0068d525),
with additional capacity for growth. They are not maximum-throughput guarantees
or a promise of a year of storage. The measurements did not verify sync status
or complete archival history. Mocha requires separate sizing based on its own
usage and retained history.

Disk sizes use decimal TB (1 TB = 1,000 GB), except the legacy archival light-node
estimate marked in TiB. Provision usable capacity after RAID and filesystem
overhead. Monitor both node-store usage and free filesystem space, measure growth
over time, and expand before the remaining space falls below what your node will
consume during your storage expansion lead time. Allow extra room for database
compaction, snapshots, backups, and other services.

For capacity planning, multiply data throughput by retention time, then allow for
the node's storage format and database overhead. Sustained utilisation of 20–30%
of a 32 MiB block every 3 seconds produces approximately 1.4–2.0 TB of payload
over 169 hours, before storage overhead. This is a planning scenario, not measured
network utilisation: a 2 TB bridge cannot be assumed to cover it. Size for your
expected traffic and retention rather than treating observed usage as a limit.

## Data availability nodes

### Non-archival data availability nodes

| Node type   | Memory     | CPU         | Disk        | Bandwidth |
| ----------- | ---------- | ----------- | ----------- | --------- |
| Light node  | 500 MB RAM | Single core | 20 GB SSD   | 56 Kbps   |
| Bridge node | 64 GB RAM  | 32 cores    | 2 TB NVMe | 1 Gbps    |

The measured pruned bridge store used approximately 317 GB. The recommendation
assumes pruning remains enabled. In celestia-node
v0.34.3, the default bridge
[storage window](https://github.com/celestiaorg/celestia-node/blob/v0.34.3/share/availability/window.go)
is 169 hours (seven days plus one hour). This is the software default; the
measured node's effective retention window was not independently verified.
Provision separately for any [consensus node](/operate/consensus-validators/consensus-node)
used by the bridge, even if both services share a host.

### Archival data availability nodes

| Node type                    | Memory     | CPU         | Disk          | Bandwidth |
| ---------------------------- | ---------- | ----------- | ------------- | --------- |
| Light node (unpruned headers) | 500 MB RAM | Single core | 7 TiB NVMe\*  | 56 Kbps   |
| Bridge node                  | 64 GB RAM  | 32 cores    | 12 TB NVMe | 1 Gbps    |

The measured archival bridge store used approximately 6.2 TB. Its service was
configured with `--archival`, but that does not establish complete historical
coverage. Check the history you need to retain and its growth before provisioning.
Archival storage continues to grow as new blocks arrive.

\*The archival light-node figure retains the earlier conservative estimate for
one year at the 128 MB/6 s planning envelope. No archival light node was measured
in this update; this figure has not been validated against observed usage.

## Consensus nodes

### Non-archival consensus nodes

| Node type      | Memory    | CPU      | Disk       | Bandwidth |
| -------------- | --------- | -------- | ---------- | --------- |
| Validator      | 32 GB RAM | 32 cores | 2 TB NVMe | 1 Gbps    |
| Consensus node | 32 GB RAM | 32 cores | 2 TB NVMe | 1 Gbps    |

The measured pruned consensus store used approximately 206 GB with
`pruning = "default"` and `min-retain-blocks = 3000` in `app.toml`.
The recommendation applies to nodes pruning both application state and old block
data. Pruning state alone does not bound block storage: `min-retain-blocks = 0`
retains all blocks. Longer retention, including the validator guide's
600,000-block recommendation, needs a separate capacity assessment. Review the
[storage and pruning configurations](/operate/consensus-validators/consensus-node#storage-and-pruning-configurations)
before choosing a disk; changing retention can permanently delete history.

Provision [Fibre storage](/operate/consensus-validators/fibre) separately from
consensus data. The measurements above do not size the Fibre service.

### Archival consensus nodes

| Node type      | Memory    | CPU      | Disk       | Bandwidth |
| -------------- | --------- | -------- | ---------- | --------- |
| Consensus node | 64 GB RAM | 32 cores | 16 TB NVMe | 1 Gbps    |

The measured archival consensus store used approximately 10.0 TB with
`pruning = "nothing"` and `min-retain-blocks = 0`. Confirm that your store contains
the history your application needs. The additional capacity is growth headroom,
not a validated number of months of operation.

Validators must use hardware that passes the [CPU benchmark](https://github.com/celestiaorg/celestia-app/blob/main/tools/cpu_requirements/README.md). If your server does not pass, upgrade to a more powerful machine.

For a list of CPUs tested against the v6 128MB/6s workload, see the [release notes](https://github.com/celestiaorg/celestia-app/blob/main/docs/release-notes/release-notes.md#v6---128mb6s). Other CPUs are acceptable if they pass the benchmark. Recommended CPU specs:

- 32 or more cores
- GFNI (Galois Field New Instructions) support
- SHA-NI (SHA New Instructions) support

---