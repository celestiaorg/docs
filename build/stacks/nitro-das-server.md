# Arbitrum Nitro with Celestia DA

## Overview

The Arbitrum Nitro integration with Celestia enables Orbit chains to use Celestia for data availability instead of Arbitrum AnyTrust. The implementation uses a sidecar architecture where a separate `celestia-server` handles Celestia-specific operations via RPC.

## How it works

Nitro's batch poster coordinates with the Celestia DAS server to store batch data:

1. **Batch posting**: The [`MaybePostSequencerBatch`](https://github.com/celestiaorg/nitro/blob/v3.6.8/arbnode/batch_poster.go#L1675) method checks if a DAS writer is configured and acquires a lock before posting
2. **Data storage**: The DAS writer calls the Celestia server's [`Store`](https://github.com/celestiaorg/nitro-das-celestia/blob/main/daserver/celestia.go#L302) method, which:
   - Creates a blob from the batch data
   - Submits it to Celestia with retry logic and gas price adjustment
   - Returns a `BlobPointer` containing block height, share indices, and data commitments
3. **Verification**: During disputes, Blobstream (default: SP1 Blobstream) confirms batch availability on Celestia, supporting fraud proofs through the hash oracle trick

## Key features

- **Sidecar architecture**: Processing logic handled by separate `celestia-server`, keeping Nitro nodes lightweight
- **Fallback support**: Native fallback mechanism with configurable `da-preference` parameter (e.g., `["celestia", "anytrust"]`)
- **Preimage oracle**: Validators populate preimage mappings with Celestia hashes for fraud proof support
- **Robust submission**: Automatic retry with gas price adjustment for network congestion

## Resources

- [Nitro fork repository](https://github.com/celestiaorg/nitro)
- [Celestia DAS server](https://github.com/celestiaorg/nitro-das-celestia)