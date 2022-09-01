---
sidebar_label : Installing Optimint
---

# Setting Up Optimint

Before we continue with building our Wordle App, we need to set up
Optimint on our codebase.

## Installing Optimint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk@v0.45.4-optimint-v0.3.5
go mod tidy
go mod download
```

With that, we have Optimint changes added to the project directory. Now,
let's build the Wordle app!
