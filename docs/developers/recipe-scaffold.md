---
sidebar_label: Scaffold your Rollup
---

# 🏗 Scaffolding your Rollup

## 🔥 Use Ignite CLI to Scaffold a `recipes` Rollup

Run the following command to scaffold your `recipes` chain using Ignite CLI:

```bash
ignite scaffold chain recipes --address-prefix recipes
```

Your new `recipes` chain has been scaffolded and
`--address-prefix recipes` allows the address prefix
to be `recipes` instead of `cosmos`.

Change into the `recipes` directory:

```bash
cd recipes
```

## 💎 Installing Rollmint

To swap out Tendermint for Rollmint, run the following commands:

```sh
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/rollkit/cosmos-sdk@v0.46.7-rollkit-v0.6.0-no-fraud-proofs
go mod edit -replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221202214355-3605c597500d
go mod tidy
go mod download
```
