# Celestia Golang client guide

The Celestia Go client (`celestia-node/api/client`) supports both the Mocha testnet and Mainnet Beta. The latest supported version is `v0.22.2-client-lib-rc2`.

To learn more, [view the Golang client's source](https://github.com/celestiaorg/celestia-node/tree/main/api/client)
and [docs](https://github.com/celestiaorg/celestia-node/blob/main/api/client/readme.md).

## Install to an existing project

To get started with the Go client on an existing project, install the package via:

```bash
go get github.com/celestiaorg/celestia-node/api/client
```

Make sure your project uses Go 1.23 or later and that you have initialized your module with `go mod init`.

Here is a reference go.mod for the stable version:

```go
require (
	github.com/celestiaorg/celestia-node v0.22.2-client-lib-rc2
	github.com/celestiaorg/go-square/v2 v2.2.0
)
```

## 🏗️ Example project with the Go client {#example-project-with-the-go-client}

Here’s a working example that covers:
• Initializing a keyring
• Configuring the client
• Checking balance
• Submitting a blob
• Retrieving the blob

### 1. 📁 Create a New Directory {#create-a-new-directory}

```bash
mkdir celestia-client-example
cd celestia-client-example
```

### 2. 🧱 Initialize Go Module {#initialize-go-module}

```
go mod init celestia-client-example
```

### 3. ✍️ Create main.go {#create-main-go}

Save the full example from above into `main.go`. Here’s a working version with import formatting and placeholder values cleaned up:

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	libshare "github.com/celestiaorg/go-square/v2/share"
	"github.com/celestiaorg/celestia-node/api/client"
	"github.com/celestiaorg/celestia-node/blob"
)

func main() {
	ctx := context.Background()
	keyname := "my_celes_key"

	// Initialize keyring
	kr, err := client.KeyringWithNewKey(client.KeyringConfig{
		KeyName:     keyname,
		BackendName: keyring.BackendTest,
	}, "./keys")
	if err != nil {
		panic(err)
	}

	// Configure client (replace with your actual values)
	cfg := client.Config{
		ReadConfig: client.ReadConfig{
			BridgeDAAddr: "https://your-quicknode-url.celestia-mocha.quiknode.pro/<your-api-token>",
			EnableDATLS:  true,
		},
		SubmitConfig: client.SubmitConfig{
			DefaultKeyName: keyname,
			Network:        "mocha-4",
			CoreGRPCConfig: client.CoreGRPCConfig{
				Addr:       "your-quicknode-url",
				TLSEnabled: true,
				AuthToken:  "<your-api-token>",
			},
		},
	}

	// Create client
	c, err := client.New(ctx, cfg, kr)
	if err != nil {
		panic(err)
	}

	// Check your balance
	balance, err := c.State.Balance(ctx)
	fmt.Println("Balance:", balance)

	// Create and submit a blob
	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	ns := libshare.MustNewV0Namespace([]byte("example"))
	b, err := blob.NewBlob(libshare.ShareVersionZero, ns, []byte("hello celestia!"), nil)
	if err != nil {
		panic(err)
	}

	height, err := c.Blob.Submit(ctx, []*blob.Blob{b}, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Blob submitted at height:", height)

	// Retrieve the blob
	retrieved, err := c.Blob.Get(ctx, height, ns, b.Commitment)
	if err != nil {
		panic(err)
	}
	fmt.Println("Retrieved blob data:", string(retrieved.Data()))
}
```

Remember to add in your Quicknode or other URL and API keys.

### 4. 📦 Add Dependencies to go.mod {#add-dependencies-to-go-mod}

Use this for a clean start:

```go
module celestia-client-example

go 1.23.6

replace (
	github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v1.28.2-sdk-v0.46.16
	github.com/filecoin-project/dagstore => github.com/celestiaorg/dagstore v0.0.0-20230824094345-537c012aa403
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	// broken goleveldb needs to be replaced for the cosmos-sdk and celestia-app
	github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
	github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.51.0-tm-v0.34.35
)

replace github.com/ipfs/boxo => github.com/celestiaorg/boxo v0.29.0-fork

require (
	github.com/celestiaorg/celestia-node v0.22.2-client-lib-rc2
	github.com/celestiaorg/go-square/v2 v2.2.0
	github.com/cosmos/cosmos-sdk v0.46.16
)
```

Now run `go mod tidy`.

### 5. 🚀 Run the program {#run-the-program}

If this is the first time running the program, you’ll see a mnemonic and address output which is your key. After you’ve funded it at the [Mocha faucet](/how-to-guides/mocha-testnet.md#mocha-testnet-faucet), run it again to post your blob.

You should see output like:

```bash
Balance: <your-balance> utia
Blob submitted at height: 6840663
Retrieved blob data: hello celestia!
```

Your keys will be made in the same directory you're in when you run the program.

## Alternate configuration

💡 You can also use a local bridge node and a remote consensus node:

```go
cfg := client.Config{
	ReadConfig: client.ReadConfig{
		BridgeDAAddr: "http://localhost:26658",
		DAAuthToken:  "your-bridge-node-auth-token",
	},
	SubmitConfig: client.SubmitConfig{
		DefaultKeyName: "my_celes_key",
		Network:        "mocha-4",
		CoreGRPCConfig: client.CoreGRPCConfig{
			Addr:       "celestia-testnet-consensus.itrocket.net:9090",
			TLSEnabled: false,
			AuthToken:  "",
		},
	},
}
```

## 👀 Need more control or advanced usage?

See the [full Celestia Go client documentation](https://github.com/celestiaorg/celestia-node/blob/main/api/client#readme) for:

- Read-only client setup
- Full config reference (`ReadConfig`, `SubmitConfig`)
- TLS & auth options
- API-level usage
