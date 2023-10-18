---
sidebar_label: Integrate with Blobstream Contracts
description: Learn how to integrate your L2's onchain logic with Blobstream
---

# Integrate with Blobstream Contracts

## Getting Started

Install the Blobstream contracts repo as a dependency:

```sh
forge install celestiaorg/blobstream-contracts --no-commit
```

Example minimal Solidity contract that calls the Blobstream contract to check
that data has been posted to Celestia.

Note that the minimum Solidity compiler version for using the Blobstream
contracts is `0.8.19`.

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "blobstream-contracts/IDAOracle.sol";
import "blobstream-contracts/DataRootTuple.sol";
import "blobstream-contracts/lib/tree/binary/BinaryMerkleProof.sol";

contract MyRollup {
    IDAOracle immutable blobstream;
    bytes32[] public rollup_block_hashes;

    constructor(IDAOracle _blobstream) {
        blobstream = _blobstream;
    }

    function submitRollupBlock(
        bytes32 _rollup_block_hash,
        bytes calldata _zk_proof,
        uint256 _blobstream_nonce,
        DataRootTuple calldata _tuple,
        BinaryMerkleProof calldata _proof
    ) public {
        // Verify that the data root tuple (subset of block header) has been
        // attested to by the Blobstream contract.
        require(
            blobstream.verifyAttestation(_blobstream_nonce, _tuple, _proof)
        );

        // Verify the ZKP.
        // _tuple.dataRoot is a private input, leaves are public inputs.
        require(verifyZKP(_zk_proof, _tuple.dataRoot));

        // Everything checks out, append rollup block hash to list.
        rollup_block_hashes.push(_rollup_block_hash);
    }

    function verifyZKP(
        bytes calldata _zk_proof,
        bytes32 _data_root
    ) private pure returns (bool) {
        return true;
    }
}
```

## Verifying Data Inclusion for Fraud Proofs

A high-level overview of how a fraud-proof based L2 would interact with
Blobstream can be found [here](https://github.com/celestiaorg/blobstream-contracts/blob/master/docs/inclusion-proofs.md).

The `DAVerifier` library is available at `blobstream-contracts/lib/verifier/DAVerifier.sol`,
and provides functions to verify the inclusion of individual shares (or
multiple) shares against a data root.
