# Advanced

This page collects advanced topics for Celestia light nodes. For
setup and blob posting, see
[Getting started](/operate/data-availability/light-node/quickstart).

---

## Start light node with consensus endpoint authentication

If the consensus node gRPC endpoint you connect to requires authentication, pass
a directory containing `xtoken.json`:

```bash
celestia light start \
  --core.ip snowy-methodical-leaf.celestia-mainnet.quiknode.pro \
  --core.tls \
  --core.xtoken.path /path-to-directory \
  --core.port 9090
```

Where `/path-to-directory` contains `xtoken.json` (recommended: `chmod 600`):

```json
{
  "x-token": "<YOUR-SECRET-X-TOKEN>"
}
```

---

## Run the light node with a custom key

To use a non-default key, make sure the key exists in your node store and pass
`--keyring.keyname` on `start`:

---

## Run the light node with SystemD

Follow the tutorial for running Celestia Node as a background process with
SystemD:
[/operate/maintenance/systemd#celestia-light-node](/operate/maintenance/systemd#celestia-light-node).

---

## Fast sync with a trusted hash

Setting and syncing to a trusted height and hash means your light node will not
sample the entire chain from genesis. This is useful when you want to sync your
light node quickly.

Celestia also supports initializing from a trusted hash via
[trusted hash recovery](/operate/maintenance/trusted-hash-recovery).

---

## High throughput transaction submission

Celestia supports three transaction submission modes that affect how
transactions are queued and submitted, impacting throughput and ordering
guarantees. These modes are controlled by the `TxWorkerAccounts` setting in your
light node's `config.toml` file.

### Default mode (TxWorkerAccounts = 0)

This is the default behavior. Transactions are submitted immediately without a
queue.

**Characteristics:**

- Transactions enter the mempool immediately
- No queuing or waiting for confirmations
- Potential sequence number conflicts if submitting multiple transactions quickly
- Same behavior as versions prior to v0.28.2

### Queued mode (TxWorkerAccounts = 1)

Enable synchronous, ordered submission by setting `TxWorkerAccounts` to `1` in
your `config.toml`.

**Characteristics:**

- Each transaction queues until the previous one is confirmed
- Preserves strict ordering of transactions based on submission time
- Avoids sequence mismatch errors
- Throughput: approximately 1 PayForBlobs transaction every other block

**Use case:** Applications requiring strict transaction ordering

### Parallel mode (TxWorkerAccounts > 1)

For high-throughput applications that don't require sequential ordering, enable
parallel submission by setting `TxWorkerAccounts` to a value greater than 1.

**How it works:**

- Creates `TxWorkerAccounts` parallel submission lanes
- Each lane is a subaccount automatically created and funded from your default account
- Example: `TxWorkerAccounts = 8` creates 7 subaccounts + 1 default account = 8 parallel lanes
- Enables at least 8 PayForBlobs transactions per block

**Characteristics:**

- Transactions can be submitted concurrently across multiple lanes
- Does NOT guarantee transaction ordering
- Blobs may be included in blocks in a different order than submitted
- Higher throughput for applications that can handle unordered transactions

**Use case:** High-throughput, unordered workflows

**Subaccount management:**

- Subaccounts are automatically created and funded from your default account
- They are named `parallel-worker-1`, `parallel-worker-2`, etc. in your keyring
- Subaccounts are reused across node restarts if `TxWorkerAccounts` value remains the same
- If you decrease `TxWorkerAccounts`, only the first N workers are used
- If you increase `TxWorkerAccounts`, additional workers are created

### Comparison table

| Mode     | TxWorkerAccounts | Ordering       | Throughput       | Use case                                 |
| -------- | ---------------- | -------------- | ---------------- | ---------------------------------------- |
| Default  | 0                | Not guaranteed | Immediate        | Simple applications, single transactions |
| Queued   | 1                | Guaranteed     | ~1 tx per block  | Applications requiring strict ordering   |
| Parallel | >1               | Not guaranteed | ≥N txs per block | High-throughput, unordered workflows     |

---

## Node store contents

The node store is created during `celestia light init` and lives under
`~/.celestia-<node-type>-<network>`.

For example, a Mocha light node store at `~/.celestia-light-mocha-4` contains:

- `config.toml`: Node configuration settings
- `data/`: Database files
- `keys/`: Node identity and account keys

---

## Get your auth token

Your auth token is useful when you want to interact with your Celestia light
node from another machine or a client application. Generate an admin token with:

```bash
celestia light auth admin --p2p.network mocha
```

Each time you run this, you will receive a new token. It's not possible to
revoke tokens once they are issued.

Use `celestia light auth --help` to learn more about the available options.

---

## Find your node ID

Your node ID is your libp2p peer ID. You’ll need it when creating multiaddrs
(for example, `.../p2p/<node-ID>`).

While your node is running, run:

```bash
celestia p2p info
```

See also `p2p.Info` in the [celestia-node API docs](https://node-rpc-docs.celestia.org/#p2p.Info).

---

## Migrate node ID to another server

If you want the new machine to keep the same node identity, back up the
identity material from your node store (for example, the `keys/` directory under
`~/.celestia-light-<network>/`) and restore it on the new machine before
starting the node.

---

## Pruning windows

If you need data older than your current pruning windows, use
`SyncFromHeight`/`SyncFromHash` to re-sync from an earlier point in time.

- Sampling window: 7 days ([v0.25.3 release notes](https://github.com/celestiaorg/celestia-node/releases/tag/v0.25.3))
- Header pruning window: 14 days ([v0.26.4 release notes](https://github.com/celestiaorg/celestia-node/releases/tag/v0.26.4))

---

## Advanced key management with `cel-key`

For key management beyond the built-in capabilities of the light node, use the
separate `cel-key` utility. This dedicated tool allows you to create, import,
and manage keys, and to select which key your node uses.

See [Create a wallet with celestia-node](/operate/keys-wallets/celestia-node-key).