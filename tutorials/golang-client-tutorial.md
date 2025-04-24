# Golang client library tutorial {#golang-client-library}

This tutorial section will guide you through using the most common RPC endpoints with the golang client library.

Install [dependencies](/how-to-guides/environment.md) and
[celestia-node](/how-to-guides/celestia-node.md) if you have
not already.

## Project setup

**Note:** The previously documented `celestia-openrpc` library is deprecated. The recommended approach is to use the RPC client from [`celestia-node/api/rpc/client`](https://github.com/celestiaorg/celestia-node/blob/main/api/rpc/client/client.go) until the new Celestia client SDK is released.

You have two options for interacting with Celestia in Go:
1. Using the official client libraries (covered in the first part of this tutorial)
2. Using direct HTTP JSON-RPC calls (covered in the second part)

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

---

## Using direct HTTP JSON-RPC calls

If you prefer not to use the official client libraries or want more control over the network calls, you can interact with Celestia nodes directly using HTTP JSON-RPC. This section provides a complete example of submitting and retrieving blobs using standard Go libraries.

### Project setup for direct HTTP JSON-RPC

Create a new Go module:

```bash
mkdir celestia-direct-client
cd celestia-direct-client
go mod init celestia-direct-client
```

Create a file named `main.go` with the following content:

```go
package main

import (
	"bytes"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

const (
	NodeURL = "http://localhost:26658"
	AuthToken = "" // Set your auth token if needed
)

// Namespace represents a Celestia namespace
type Namespace struct {
	Version uint8  `json:"version"`
	ID      string `json:"id"`
}

// Blob represents a Celestia blob
type Blob struct {
	Namespace    string `json:"namespace"`    // base64 encoded
	Data         string `json:"data"`         // base64 encoded
	ShareVersion uint8  `json:"share_version"`
	Commitment   string `json:"commitment"`   // base64 encoded
	Index        int    `json:"index"`
}

// SubmitBlobRequest is the request for submitting blobs
type SubmitBlobRequest struct {
	NamespaceID string `json:"namespace_id"`
	Data        string `json:"data"`
	GasLimit    int64  `json:"gas_limit,omitempty"`
	Fee         int64  `json:"fee,omitempty"`
}

// SubmitBlobResponse is the response from submitting blobs
type SubmitBlobResponse struct {
	Height int64 `json:"height"`
}

// GetBlobsResponse is the response from getting blobs
type GetBlobsResponse struct {
	Blobs []Blob `json:"blobs"`
}

func main() {
	// Create a namespace ID (0xDEADBEEF)
	namespaceID := "deadbeef"
	
	// Create blob data
	data := "Hello, Celestia!"
	
	// Submit the blob
	height, err := submitBlob(namespaceID, data)
	if err != nil {
		log.Fatalf("Failed to submit blob: %v", err)
	}
	fmt.Printf("Blob submitted at height: %d\n", height)
	
	// Retrieve the blob
	blobs, err := getBlobs(height, namespaceID)
	if err != nil {
		log.Fatalf("Failed to get blobs: %v", err)
	}
	
	if len(blobs) > 0 {
		// Decode the base64 data
		decodedData, err := base64.StdEncoding.DecodeString(blobs[0].Data)
		if err != nil {
			log.Fatalf("Failed to decode blob data: %v", err)
		}
		
		fmt.Printf("Retrieved blob: %s\n", string(decodedData))
	} else {
		fmt.Println("No blobs found")
	}
}

// submitBlob submits a blob to the Celestia network
func submitBlob(namespaceID, data string) (int64, error) {
	// Convert namespace ID from hex to bytes
	namespaceBytes, err := hex.DecodeString(namespaceID)
	if err != nil {
		return 0, fmt.Errorf("failed to decode namespace ID: %w", err)
	}
	
	// For namespace version 0, the format is:
	// - First byte: version (0)
	// - Next 10 bytes: 0 (reserved)
	// - Next 18 bytes: namespace ID with leading zeros if needed
	paddedNamespace := make([]byte, 29)
	paddedNamespace[0] = 0 // Version 0
	
	// The ID must start with 18 leading zeros and then our namespace ID
	// Copy our namespace bytes to the end of the namespace field
	copy(paddedNamespace[29-len(namespaceBytes):], namespaceBytes)
	
	// Prepare the request body
	reqBody := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "blob.Submit",
		"params": []interface{}{
			[]map[string]interface{}{
				{
					"namespace": base64.StdEncoding.EncodeToString(paddedNamespace),
					"data":      base64.StdEncoding.EncodeToString([]byte(data)),
					"share_version": 0,
				},
			},
			map[string]interface{}{}, // Empty options
		},
	}
	
	// Convert to JSON
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return 0, fmt.Errorf("failed to marshal request: %w", err)
	}
	
	// Create the HTTP request
	req, err := http.NewRequest("POST", NodeURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return 0, fmt.Errorf("failed to create request: %w", err)
	}
	
	// Set headers
	req.Header.Set("Content-Type", "application/json")
	if AuthToken != "" {
		req.Header.Set("Authorization", "Bearer "+AuthToken)
	}
	
	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	// Read the response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, fmt.Errorf("failed to read response: %w", err)
	}
	
	// Check for errors
	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("request failed with status %d: %s", resp.StatusCode, string(respBody))
	}
	
	// Parse the response
	var result struct {
		Result int64 `json:"result"`
	}
	
	if err := json.Unmarshal(respBody, &result); err != nil {
		return 0, fmt.Errorf("failed to parse response: %w, body: %s", err, string(respBody))
	}
	
	return result.Result, nil
}

// getBlobs retrieves blobs from the Celestia network
func getBlobs(height int64, namespaceID string) ([]Blob, error) {
	// Convert namespace ID from hex to bytes
	namespaceBytes, err := hex.DecodeString(namespaceID)
	if err != nil {
		return nil, fmt.Errorf("failed to decode namespace ID: %w", err)
	}
	
	// For namespace version 0, the format is:
	// - First byte: version (0)
	// - Next 10 bytes: 0 (reserved)
	// - Next 18 bytes: namespace ID with leading zeros if needed
	paddedNamespace := make([]byte, 29)
	paddedNamespace[0] = 0 // Version 0
	
	// The ID must start with 18 leading zeros and then our namespace ID
	// Copy our namespace bytes to the end of the namespace field
	copy(paddedNamespace[29-len(namespaceBytes):], namespaceBytes)
	
	// Prepare the request body
	reqBody := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "blob.GetAll",
		"params": []interface{}{
			height,
			[]string{base64.StdEncoding.EncodeToString(paddedNamespace)},
		},
	}
	
	// Convert to JSON
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}
	
	// Create the HTTP request
	req, err := http.NewRequest("POST", NodeURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	
	// Set headers
	req.Header.Set("Content-Type", "application/json")
	if AuthToken != "" {
		req.Header.Set("Authorization", "Bearer "+AuthToken)
	}
	
	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	// Read the response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}
	
	// Check for errors
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status %d: %s", resp.StatusCode, string(respBody))
	}
	
	// Parse the response
	var result struct {
		Result []Blob `json:"result"`
	}
	
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w, body: %s", err, string(respBody))
	}
	
	return result.Result, nil
}
```

### Running the direct HTTP client

Build and run your application:

```bash
go mod tidy
go run main.go
```

### How it works

The code above does the following:

1. **Namespace formatting**: Creates a namespace ID in the proper format
   - Version 0 in the first byte
   - 10 reserved bytes
   - 18 bytes for the namespace ID (with leading zeros as needed)

2. **Submitting a blob**:
   - Encodes the namespace and data in base64
   - Creates a JSON-RPC request to the `blob.Submit` method
   - Sends an HTTP POST request to the node
   - Parses the response to get the height

3. **Retrieving blobs**:
   - Creates a JSON-RPC request to the `blob.GetAll` method
   - Specifies the height and namespace
   - Parses the response to get the blobs
   - Decodes the blob data from base64

### Advantages of direct HTTP calls

- Minimal dependencies (only uses the standard library)
- Full control over the network requests
- Easy to understand the underlying protocol
- Can be adapted for other languages that support HTTP requests

### Considerations

- No built-in retries or error handling
- Need to manually format namespaces according to specification
- Need to handle authentication manually
- Need to stay up-to-date with API changes

If you need more robust functionality, consider using the official client libraries as shown in the first part of this tutorial.

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
