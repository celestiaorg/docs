---
sidebar_label: Installing Rollmint
---

# Setting Up Rollmint

Before we continue with building our Wordle App, we need to set up
Rollmint on our codebase.

## Installing Rollmint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/rollkit/cosmos-sdk@v0.46.7-rollkit-v0.6.0-no-fraud-proofs
go mod edit -replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221202214355-3605c597500d
go mod tidy
go mod download
```

With that, we have Rollmint changes added to the project directory. Now,
let's build the Wordle app!
