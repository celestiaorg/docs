---
sidebar_label : Installing Rollmint
---

# Setting Up Rollmint

Before we continue with building our Wordle App, we need to set up
Rollmint on our codebase.

## Installing Rollmint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk@v0.45.4-rollmint-v0.3.5
go mod tidy
go mod download
```

With that, we have Rollmint changes added to the project directory. Now,
let's build the Wordle app!
