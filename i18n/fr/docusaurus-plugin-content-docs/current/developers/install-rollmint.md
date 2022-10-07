---
sidebar_label : Installing Rollmint
---

# Setting Up Rollmint

Before we continue with building our Wordle App, we need to set up
Rollmint on our codebase.

## Rollmint Overview

Rollmint is an Sovereign-Rollup implementation of
ABCI (Application Blockchain Interface) in order to build sovereign
chains using the Cosmos-SDK for Celestia.

It is built by replacing Tendermint, the Cosmos-SDK consensus layer, with
a drop-in replacement that communicates directly with
Celestia's Data Availability layer.

## Installing Rollmint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.1-rollmint-v0.4.0
go mod tidy
go mod download
```

With that, we have Rollmint changes added to the project directory. Now,
let's build the Wordle app!
