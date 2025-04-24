# Golang client library tutorial {#golang-client-library}

This tutorial section will guide you through using the most common RPC endpoints with the golang client library.

Install [dependencies](/how-to-guides/environment.md) and
[celestia-node](/how-to-guides/celestia-node.md) if you have
not already.

## Project setup

**Note:** The previously documented `celestia-openrpc` library is deprecated. The recommended approach is to use the RPC client from [`celestia-node/api/rpc/client`](https://github.com/celestiaorg/celestia-node/blob/main/api/rpc/client/client.go) until the new Celestia client SDK is released.

---

## Project setup

First, add the following dependencies to your Go project:

```bash
go get github.com/celestiaorg/celestia-node/api/rpc/client
go get github.com/celestiaorg/celestia-node/nodebuilder/blob
go get github.com/celestiaorg/celestia-node/nodebuilder/share
```

You will also need your node URL and an auth token. See the [auth token guide](/tutorials/node-tutorial.md#auth-token).  
To run your node without an auth token, use the `--rpc.skip-auth` flag.

The default URL is `http://localhost:26658`.

## Submitting and retrieving blobs

Here is how to submit and retrieve blobs using the RPC client from celestia-node:

### Submitting a blob

```go
import (
    "context"
    "fmt"
    "github.com/celestiaorg/celestia-node/api/rpc/client"
    "github.com/celestiaorg/celestia-node/nodebuilder/share"
    "github.com/celestiaorg/celestia-node/nodebuilder/blob"
)

func SubmitBlob(ctx context.Context, url, token string) error {
    // Create the RPC client
    c, err := client.NewClient(ctx, url, token)
    if err != nil {
        return fmt.Errorf("failed to create RPC client: %w", err)
    }
    defer c.Close()

    // Create a namespace (e.g., 0xDEADBEEF)
    namespace, err := share.NewBlobNamespaceV0([]byte{0xDE, 0xAD, 0xBE, 0xEF})
    if err != nil {
        return fmt.Errorf("failed to create namespace: %w", err)
    }

    // Create a blob
    b, err := blob.NewBlobV0(namespace, []byte("Hello, World!"))
    if err != nil {
        return fmt.Errorf("failed to create blob: %w", err)
    }

    // Submit the blob using the Blob API
    height, err := c.Blob.Submit(ctx, []*blob.Blob{b}, nil)
    if err != nil {
        return fmt.Errorf("failed to submit blob: %w", err)
    }

    fmt.Printf("Blob submitted at height: %d\n", height)
    return nil
}
```

### Retrieving blobs

```go
func GetBlobs(ctx context.Context, url, token string, height uint64, namespace *share.Namespace) ([]*blob.Blob, error) {
    c, err := client.NewClient(ctx, url, token)
    if err != nil {
        return nil, fmt.Errorf("failed to create RPC client: %w", err)
    }
    defer c.Close()

	blobs, err := c.Blob.GetAll(ctx, height, []*share.Namespace{namespace})
	if err != nil {
		return nil, fmt.Errorf("failed to get blobs: %w", err)
	}
	return blobs, nil
}
```

---

## Notes

- This approach directly uses the RPC client from `celestia-node` and may introduce additional dependencies.
- This is a temporary solution until the new Celestia client SDK is released.
- For more advanced usage (e.g., custom gas, key management), refer to the [celestia-node/blob API](https://github.com/celestiaorg/celestia-node/blob/main/nodebuilder/blob/api.go).

    helloWorldBlob, err := blob.NewBlobV0(namespace, []byte("Hello, World!"))
    if err != nil {
        return err
    }

    // submit the blob to the network
    height, err := client.Blob.Submit(ctx, []*blob.Blob{helloWorldBlob}, blob.NewSubmitOptions())
    if err != nil {
        return err
    }

    fmt.Printf("Blob was included at height %d\n", height)

    // fetch the blob back from the network
    retrievedBlobs, err := client.Blob.GetAll(ctx, height, []share.Namespace{namespace})
    if err != nil {
        return err
    }

    fmt.Printf("Blobs are equal? %v\n", bytes.Equal(helloWorldBlob.Commitment, retrievedBlobs[0].Commitment))
    return nil
}
```

## Subscribing to new blobs

You can subscribe to new blobs in a namespace using the [blob.Subscribe](https://node-rpc-docs.celestia.org/#blob.Subscribe) method. This method returns a channel that will receive new blobs as they are produced. In this example, we will fetch all blobs in the `0xDEADBEEF` namespace.

```go
func SubscribeBlobs(ctx context.Context, url string, token string) error {
    client, err := client.NewClient(ctx, url, token)
    if err != nil {
        return err
    }
    defer client.Close() // We close the WebSocket connection after use

    // create a namespace to filter blobs with
    namespace, err := share.NewBlobNamespaceV0([]byte{0xDE, 0xAD, 0xBE, 0xEF})
    if err != nil {
        return err
    }

    // subscribe to new blobs using a <-chan *blob.BlobResponse channel
    blobChan, err := client.Blob.Subscribe(ctx)
    if err != nil {
        return err
    }

    for {
        select {
        case resp := <-blobChan:
            fmt.Printf("Found %d blobs at height %d in 0xDEADBEEF namespace\n", len(resp.Blobs()), resp.Height)
        case <-ctx.Done():
            return nil
        }
    }
}
```

## Subscribing to new headers

Alternatively, you can subscribe to new headers using the [header.Subscribe](https://node-rpc-docs.celestia.org/#header.Subscribe) method. This method returns a channel that will receive new headers as they are produced. In this example, we will fetch all blobs at the height of the new header in the `0xDEADBEEF` namespace.

```go
// SubscribeHeaders subscribes to new headers and fetches all blobs at the height of the new header in the 0xDEADBEEF namespace.
func SubscribeHeaders(ctx context.Context, url string, token string) error {
    client, err := client.NewClient(ctx, url, token)
    if err != nil {
        return err
    }
    defer client.Close() // We close the WebSocket connection after usage

    // create a namespace to filter blobs with
    namespace, err := share.NewBlobNamespaceV0([]byte{0xDE, 0xAD, 0xBE, 0xEF})
    if err != nil {
        return err
    }

    // subscribe to new headers using a <-chan *header.ExtendedHeader channel
    headerChan, err := client.Header.Subscribe(ctx)
    if err != nil {
        return err
    }

    for {
        select {
        case header := <-headerChan:
            // fetch all blobs at the height of the new header
            blobs, err := client.Blob.GetAll(context.TODO(), header.Height(), []share.Namespace{namespace})
            if err != nil {
                fmt.Printf("Error fetching blobs: %v\n", err)
            }

            fmt.Printf("Found %d blobs at height %d in 0xDEADBEEF namespace\n", len(blobs), header.Height())
        case <-ctx.Done():
            return nil
        }
    }
}
```

## Fetching an Extended Data Square (EDS)

You can fetch an [Extended Data Square (EDS)](https://celestiaorg.github.io/celestia-app/specs/data_structures.html#erasure-coding) using the [share.GetEDS](https://node-rpc-docs.celestia.org/#share.GetEDS) method. This method takes a header and returns the EDS at the given height.

```go
// GetEDS fetches the EDS at the given height.
func GetEDS(ctx context.Context, url string, token string, height uint64) (*rsmt2d.ExtendedDataSquare, error) {
    client, err := client.NewClient(ctx, url, token)
    if err != nil {
        return nil, err
    }
    defer client.Close() // We close the connection after use

    // First get the header of the block you want to fetch the EDS from
    header, err := client.Header.GetByHeight(ctx, height)
    if err != nil {
        return nil, err
    }

    // Fetch the EDS
    return client.Share.GetEDS(ctx, header)
}
```

## API documentation

To see the full list of available methods, see the [API documentation](https://node-rpc-docs.celestia.org/).
