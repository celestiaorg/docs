---
sidebar_label: Installing Rollmint
---

# Setting Up Rollmint

Before we continue with building our Wordle App, we need to set up
Rollmint on our codebase.

## Installing Rollmint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.7-rollmint-v0.5.0-no-fraud-proofs
go mod edit --replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221013213714-8be9b54c8c21
go mod tidy
go mod download
```

With that, we have Rollmint changes added to the project directory. Now,
let's build the Wordle app!
