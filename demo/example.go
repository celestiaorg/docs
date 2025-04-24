// Example demonstrates how to use the Celestia Node API client.
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/celestiaorg/celestia-node/api/rpc/client"
)

// ExampleClient demonstrates how to use the Celestia Node API client.
func ExampleClient() {
	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Create a new client
	// Replace with your Celestia node URL and auth token
	url := "http://localhost:26658"
	token := "" // Empty token for local development

	celestiaClient, err := client.NewClient(ctx, url, token)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer celestiaClient.Close()

	// Get node info
	nodeInfo, err := celestiaClient.Node.Info(ctx)
	if err != nil {
		log.Fatalf("Failed to get node info: %v", err)
	}
	fmt.Printf("Node Info: %+v\n", nodeInfo)

	// Get header at height 1
	header, err := celestiaClient.Header.GetByHeight(ctx, 1)
	if err != nil {
		log.Fatalf("Failed to get header at height 1: %v", err)
	}
	fmt.Printf("Header at height 1: %+v\n", header)

	// Get latest header
	latestHeader, err := celestiaClient.Header.GetByHeight(ctx, 0)
	if err != nil {
		log.Fatalf("Failed to get latest header: %v", err)
	}
	fmt.Printf("Latest header: %+v\n", latestHeader)

	// Subscribe to new headers
	headerChan, err := celestiaClient.Header.Subscribe(ctx)
	if err != nil {
		log.Fatalf("Failed to subscribe to headers: %v", err)
	}

	// Listen for new headers
	for {
		select {
		case header := <-headerChan:
			fmt.Printf("New header at height %d\n", header.Height)
		case <-ctx.Done():
			fmt.Println("Context canceled, stopping header subscription")
			return
		}
	}
}

// ExampleBlob demonstrates how to use the Blob API.
func ExampleBlob() {
	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Create a new client
	// Replace with your Celestia node URL and auth token
	url := "http://localhost:26658"
	token := "" // Empty token for local development

	celestiaClient, err := client.NewClient(ctx, url, token)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer celestiaClient.Close()

	// Create a namespace (0xDEADBEEF)
	namespace := []byte{0xDE, 0xAD, 0xBE, 0xEF}

	// Create a blob with "Hello, World!" message
	blobData := []byte("Hello, World!")

	// Submit the blob
	height, err := celestiaClient.Blob.Submit(ctx, namespace, blobData)
	if err != nil {
		log.Fatalf("Failed to submit blob: %v", err)
	}
	fmt.Printf("Blob was included at height %d\n", height)

	// Wait a bit for the blob to be processed
	time.Sleep(2 * time.Second)

	// Retrieve the blob
	retrievedBlobs, err := celestiaClient.Blob.GetAll(ctx, height, []byte{namespace})
	if err != nil {
		log.Fatalf("Failed to retrieve blobs: %v", err)
	}

	if len(retrievedBlobs) == 0 {
		log.Fatalf("No blobs found at height %d", height)
	}

	fmt.Printf("Retrieved %d blobs at height %d\n", len(retrievedBlobs), height)
	fmt.Printf("Blob data: %s\n", string(retrievedBlobs[0]))
}

// ExampleShare demonstrates how to use the Share API.
func ExampleShare() {
	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Create a new client
	// Replace with your Celestia node URL and auth token
	url := "http://localhost:26658"
	token := "" // Empty token for local development

	celestiaClient, err := client.NewClient(ctx, url, token)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer celestiaClient.Close()

	// Get latest header
	header, err := celestiaClient.Header.GetByHeight(ctx, 0)
	if err != nil {
		log.Fatalf("Failed to get latest header: %v", err)
	}

	// Create a namespace (0xDEADBEEF)
	namespace := []byte{0xDE, 0xAD, 0xBE, 0xEF}

	// Get shares by namespace
	shares, err := celestiaClient.Share.GetSharesByNamespace(ctx, header, namespace)
	if err != nil {
		log.Fatalf("Failed to get shares by namespace: %v", err)
	}
	fmt.Printf("Found %d shares in namespace 0xDEADBEEF\n", len(shares))

	// Get EDS
	eds, err := celestiaClient.Share.GetEDS(ctx, header)
	if err != nil {
		log.Fatalf("Failed to get EDS: %v", err)
	}
	fmt.Printf("Got EDS with size %d\n", eds.Width())
} 