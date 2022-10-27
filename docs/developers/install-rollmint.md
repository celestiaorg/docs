---
sidebar_label : Installing Rollmint
---

# Setting Up Rollmint

Before you continue with building your Wordle App, you need to set up
Rollmint on your codebase.

## Installing Rollmint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.1-rollmint-v0.4.0
go mod tidy
go mod download
```

With that, you have Rollmint changes added to the project directory. Now,
let's build the Wordle app!
