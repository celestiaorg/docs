# Setting Up Optimint

Before we continue with building our Wordle App, we need to set up
Optimint on our codebase.

## Optimint Overview

Optimint is an Optimistic-Rollup implementation of 
ABCI (Application Blockchain Interface) in order to build optimistic-rollup
chains using the Cosmos-SDK for Celestia.

It is built by replacing Tendermint, the Cosmos-SDK consensus layer, with
an optimistic-rollup (ORU) equivalent of it. It communicates directly with
Celestia's Concensus and Data Availability layer.

## Installing Optimint

Run the following command inside the `wordle` directory.

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk@v0.45.4-optimint-v0.3.3
go mod tidy && go mod download
```

With that, we have Optimint changes added to the project directory. Now,
let's build the Wordle app!
