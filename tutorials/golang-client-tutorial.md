# Golang client library tutorial

This tutorial section will guide you through using the most common RPC endpoints with the golang client library.

Install [dependencies](/how-to-guides/environment.md) and
[celestia-node](/how-to-guides/celestia-node.md) if you have
not already.

## Project setup

To start, add celestia-node and go-square as dependencies to your project:

```bash
go get github.com/celestiaorg/celestia-node@v0.22.1
go get github.com/celestiaorg/go-square/v2@v2.2.0
```

Additionally, make sure to replace the following dependencies in your go.mod file

```bash
replace (
    github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v1.28.2-sdk-v0.46.16
    github.com/filecoin-project/dagstore => github.com/celestiaorg/dagstore v0.0.0-20230824094345-537c012aa403
    github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
    github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
    github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.51.0-tm-v0.34.35
    github.com/ipfs/boxo => github.com/celestiaorg/boxo v0.29.0-fork
)
```

To use the following methods, you will need the node URL and your auth token. To get your auth token, see this [guide](/tutorials/node-tutorial.md#auth-token). To run your node without an auth token, you can use the `--rpc.skip-auth` flag when starting your node. This allows you to pass an empty string as your auth token.

The default URL is `http://localhost:26658`. If you would like to use subscription methods, such as `SubscribeHeaders` below, you must use the `ws` protocol in place of `http`: `ws://localhost:26658`.

> **Important:** Remember to close the client connection when you're done using it to prevent resource leaks:
>
> ```go
> defer client.Close()
> ```

## Submitting and retrieving blobs

The [blob.Submit](https://node-rpc-docs.celestia.org/#blob.Submit) method takes a slice of blobs and a gas price, returning the height the blob was successfully posted at.

- The namespace can be generated with `share.NewV0Namespace`.
- The blobs can be generated with `blob.NewBlobV0`.
- You can use `blob.NewSubmitOptions()`, which has celestia-node automatically determine an appropriate gas price. To set your own gas price, use `blob.NewSubmitOptions().WithGasPrice(X)`. The available options are `WithGasPrice`, `WithGas`, `WithKeyName`, `WithSignerAddress`, and `WithFeeGranterAddress`.

The [blob.GetAll](https://node-rpc-docs.celestia.org/#blob.GetAll) method takes a height and slice of namespaces, returning the slice of blobs found in the given namespaces.

```go
import (
 "bytes"
 "context"
 "fmt"

    client "github.com/celestiaorg/celestia-node/api/rpc/client"
    "github.com/celestiaorg/celestia-node/blob"
    share "github.com/celestiaorg/go-square/v2/share"
)

// SubmitBlob submits a blob containing "Hello, World!" to the 0xDEADBEEF namespace. It uses the default signer on the running node.
func SubmitBlob(ctx context.Context, url string, token string) error {
    client, err := client.NewClient(ctx, url, token)
    if err != nil {
        return err
    }
    defer client.Close() // It is important to close the connection after use

    // let's post to 0xDEADBEEF namespace
    namespace, err := share.NewV0Namespace([]byte{0xDE, 0xAD, 0xBE, 0xEF})
    if err != nil {
        return err
    }

    // create a blob
    helloWorldBlob, err := blob.NewBlobV0(namespace, []byte("Hello, World!"))
    if err != nil {
        return err
    }

    // submit the blob to the network
    height, err := client.Blob.Submit(ctx, []*blob.Blob{helloWorldBlob}, nil)
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
    namespace, err := share.NewV0Namespace([]byte{0xDE, 0xAD, 0xBE, 0xEF})
    if err != nil {
        return err
    }

    // subscribe to new blobs using a <-chan *blob.BlobResponse channel
    blobChan, err := client.Blob.Subscribe(ctx, namespace)
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
    namespace, err := share.NewV0Namespace([]byte{0xDE, 0xAD, 0xBE, 0xEF})
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

You can fetch an [Extended Data Square (EDS)](https://celestiaorg.github.io/celestia-app/data_structures.html#erasure-coding) using the [share.GetEDS](https://node-rpc-docs.celestia.org/#share.GetEDS) method. This method takes a header and returns the EDS at the given height.

```go
// GetEDS fetches the EDS at the given height.
func GetEDS(ctx context.Context, url string, token string, height uint64) (*rsmt2d.ExtendedDataSquare, error) {
    client, err := client.NewClient(ctx, url, token)
    if err != nil {
        return nil, err
    }
    defer client.Close() // We close the connection after use

    // Fetch the EDS
    return client.Share.GetEDS(ctx, height)
}
```

## API documentation

To see the full list of available methods, see the [API documentation](https://node-rpc-docs.celestia.org/).

## Complete example

Here's a complete example that demonstrates connecting to a Celestia node, checking the network head, and submitting/retrieving a blob.

First, here's a minimal `go.mod` file:

```go
module celestia-test

go 1.23.6

toolchain go1.23.8

require (
 github.com/celestiaorg/celestia-node v0.22.1
 github.com/celestiaorg/go-square/v2 v2.2.0
)

replace (
 github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v1.28.2-sdk-v0.46.16
 github.com/filecoin-project/dagstore => github.com/celestiaorg/dagstore v0.0.0-20230824094345-537c012aa403
 github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
 github.com/ipfs/boxo => github.com/celestiaorg/boxo v0.29.0-fork
 github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
 github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.51.0-tm-v0.34.35
)
```

And here's the `main.go` file:

```go
package main

import (
 "bytes"
 "context"
 "fmt"
 "os"
 "time"

 client "github.com/celestiaorg/celestia-node/api/rpc/client"
 "github.com/celestiaorg/celestia-node/blob"
 "github.com/celestiaorg/celestia-node/state"
 share "github.com/celestiaorg/go-square/v2/share"
)

func main() {
 // Set up a context with timeout
 ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
 defer cancel()

 // Default RPC URL and token (empty string if using --rpc.skip-auth)
 url := "http://localhost:26658"
 token := "" // Replace with your auth token if not using --rpc.skip-auth

 // Check if we can connect to the node first
 fmt.Println("Testing connection to Celestia node...")
 c, err := client.NewClient(ctx, url, token)
 if err != nil {
  fmt.Printf("Failed to connect to node: %v\n", err)
  os.Exit(1)
 }
 defer c.Close()

 fmt.Println("Successfully connected to node, checking node status...")

 // Try a simpler API call first - get network head to verify connectivity
 headerHeight, err := GetNetworkHead(ctx, c)
 if err != nil {
  fmt.Printf("Failed to get network head: %v\n", err)
 } else {
  fmt.Printf("Current network height: %d\n", headerHeight)

  // Now try blob submission
  err = SubmitBlob(ctx, url, token)
  if err != nil {
   fmt.Printf("Blob submission error: %v\n", err)
  }
 }
}

// SubmitBlob submits a blob containing "Hello, World!" to the 0xDEADBEEF namespace
// and retrieves it from the network to verify the process works.
func SubmitBlob(ctx context.Context, url string, token string) error {
 // Create a new client
 c, err := client.NewClient(ctx, url, token)
 if err != nil {
  return fmt.Errorf("failed to create client: %w", err)
 }
 defer c.Close() // Important to close the connection after use

 fmt.Println("Connected to Celestia node")

 // Create the 0xDEADBEEF namespace
 namespace, err := share.NewV0Namespace([]byte{0xDE, 0xAD, 0xBE, 0xEF})
 if err != nil {
  return fmt.Errorf("failed to create namespace: %w", err)
 }

 // Create a blob with "Hello, World!" content
 message := []byte("Hello, World!")
 helloWorldBlob, err := blob.NewBlobV0(namespace, message)
 if err != nil {
  return fmt.Errorf("failed to create blob: %w", err)
 }

 fmt.Println("Submitting blob to the network...")

 // Create basic TxConfig instead of passing nil
 options := state.NewTxConfig()

 // Submit the blob to the network with the options
 height, err := c.Blob.Submit(ctx, []*blob.Blob{helloWorldBlob}, options)
 if err != nil {
  return fmt.Errorf("failed to submit blob: %w", err)
 }

 fmt.Printf("Success! Blob was included at height %d\n", height)

 // Wait a moment to ensure the blob is available for retrieval
 time.Sleep(2 * time.Second)

 fmt.Println("Retrieving blob from the network...")

 // Fetch the blob back from the network
 retrievedBlobs, err := c.Blob.GetAll(ctx, height, []share.Namespace{namespace})
 if err != nil {
  return fmt.Errorf("failed to retrieve blob: %w", err)
 }

 if len(retrievedBlobs) == 0 {
  return fmt.Errorf("no blobs retrieved from height %d", height)
 }

 // Verify the retrieved blob matches the submitted blob
 equal := bytes.Equal(helloWorldBlob.Commitment, retrievedBlobs[0].Commitment)
 fmt.Printf("Retrieved blob successfully! Blobs are equal? %v\n", equal)

 // Verify the content is what we expect
 fmt.Printf("Original message: %s\n", message)
 fmt.Printf("Retrieved message: %s\n", retrievedBlobs[0].Data)

 return nil
}

// GetNetworkHead retrieves the current network height
func GetNetworkHead(ctx context.Context, c *client.Client) (uint64, error) {
 // Get the network head
 header, err := c.Header.NetworkHead(ctx)
 if err != nil {
  return 0, fmt.Errorf("failed to get network head: %w", err)
 }

 return header.Height(), nil
}
```

This example demonstrates:

1. Connecting to a Celestia light node
2. Checking the current network height
3. Creating a namespace and blob
4. Submitting the blob to the network
5. Retrieving and verifying the blob

To run this example, save it as `main.go` in your project directory and run `go run main.go`. Make sure your Celestia node is running and accessible at the URL specified in the code.

Once you run the program, you'll see a result like this!

```
go run main.go
Testing connection to Celestia node...
Successfully connected to node, checking node status...
Current network height: 5867246
Connected to Celestia node
Submitting blob to the network...
Success! Blob was included at height 5867247
Retrieving blob from the network...
Retrieved blob successfully! Blobs are equal? true
Original message: Hello, World!
Retrieved message: %!s(func() []uint8=0x1023543d0)
```
