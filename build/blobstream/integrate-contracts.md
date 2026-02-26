# Integrate with Blobstream contracts

## Getting started

### Prerequisites

Make sure to have the following installed:

- [Foundry](https://github.com/foundry-rs/foundry)

### Installing Blobstream contracts

Install the Blobstream contracts repo as a dependency:

```bash
forge install celestiaorg/blobstream-contracts --no-commit
```

> **Note:** The minimum Solidity compiler version for using the Blobstream contracts is `0.8.19`.

### Example usage

Example minimal Solidity contract for a stub ZK rollup that leverages the Blobstream contract to check that data has been posted to Celestia:

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

## Data structures

Each [`DataRootTuple`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/DataRootTuple.sol) is a tuple of block height and data root. It is analogous to a Celestia block header. `DataRootTuple`s are relayed in batches, committed to as a `DataRootTuple`s root (i.e. a Merkle root of `DataRootTuple`s).

The [`BinaryMerkleProof`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/lib/tree/binary/BinaryMerkleProof.sol) is an [RFC-6962](https://www.rfc-editor.org/rfc/rfc6962.html)-compliant Merkle proof. Since `DataRootTuple`s are Merkleized in a binary Merkle tree, verifying the inclusion of a `DataRootTuple` against a `DataRootTuple`s root requires verifying a Merkle inclusion proof.

## Interface

The [`IDAOracle`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/IDAOracle.sol) (**D**ata **A**vailability **O**racle Interface) interface allows L2 contracts on Ethereum to query the Blobstream contract for relayed `DataRootTuple`s. The single interface method `verifyAttestation` verifies a Merkle inclusion proof that a `DataRootTuple` is included under a specific batch (indexed by batch nonce). In other words, analogously it verifies that a specific block header is included in the canonical Celestia chain.

## Querying the proof

To prove that the data was published to Celestia, check out the [proof queries documentation](/build/blobstream/proof-queries) to understand how to query the proofs from Celestia consensus nodes and make them usable in the Blobstream verifier contract.

## Verifying data inclusion for fraud proofs

A high-level overview of how a fraud-proof based L2 would interact with Blobstream can be found in the [inclusion proofs documentation](https://github.com/celestiaorg/blobstream-contracts/blob/master/docs/inclusion-proofs.md).

The [`DAVerifier`](https://github.com/celestiaorg/blobstream-contracts/blob/master/src/lib/verifier/DAVerifier.sol) library is available at `blobstream-contracts/lib/verifier/DAVerifier.sol`, and provides functions to verify the inclusion of individual (or multiple) shares against a `DataRootTuple`. The library is stateless, and allows to pass an `IDAOracle` interface as a parameter to verify inclusion against it.

In the `DAVerifier` library, we find functions that help with data inclusion verification and calculating the square size of a Celestia block. These functions work with the Blobstream smart contract, using different proofs to check and confirm the data's availability. Let's take a closer look at these functions:

- [`verifySharesToDataRootTupleRoot`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/DAVerifier.sol#L80-L124): This function verifies that the shares, which were posted to Celestia, were committed to by the Blobstream smart contract. It checks that the data root was committed to by the Blobstream smart contract and that the shares were committed to by the rows roots.

- [`verifyRowRootToDataRootTupleRoot`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/DAVerifier.sol#L133-L155): This function verifies that a row/column root, from a Celestia block, was committed to by the Blobstream smart contract. It checks that the data root was committed to by the Blobstream smart contract and that the row root commits to the data root.

- [`verifyMultiRowRootsToDataRootTupleRoot`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/DAVerifier.sol#L164-L194): This function verifies that a set of rows/columns, from a Celestia block, were committed to by the Blobstream smart contract. It checks that the data root was committed to by the Blobstream smart contract and that the rows roots commit to the data root.

- [`computeSquareSizeFromRowProof`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/DAVerifier.sol#L204-L215): This function computes the Celestia block square size from a row/column root to data root binary Merkle proof. It is the user's responsibility to verify that the proof is valid and was successfully committed to using the `verifyRowRootToDataRootTupleRoot()` method.

- [`computeSquareSizeFromShareProof`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/DAVerifier.sol#L224-L229): This function computes the Celestia block square size from a shares to row/column root proof. It is the user's responsibility to verify that the proof is valid and that the shares were successfully committed to using the `verifySharesToDataRootTupleRoot()` method.

For an overview of a demo rollup implementation, head to [the next section](/build/blobstream/integrate-offchain).

## Deployed contracts

You can interact with the SP1 Blobstream contracts today. The
SP1 Blobstream Solidity smart contracts are currently deployed on
the following chains:

| Contract       | EVM network            | Contract address                                                                                                                                 | Attested data on Celestia                        | Link to Celenium                                                                       |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| SP1 Blobstream | Ethereum Mainnet       | [`0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe`](https://etherscan.io/address/0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe#events)                   | [Mainnet Beta](/operate/networks/mainnet-beta)        | [Deployment on Celenium](https://celenium.io/blobstream?network=ethereum&page=1)       |
| SP1 Blobstream | Arbitrum One           | [`0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794`](https://arbiscan.io/address/0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794#events)                    | [Mainnet Beta](/operate/networks/mainnet-beta)        | [Deployment on Celenium](https://celenium.io/blobstream?network=arbitrum&page=1)       |
| SP1 Blobstream | Base                   | [`0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794`](https://basescan.org/address/0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794#events)                   | [Mainnet Beta](/operate/networks/mainnet-beta)        | [Deployment on Celenium](https://celenium.io/blobstream?network=base&page=1)           |
| SP1 Blobstream | Scroll                 | [`0x5008fa5CC3397faEa90fcde71C35945db6822218`](https://scrollscan.com/address/0x5008fa5CC3397faEa90fcde71C35945db6822218)                        | [Mainnet Beta](/operate/networks/mainnet-beta)        | N/A                                                                                    |
| SP1 Blobstream | Sepolia                | [`0xf0c6429ebab2e7dc6e05dafb61128be21f13cb1e`](https://sepolia.etherscan.io/address/0xf0c6429ebab2e7dc6e05dafb61128be21f13cb1e#events)           | [Mocha testnet](/operate/networks/mocha-testnet) | [Deployment on Celenium](https://mocha.celenium.io/blobstream?network=ethereum&page=1) |
| SP1 Blobstream | Arbitrum Sepolia       | [`0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2`](https://sepolia.arbiscan.io/address/0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2#events)            | [Mocha testnet](/operate/networks/mocha-testnet) | [Deployment on Celenium](https://mocha.celenium.io/blobstream?network=arbitrum&page=1) |
| SP1 Blobstream | Base Sepolia           | [`0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2`](https://sepolia.basescan.org/address/0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2#events)           | [Mocha testnet](/operate/networks/mocha-testnet) | [Deployment on Celenium](https://mocha.celenium.io/blobstream?network=base&page=1)     |
| SP1 Blobstream | Holesky                | [`0x315A044cb95e4d44bBf6253585FbEbcdB6fb41ef`](https://holesky.etherscan.io/address/0x315A044cb95e4d44bBf6253585FbEbcdB6fb41ef)                  | [Mocha testnet](/operate/networks/mocha-testnet) | N/A                                                                                    |
| SP1 Blobstream | ZKSync Gateway Staging | [`0x3a038D77A9b4eBBc8A7482B438BCff11c3591792`](https://explorer.era-gateway-stage.zksync.dev/address/0x3a038D77A9b4eBBc8A7482B438BCff11c3591792) | [Mocha testnet](/operate/networks/mocha-testnet) | N/A                                                                                    |