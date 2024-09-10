---
next:
    text: "Integrate with Blobstream X contracts"
    link: "/developers/blobstream-contracts"
---

# New SP1 Blobstream deployments

This document provides instructions for deploying SP1 Blobstream to a new chain.

[SP1 Blobstream](https://github.com/succinctlabs/sp1-blobstream) is the latest implementation of Blobstream
in Rust using the [SP1](https://github.com/succinctlabs/sp1) zkVM.

## Deploying the contracts

To deploy SP1 Blobstream to a new chain, follow these steps:

1. Clone the sp1-blobstream repository:

```shell
git clone https://github.com/succinctlabs/sp1-blobstream
cd sp1-blobstream
```

2. Follow the deployment instructions in the
[sp1-blobstream README](https://github.com/succinctlabs/sp1-blobstream?tab=readme-ov-file#deployment).

3. If you're deploying on a chain where there isn't a canonical verifier listed in the
[SP1 contract addresses](https://github.com/succinctlabs/sp1/blob/main/book/onchain-verification/contract-addresses.md), you'll need to:

   a. Deploy your own SP1 Verifier from the [sp1-contracts](https://github.com/succinctlabs/sp1-contracts) matching your `sp1-sdk` version.
   b. Set the `SP1_VERIFIER_ADDRESS` in your `.env` file to the address of your deployed verifier.

4. To run the prover:

   - For local proving, set `SP1_PROVER=local` in your environment.
   - To use the Succinct Proving Network for remote proving, set `SP1_PROVER=network`.
   - We recommend an instance with 64 vCPU and 128GB of RAM for local proving.

Note: Any whitelisting for custom provers would need to be implemented in the application's smart contracts (e.g., by using an approvedProvers mapping).
