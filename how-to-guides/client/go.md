# Celestia Go transaction client tutorial

The Celestia Go client lets you submit and retrieve data from the Celestia network without running your own node. This tutorial shows you how to get started with the basics.

## What you can do

- **Submit blobs**: Store data on Celestia's data availability layer
- **Retrieve blobs**: Get data back from the network
- **Check balance**: See your account's token balance
- **Read-only mode**: Just retrieve data without submitting

## Prerequisites

- Go 1.24 or later
- A Celestia account (created automatically)
- Testnet tokens from the [Mocha faucet](https://docs.celestia.org/how-to-guides/mocha-testnet#mocha-testnet-faucet)

## Quick setup

### 1. Create your project

```bash
mkdir celestia-client-example
cd celestia-client-example
go mod init celestia-client-example
```

### 2. Create main.go

```go
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/celestiaorg/celestia-node/api/client"
	"github.com/celestiaorg/celestia-node/blob"
	"github.com/celestiaorg/celestia-node/nodebuilder/p2p"
	"github.com/celestiaorg/go-square/v3/share"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
)

func main() {
	ctx := context.Background()

	// Get connection details from environment
	daURL := os.Getenv("CELE_DA_URL")
	coreGRPC := os.Getenv("CELE_CORE_GRPC")
	daTLS := os.Getenv("CELE_DA_TLS") == "true"
	daToken := os.Getenv("CELE_DA_TOKEN")
	coreTLS := os.Getenv("CELE_CORE_TLS") == "true"
	coreToken := os.Getenv("CELE_CORE_TOKEN")
	
	if daURL == "" {
		fmt.Println("Error: Set CELE_DA_URL environment variable")
		fmt.Println("Example: export CELE_DA_URL=http://localhost:26658")
		return
	}

	// Create a new account
	fmt.Println("Creating account...")
	kr, err := client.KeyringWithNewKey(client.KeyringConfig{
		KeyName:     "my_key",
		BackendName: keyring.BackendTest,
	}, "./keys")
	if err != nil {
		panic(err)
	}

	// Show your address
	keyInfo, err := kr.Key("my_key")
	if err != nil {
		panic(err)
	}
	address, err := keyInfo.GetAddress()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Your address: %s\n", address.String())

	// Connect to Celestia (read-only or full client)
	cfg := client.Config{
		ReadConfig: client.ReadConfig{
			BridgeDAAddr: daURL,
			EnableDATLS:  daTLS,
		},
		SubmitConfig: client.SubmitConfig{
			DefaultKeyName: "my_key",
		},
	}

	// Add DA auth token if provided
	if daToken != "" {
		cfg.ReadConfig.DAAuthToken = daToken
	}

	// Add Core gRPC config if provided
	if coreGRPC != "" {
		network := p2p.Network("mocha-4")
		cfg.SubmitConfig.Network = network
		cfg.SubmitConfig.CoreGRPCConfig = client.CoreGRPCConfig{
			Addr:       coreGRPC,
			TLSEnabled: coreTLS,
		}
		if coreToken != "" {
			cfg.SubmitConfig.CoreGRPCConfig.AuthToken = coreToken
		}
		fmt.Println("Full client mode (can submit blobs)")
	} else {
		fmt.Println("Read-only mode (cannot submit blobs)")
		fmt.Println("To submit blobs, set CELE_CORE_GRPC environment variable")
	}

	fmt.Println("Connecting to Celestia...")
	c, err := client.New(ctx, cfg, kr)
	if err != nil {
		panic(err)
	}
	defer c.Close()

	// Check your balance
	balance, err := c.State.Balance(ctx)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Balance: %s\n", balance.String())

	// Submit a blob only if in full mode
	if coreGRPC != "" {
		// Check if account has funds before trying to submit
		balanceStr := balance.String()
		if balanceStr == "0utia" || balanceStr == "0 utia" {
			fmt.Println("Account has no funds. Fund this address at the Mocha faucet to submit blobs:")
			fmt.Printf("Address: %s\n", address.String())
			fmt.Println("Faucet: https://docs.celestia.org/how-to-guides/mocha-testnet#mocha-testnet-faucet")
		} else {
			if err := submitAndRetrieveBlob(ctx, c); err != nil {
				panic(err)
			}
		}
	}

	fmt.Println("✓ Tutorial complete!")
}

func submitAndRetrieveBlob(ctx context.Context, c *client.Client) error {
	// Set timeout for network operations
	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	// Create namespace (groups your data)
	ns, err := share.NewV0Namespace([]byte("tutorial"))
	if err != nil {
		return err
	}

	// Create blob with your data
	message := "Hello Celestia!"
	blobData := []byte(message)
	b, err := blob.NewBlob(share.ShareVersionZero, ns, blobData, nil)
	if err != nil {
		return err
	}

	// Submit to network
	fmt.Println("Submitting blob...")
	height, err := c.Blob.Submit(ctx, []*blob.Blob{b}, nil)
	if err != nil {
		return err
	}
	fmt.Printf("✓ Blob submitted at block %d\n", height)

	// Retrieve it back
	fmt.Println("Retrieving blob...")
	retrieved, err := c.Blob.Get(ctx, height, ns, b.Commitment)
	if err != nil {
		return err
	}

	// Verify the data
	retrievedData := string(retrieved.Data())
	fmt.Printf("✓ Retrieved: %s\n", retrievedData)
	
	if retrievedData != message {
		return fmt.Errorf("data mismatch!")
	}
	
	fmt.Println("✓ Data verified!")
	return nil
}
```

### 4. Set up your go.mod

Create `go.mod` with these dependencies:

```go
module celestia-client-example

go 1.24.6

require (
	github.com/celestiaorg/celestia-node v0.28.2-mocha
	github.com/celestiaorg/go-square/v3 v3.0.2
	github.com/cosmos/cosmos-sdk v0.50.13
)

replace (
	cosmossdk.io/x/upgrade => github.com/celestiaorg/cosmos-sdk/x/upgrade v0.2.0
	github.com/cometbft/cometbft => github.com/celestiaorg/celestia-core v0.39.10
	github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v0.51.4
	github.com/cosmos/ibc-go/v8 => github.com/celestiaorg/ibc-go/v8 v8.7.2
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	// broken goleveldb needs to be replaced for the cosmos-sdk and celestia-app
	github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
	// celestia-core(v0.34.x): used for multiplexing abci v1 requests
	github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.55.0-tm-v0.34.35
)

replace github.com/ipfs/boxo => github.com/celestiaorg/boxo v0.29.0-fork-4

replace github.com/ipfs/go-datastore => github.com/celestiaorg/go-datastore v0.0.0-20250801131506-48a63ae531e4
```

Then run:

```bash
go mod tidy
```

## Running the tutorial

### 1. Set environment variables

Choose your connection type:

**QuickNode (recommended for beginners):**
```bash
export CELE_DA_URL=https://your-quicknode-url.celestia-mocha.quiknode.pro/<your-token>
export CELE_DA_TLS=true
export CELE_CORE_GRPC=your-quicknode-url:9090
export CELE_CORE_TLS=true
export CELE_CORE_TOKEN=<your-token>
```

**Local bridge node:**
```bash
export CELE_DA_URL=http://localhost:26658
export CELE_DA_TLS=false
export CELE_CORE_GRPC=localhost:26657
export CELE_CORE_TLS=false
```

**Read-only mode (no blob submission):**
```bash
export CELE_DA_URL=http://localhost:26658
export CELE_DA_TLS=false
# Don't set CELE_CORE_GRPC for read-only mode
```

### 2. Run the program

```bash
go run main.go
```

**First run:** You'll see your account address. Fund it at the [Mocha faucet](https://docs.celestia.org/how-to-guides/mocha-testnet#mocha-testnet-faucet).

**Second run:** After funding, you'll see:
```
Creating account...
Your address: celestia16k0wsej6rewd2pfh0taah35suzf3apj552q8c3
Full client mode (can submit blobs)
Connecting to Celestia...
Balance: 1000000utia
Submitting blob...
✓ Blob submitted at block 1234567
Retrieving blob...
✓ Retrieved: Hello Celestia!
✓ Data verified!
✓ Tutorial complete!
```

**First run (unfunded account):**
```
Creating account...
Your address: celestia16k0wsej6rewd2pfh0taah35suzf3apj552q8c3
Full client mode (can submit blobs)
Connecting to Celestia...
Balance: 0utia
Account has no funds. Fund this address at the Mocha faucet to submit blobs:
Address: celestia16k0wsej6rewd2pfh0taah35suzf3apj552q8c3
Faucet: https://docs.celestia.org/how-to-guides/mocha-testnet#mocha-testnet-faucet
✓ Tutorial complete!
```

**Read-only mode output:**
```
Creating account...
Your address: celestia16k0wsej6rewd2pfh0taah35suzf3apj552q8c3
Read-only mode (cannot submit blobs)
To submit blobs, set CELE_CORE_GRPC environment variable
Connecting to Celestia...
Balance: 1000000utia
✓ Tutorial complete!
```

## Understanding the code

### Key components

- **Keyring**: Manages your Celestia account keys
- **Client**: Connects to Celestia nodes for read/write operations
- **Namespace**: Groups related data together (like a folder)
- **Blob**: The data structure you submit to the network
- **Commitment**: A hash that uniquely identifies your blob

### Connection types

| Purpose | Node type | Example URL |
|---------|-----------|-------------|
| Read data | Bridge node | `http://localhost:26658` |
| Submit data | Consensus node | `localhost:26657` |

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

## Next steps

- **Production**: Use `keyring.BackendFile` instead of `keyring.BackendTest`
- **Security**: Enable TLS with authentication tokens for production
- **Advanced**: Read the [full client documentation](https://github.com/celestiaorg/celestia-node/blob/main/api/client#readme)

## Troubleshooting

**"failed to create client"**: Check your node URLs are accessible
**"insufficient funds"**: Fund your account at the Mocha faucet
**"timeout"**: Increase the context timeout or check network connectivity
