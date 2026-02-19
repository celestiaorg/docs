# Go client tutorial

The Celestia Go client lets you submit and retrieve data from the Celestia network without running your own node. This tutorial shows you how to get started with the basics.

## What you can do

- **Submit blobs**: Store data on Celestia's data availability layer
- **Retrieve blobs**: Get data back from the network
- **Check balance**: See your account's token balance
- **Read-only mode**: Just retrieve data without submitting

## Prerequisites

- Go 1.24 or later
- A Celestia account (created automatically)
- Testnet tokens from the [Mocha faucet](/operate/networks/mocha-testnet#mocha-testnet-faucet)

## Quick setup

## Running the tutorial

## Understanding the code

### Key components

- **Keyring**: Manages your Celestia account keys
- **Client**: Connects to Celestia nodes for read/write operations
- **Namespace**: Groups related data together (like a folder)
- **Blob**: The data structure you submit to the network
- **Commitment**: A hash that uniquely identifies your blob

### Connection types

| Purpose     | Node type      | Example URL              |
| ----------- | -------------- | ------------------------ |
| Read data   | Bridge node    | `http://localhost:26658` |
| Submit data | Consensus node | `localhost:26657`        |

### Read-only mode

To only retrieve data (no submission), remove the `SubmitConfig` from your client configuration:

```go
cfg := client.Config{
    ReadConfig: client.ReadConfig{
        BridgeDAAddr: daURL,
    },
    // No SubmitConfig for read-only
}
```

## Advanced features

### Submitting multiple blobs

You can submit multiple blobs in a single transaction. All blobs are included atomically at the same block height, which is useful for grouping related data together.

```go
func submitMultipleBlobs(ctx context.Context, c *client.Client) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Minute)
	defer cancel()

	// Create namespace
	ns, err := share.NewV0Namespace([]byte("tutorial"))
	if err != nil {
		return err
	}

	// Create multiple blobs (can use same namespace, or different namespaces)
	blob1, err := blob.NewBlob(share.ShareVersionZero, ns, []byte("First blob"), nil)
	if err != nil {
		return err
	}
	blob2, err := blob.NewBlob(share.ShareVersionZero, ns, []byte("Second blob"), nil)
	if err != nil {
		return err
	}
	blob3, err := blob.NewBlob(share.ShareVersionZero, ns, []byte("Third blob"), nil)
	if err != nil {
		return err
	}

	// Submit all blobs in a single transaction
	height, err := c.Blob.Submit(ctx, []*blob.Blob{blob1, blob2, blob3}, nil)
	if err != nil {
		return err
	}
	fmt.Printf("✓ All 3 blobs submitted at block %d\n", height)

	// Retrieve each blob using its unique commitment
	retrieved1, _ := c.Blob.Get(ctx, height, ns, blob1.Commitment)
	retrieved2, _ := c.Blob.Get(ctx, height, ns, blob2.Commitment)
	retrieved3, _ := c.Blob.Get(ctx, height, ns, blob3.Commitment)

	fmt.Printf("✓ Retrieved: %s, %s, %s\n",
		string(retrieved1.Data()),
		string(retrieved2.Data()),
		string(retrieved3.Data()))

	return nil
}
```

**Key points:**

- All blobs in the array are included in a single `PayForBlobs` transaction
- They all appear at the same block height
- Each blob can have a different namespace
- Retrieve blobs individually using their namespace and commitment

### Transaction submission modes

Celestia supports three transaction submission modes controlled by `TxWorkerAccounts` in your client configuration. This setting affects how transactions are queued and submitted, impacting throughput and ordering guarantees.

#### Default mode (TxWorkerAccounts = 0)

This is the default behavior (same as the basic tutorial). Transactions are submitted immediately without a queue:

```go
cfg := client.Config{
    ReadConfig: client.ReadConfig{
        BridgeDAAddr: daURL,
        EnableDATLS:  daTLS,
    },
    SubmitConfig: client.SubmitConfig{
        DefaultKeyName: "my_key",
        Network:        p2p.Network("mocha-4"),
        CoreGRPCConfig: client.CoreGRPCConfig{
            Addr:       coreGRPC,
            TLSEnabled: coreTLS,
        },
        // TxWorkerAccounts defaults to 0 (immediate submission)
    },
}
```

**Characteristics:**

- Transactions enter the mempool immediately
- No queuing or waiting for confirmations
- Potential sequence number conflicts if submitting multiple transactions quickly
- Same behavior as versions prior to v0.28.2

#### Queued mode (TxWorkerAccounts = 1)

Enable synchronous, ordered submission by setting `TxWorkerAccounts` to `1`:

```go
cfg.SubmitConfig.TxWorkerAccounts = 1
```

**Characteristics:**

- Each transaction queues until the previous one is confirmed
- Preserves strict ordering of transactions based on submission time
- Works with both sequential and concurrent submission patterns
- Avoids sequence mismatch errors
- Throughput: approximately 1 PayForBlobs transaction every other block

**Example:** Submitting 5 blobs in queued mode:

```go
import (
    "golang.org/x/sync/errgroup"
)

func submitBlobsQueued(ctx context.Context, c *client.Client) error {
    // Create 5 blobs
    blobs := make([]*blob.Blob, 5)
    namespaces := make([]share.Namespace, 5)
    commitments := make([][]byte, 5)

    for i := 0; i < 5; i++ {
        nsBytes := make([]byte, 10)
        copy(nsBytes, fmt.Sprintf("blob-%d", i))
        ns, _ := share.NewV0Namespace(nsBytes)
        namespaces[i] = ns
        blobs[i], _ = blob.NewBlob(share.ShareVersionZero, ns,
            []byte(fmt.Sprintf("Data %d", i)), nil)
        commitments[i] = blobs[i].Commitment
    }

    heights := make([]uint64, 5)
    var g errgroup.Group

    for i := 0; i < 5; i++ {
        idx := i
        g.Go(func() error {
            height, err := c.Blob.Submit(ctx, []*blob.Blob{blobs[idx]}, nil)
            if err != nil {
                return err
            }
            heights[idx] = height
            fmt.Printf("Blob %d submitted at height %d\n", idx+1, height)
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return err
    }

    // Retrieve and verify all blobs
    for i := 0; i < 5; i++ {
        retrieved, err := c.Blob.Get(ctx, heights[i], namespaces[i], commitments[i])
        if err != nil {
            return err
        }
        fmt.Printf("✓ Blob %d retrieved: %s\n", i+1, string(retrieved.Data()))
    }

    return nil
}
```

**Expected output:**

```
Blob 3 submitted at height 1234567  // First to call Submit()
Blob 1 submitted at height 1234568  // Second to call Submit()
Blob 5 submitted at height 1234569  // Third to call Submit()
Blob 2 submitted at height 1234570  // Fourth to call Submit()
Blob 4 submitted at height 1234571  // Fifth to call Submit()
✓ Blob 1 retrieved: Data 0
✓ Blob 2 retrieved: Data 1
✓ Blob 3 retrieved: Data 2
✓ Blob 4 retrieved: Data 3
✓ Blob 5 retrieved: Data 4
```

Note: With concurrent submission, blobs may print in any order, but their heights will always reflect their submission order (first submitted = lowest height).

#### Parallel mode (TxWorkerAccounts > 1)

For high-throughput applications that don't require sequential ordering, enable parallel submission:

```go
cfg.SubmitConfig.TxWorkerAccounts = 8  // Creates 8 parallel lanes
```

**How it works:**

- Creates `TxWorkerAccounts` parallel submission lanes
- Each lane is a subaccount automatically created and funded from your default account
- Example: `TxWorkerAccounts = 8` creates 7 subaccounts + 1 default account = 8 parallel lanes
- Enables at least 8 PayForBlobs transactions per block

**Important:** To actually utilize parallel lanes, you must submit blobs concurrently (using goroutines). Each `Blob.Submit()` call blocks until the transaction is confirmed, so sequential calls will still be processed sequentially even with `TxWorkerAccounts > 1`. Concurrent submission allows multiple transactions to be processed simultaneously across different parallel lanes.

**Example:** Submitting 8 blobs concurrently in parallel mode:

```go
import (
    "golang.org/x/sync/errgroup"
)

func submitBlobsParallel(ctx context.Context, c *client.Client) error {
    // Create 8 blobs
    blobs := make([]*blob.Blob, 8)
    namespaces := make([]share.Namespace, 8)
    commitments := make([][]byte, 8)

    for i := 0; i < 8; i++ {
        nsBytes := make([]byte, 10)
        copy(nsBytes, fmt.Sprintf("parallel-%d", i))
        ns, _ := share.NewV0Namespace(nsBytes)
        namespaces[i] = ns
        blobs[i], _ = blob.NewBlob(share.ShareVersionZero, ns,
            []byte(fmt.Sprintf("Parallel data %d", i)), nil)
        commitments[i] = blobs[i].Commitment
    }

    heights := make([]uint64, 8)
    var g errgroup.Group

    for i := 0; i < 8; i++ {
        idx := i
        g.Go(func() error {
            height, err := c.Blob.Submit(ctx, []*blob.Blob{blobs[idx]}, nil)
            if err != nil {
                return err
            }
            heights[idx] = height
            fmt.Printf("Blob %d submitted at height %d\n", idx+1, height)
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return err
    }

    // Retrieve and verify all blobs
    for i := 0; i < 8; i++ {
        retrieved, err := c.Blob.Get(ctx, heights[i], namespaces[i], commitments[i])
        if err != nil {
            return err
        }
        fmt.Printf("✓ Blob %d retrieved: %s\n", i+1, string(retrieved.Data()))
    }

    return nil
}
```

**Expected output (unordered):**

```
Blob 1 submitted at height 1234567
Blob 2 submitted at height 1234567  // Same block!
Blob 3 submitted at height 1234568
Blob 4 submitted at height 1234567  // Same block as 1 and 2!
Blob 5 submitted at height 1234568
Blob 6 submitted at height 1234568
Blob 7 submitted at height 1234569
Blob 8 submitted at height 1234568
✓ Blob 1 retrieved: Parallel data 0
✓ Blob 2 retrieved: Parallel data 1
✓ Blob 3 retrieved: Parallel data 2
✓ Blob 4 retrieved: Parallel data 3
✓ Blob 5 retrieved: Parallel data 4
✓ Blob 6 retrieved: Parallel data 5
✓ Blob 7 retrieved: Parallel data 6
✓ Blob 8 retrieved: Parallel data 7
```

**Important considerations:**

**Retrieving blobs from parallel submission:**

Since you don't know which subaccount submitted each blob, retrieve them using namespace, height, and commitment:

```go
// Store these when submitting
height, err := c.Blob.Submit(ctx, []*blob.Blob{myBlob}, nil)
commitment := myBlob.Commitment
namespace := myBlob.Namespace()

// Later, retrieve using stored values
retrieved, err := c.Blob.Get(ctx, height, namespace, commitment)
```

**Subaccount management:**

- Subaccounts are automatically created and funded from your default account
- They are named `parallel-worker-1`, `parallel-worker-2`, etc. in your keyring
- Subaccounts are reused across node restarts if `TxWorkerAccounts` value remains the same
- If you decrease `TxWorkerAccounts`, only the first N workers are used
- If you increase `TxWorkerAccounts`, additional workers are created

#### Comparison table

| Mode     | TxWorkerAccounts | Ordering       | Throughput       | Use case                                 |
| -------- | ---------------- | -------------- | ---------------- | ---------------------------------------- |
| Default  | 0                | Not guaranteed | Immediate        | Simple applications, single transactions |
| Queued   | 1                | Guaranteed     | ~1 tx per block  | Applications requiring strict ordering   |
| Parallel | >1               | Not guaranteed | ≥N txs per block | High-throughput, unordered workflows     |

## Next steps

- **Production**: Use `keyring.BackendFile` instead of `keyring.BackendTest`
- **Security**: Enable TLS with authentication tokens for production
- **Advanced**: Read the [full client documentation](https://github.com/celestiaorg/celestia-node/blob/main/api/client#readme)

## Troubleshooting

Common errors and solutions:

### Connection errors

**`failed to initialize [share|header|blob] client`**
- Check that your `CELE_DA_URL` is correct and accessible
- Verify the bridge node is running and reachable
- Ensure TLS settings match your node configuration

**`couldn't connect to core endpoint`**
- Verify your `CELE_CORE_GRPC` address is correct
- Check that the consensus node is running
- Ensure firewall rules allow the connection

### Configuration errors

**`default key name should not be empty`**
- Ensure `DefaultKeyName` is set in your `SubmitConfig`

**`keyring is nil`**
- Pass a valid keyring to `client.New()` (cannot be `nil`)

### Blob submission errors

**`blob: not found`**
- The blob doesn't exist at the specified height/namespace/commitment
- Verify the height, namespace, and commitment are correct

**`not allowed namespace ... were used to build the blob`**
- The namespace is reserved or invalid
- Use `share.NewV0Namespace()` with valid user namespaces

**`account for signer ... not found`**
- The account has not been funded yet
- Fund your account at the [Mocha faucet](/operate/networks/mocha-testnet#mocha-testnet-faucet)

**`failed to submit blobs due to insufficient gas price`**
- The estimated or configured gas price is too low
- Either increase `MaxGasPrice` in `TxConfig` or let the client estimate
- Check network congestion (gas prices may be elevated)

**`context deadline exceeded`**
- Network timeout occurred
- Increase the context timeout: `context.WithTimeout(ctx, 5*time.Minute)`
- Check network connectivity to the node