---
next:
    text: "Celestia-node key"
    link: "/developers/celestia-node-key"
---

# New Blobstream X deployments

This document provides instructions for deploying BlobstreamX to a new chain.

## Deploying the contracts

To deploy Blobstream X to a new chain, follow these steps:

1. Clone the sp1-blobstream repository:

```shell
git clone https://github.com/succinctlabs/sp1-blobstream
cd sp1-blobstream
```

2. Follow the deployment instructions in the
[sp1-blobstream README](https://github.com/succinctlabs/sp1-blobstream?tab=readme-ov-file#deployment).

3. If you're deploying on a chain where there isn't a canonical verifier listed in the
[SP1 contract addresses](https://github.com/succinctlabs/sp1/blob/main/book/onchain-verification/contract-addresses.md), you'll need to:

   a. Deploy your own SP1 Verifier from `sp1-contracts` matching your `sp1-sdk` version.
   b. Set the `SP1_VERIFIER_ADDRESS` in your `.env` file to the address of your deployed verifier.

4. To run the prover:

   - For local proving, set `SP1_PROVER=local` in your environment.
   - To use the Succinct Proving Network for remote proving, set `SP1_PROVER=network`.
