---
sidebar_label: Integrate with Blobstream Contracts
description: Learn how to integrate your L2's onchain logic with Blobstream
---

# Integrate with Blobstream Contracts

## Getting Started

### Prerequisites

Please make sure to have the following installed:

- [Foundry](https://github.com/foundry-rs/foundry)

### Installing Blobstream Contracts

Install the Blobstream contracts repo as a dependency:

```sh
forge install celestiaorg/blobstream-contracts --no-commit
```

Note that the minimum Solidity compiler version for using the Blobstream
contracts is `0.8.19`.

### Example Usage

Example minimal Solidity contract for a stub ZK rollup that leverages the
Blobstream contract to check that data has been posted to Celestia:

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
        // Verify that the data root tuple (analog. block header) has been
        // attested to by the Blobstream contract.
        require(
            blobstream.verifyAttestation(_blobstream_nonce, _tuple, _proof)
        );

        // Verify the ZKP.
        // _tuple.dataRoot is a public input, leaves (shares) are private inputs.
        require(verifyZKP(_rollup_block_hash, _zk_proof, _tuple.dataRoot));

        // Everything checks out, append rollup block hash to list.
        rollup_block_hashes.push(_rollup_block_hash);
    }

    function verifyZKP(
        bytes32 _rollup_block_hash,
        bytes calldata _zk_proof,
        bytes32 _data_root
    ) private pure returns (bool) {
        return true;
    }
}
```

## Data Structures

Each [`DataRootTuple`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/DataRootTuple.sol)
is a tuple of block height and data root. It is analogous to a Celestia block
header. `DataRootTuple`s are relayed in batches, committed to as a
`DataRootTuple`s root (i.e. a Merkle root of `DataRootTuple`s).

The [`BinaryMerkleProof`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/lib/tree/binary/BinaryMerkleProof.sol)
is an [RFC-6962](https://www.rfc-editor.org/rfc/rfc6962.html)-compliant Merkle
proof. Since `DataRootTuple`s are Merkleized in a binary Merkle tree, verifying
the inclusion of a `DataRootTuple` against a `DataRootTuple`s root requires
verifying a Merkle inclusion proof.

## Interface

The [`IDAOracle`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/IDAOracle.sol)
(**D**ata **A**vailability **O**racle Interface) interface allows L2 contracts
on Ethereum to query the Blobstream contract for relayed `DataRootTuple`s. The
single interface method `verifyAttestation` verifies a Merkle inclusion proof
that a `DataRootTuple` is included under a specific batch (indexed by batch
nonce). In other words, analogously it verifies that a specific block header is
included in the canonical Celestia chain.

## Verifying Data Inclusion for Fraud Proofs

A high-level overview of how a fraud-proof based L2 would interact with
Blobstream can be found in the [inclusion proofs documentation](https://github.com/celestiaorg/blobstream-contracts/blob/master/docs/inclusion-proofs.md).

The [`DAVerifier`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/lib/verifier/DAVerifier.sol)
library is available at `blobstream-contracts/lib/verifier/DAVerifier.sol`, and
provides functions to verify the inclusion of individual (or multiple) shares
against a `DataRootTuple`. The library is stateless, and assumes the
`DataRootTuple` was previously verified as included through the Blobstream
contract's `verifyAttestation` method.

`verifySharesToDataRootTupleRoot`

`verifyRowRootToDataRootTupleRoot`

`verifyMultiRowRootsToDataRootTupleRoot`

`computeSquareSizeFromRowProof`

`computeSquareSizeFromShareProof`
