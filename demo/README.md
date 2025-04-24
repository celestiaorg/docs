# Celestia Node Client Demo

This demo showcases how to use the Celestia Node API to interact with a Celestia node. It demonstrates the following functionality:

1. Connecting to a Celestia node
2. Getting node information
3. Getting headers at specific heights
4. Subscribing to new headers

## Prerequisites

- Go 1.23.6 or later
- A running Celestia node (local or remote)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   go mod tidy
   ```

## Running the Demo

To run the demo, make sure you have a Celestia node running. By default, the demo connects to `http://localhost:26658`. If your node is running at a different URL, you can modify the `url` variable in `main.go`.

```bash
go run main.go
```

## Understanding the Client API

The Celestia Node API is defined in the `client.go` file in the `github.com/celestiaorg/celestia-node/api/rpc/client` package. The main components are:

### Client Structure

```go
type Client struct {
    Fraud      fraud.API
    Header     header.API
    State      state.API
    Share      share.API
    DAS        das.API
    P2P        p2p.API
    Node       node.API
    Blob       blob.API
    DA         da.API
    Blobstream blobstream.API
}
```

### Creating a Client

```go
client, err := client.NewClient(ctx, url, token)
if err != nil {
    return fmt.Errorf("failed to create client: %w", err)
}
defer client.Close()
```

### Using the Client

The client provides access to various APIs:

- **Node API**: Get information about the node
  ```go
  nodeInfo, err := client.Node.Info(ctx)
  ```

- **Header API**: Get and subscribe to headers
  ```go
  // Get header at a specific height
  header, err := client.Header.GetByHeight(ctx, height)
  
  // Subscribe to new headers
  headerChan, err := client.Header.Subscribe(ctx)
  ```

- **Blob API**: Submit and retrieve blobs
  ```go
  // Submit a blob
  height, err := client.Blob.Submit(ctx, namespace, data)
  
  // Retrieve blobs
  blobs, err := client.Blob.GetAll(ctx, height, namespaces)
  ```

- **Share API**: Get shares and Extended Data Squares (EDS)
  ```go
  // Get shares
  shares, err := client.Share.GetSharesByNamespace(ctx, header, namespace)
  
  // Get EDS
  eds, err := client.Share.GetEDS(ctx, header)
  ```

## Notes

- The demo uses timeouts to automatically stop after 10 seconds for the subscription functions.
- The demo handles interrupts (Ctrl+C) gracefully.
- By default, the demo uses an empty auth token. If your node requires authentication, you can modify the `token` variable in `main.go`. 