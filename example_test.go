// Package main provides compilation tests for the Golang client tutorial examples
// This file validates that the Go code snippets in golang-client-tutorial.md compile correctly
package main

import (
	"bytes"
	"context"
	"fmt"
	"time"

	client "github.com/celestiaorg/celestia-node/api/rpc/client"
	"github.com/celestiaorg/celestia-node/blob"
	"github.com/celestiaorg/celestia-node/state"
	share "github.com/celestiaorg/go-square/v2/share"
	"github.com/celestiaorg/rsmt2d"
)

// Test compilation guard: If this file does not compile, the CI/CD build will fail
// This ensures that all Go code examples in the tutorial are syntactically correct

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

	// create a blob with authorship information
	helloWorldBlob, err := blob.NewBlobV1(namespace, []byte("Hello, World!"), []byte("example-author"))
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

// SubscribeBlobs subscribes to new blobs in a namespace
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

// SubmitBlobComplete submits a blob containing "Hello, World!" to the 0xDEADBEEF namespace
// and retrieves it from the network to verify the process works.
func SubmitBlobComplete(ctx context.Context, url string, token string) error {
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

	// Create a blob with "Hello, World!" content and authorship information
	message := []byte("Hello, World!")
	helloWorldBlob, err := blob.NewBlobV1(namespace, message, []byte("example-author"))
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

// main function for compilation test - not intended to be run
func main() {
	// This main function is only for compilation testing
	// It demonstrates that all the tutorial functions compile correctly
	fmt.Println("✅ Compilation test passed - all tutorial functions are syntactically correct")
	fmt.Println("✅ The fixed API calls (share.NewV0Namespace) compile successfully")
}
