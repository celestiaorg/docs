package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/celestiaorg/celestia-node/api/rpc/client"
)

func main() {
	// Default URL and token
	url := "http://localhost:26658"
	token := "" // Empty token for local development

	// Create a context that will be canceled on SIGINT or SIGTERM
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle interrupts
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigChan
		cancel()
	}()

	// Run the demo
	if err := runDemo(ctx, url, token); err != nil {
		log.Fatalf("Demo failed: %v", err)
	}
}

func runDemo(ctx context.Context, url, token string) error {
	fmt.Println("=== Celestia Node Client Demo ===")
	fmt.Printf("Connecting to %s\n", url)

	// Create a new client
	celestiaClient, err := client.NewClient(ctx, url, token)
	if err != nil {
		return fmt.Errorf("failed to create client: %w", err)
	}
	defer celestiaClient.Close()

	fmt.Println("Successfully connected to Celestia node")

	// Get node info
	nodeInfo, err := celestiaClient.Node.Info(ctx)
	if err != nil {
		return fmt.Errorf("failed to get node info: %w", err)
	}

	fmt.Printf("Node Info: %+v\n", nodeInfo)

	// Get header at height 1
	header, err := celestiaClient.Header.GetByHeight(ctx, 1)
	if err != nil {
		return fmt.Errorf("failed to get header at height 1: %w", err)
	}

	fmt.Printf("Header at height 1: %+v\n", header)

	// Get latest header
	latestHeader, err := celestiaClient.Header.GetByHeight(ctx, 0)
	if err != nil {
		return fmt.Errorf("failed to get latest header: %w", err)
	}

	fmt.Printf("Latest header: %+v\n", latestHeader)

	// Subscribe to new headers
	fmt.Println("Subscribing to new headers...")
	headerChan, err := celestiaClient.Header.Subscribe(ctx)
	if err != nil {
		return fmt.Errorf("failed to subscribe to headers: %w", err)
	}

	// Create a timeout context for this function
	timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	// Listen for new headers
	for {
		select {
		case header := <-headerChan:
			fmt.Printf("New header at height %d\n", header.Height)
		case <-timeoutCtx.Done():
			fmt.Println("Timeout reached, stopping header subscription")
			return nil
		}
	}
} 