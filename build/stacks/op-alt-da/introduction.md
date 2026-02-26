# Introduction

## Overview

The OP Stack integration with Celestia enables rollups to post transaction data to Celestia instead of Ethereum, while still settling on Ethereum. This reduces costs and improves scalability by using Celestia as a modular data availability layer.

## How it works

The `op-batcher` component batches rollup blocks and submits them to Celestia rather than posting calldata to Ethereum:

1. **Data submission**: The batcher calls [`publishTxToL1`](https://github.com/ethereum-optimism/optimism/blob/develop/op-batcher/batcher/driver.go#L931) which retrieves batch data from the channel manager
2. **Celestia storage**: For Celestia-enabled chains, [`celestia_storage.Put`](https://github.com/celestiaorg/op-alt-da/blob/main/celestia_storage.go#L200) submits the blob to Celestia using a configured namespace
3. **Commitment recording**: A commitment identifier (version byte + blob ID) is generated and recorded on Ethereum
4. **Data retrieval**: When `op-node` needs data, it reads the commitment from Ethereum, then fetches the actual blob from Celestia

## Celestia fork differences

The [Celestia fork](https://github.com/celestiaorg/optimism/blob/celestia-develop/op-batcher/batcher/driver.go#L1092) of OP Stack includes:

- Direct blob submission to Celestia with namespace-based organization
- Fallback mechanisms for DA failures (supporting both blob data and calldata alternatives)
- Commitment-based references using Celestia block heights

## Resources

- [op-alt-da repository](https://github.com/celestiaorg/op-alt-da)
- [Celestia OP Stack fork](https://github.com/celestiaorg/optimism)