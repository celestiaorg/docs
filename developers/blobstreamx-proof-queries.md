---
description: Learn how to query the inclusion proofs used in BlobstreamX
---

# Blobstream proofs queries

## Prerequisites

- Access to a Celestia [consensus full node](../nodes/consensus-node.md)
  RPC endpoint (or full node). The node doesn't need to be a
  validating node in order for the proofs to be queried. A full node is enough.

## Querying the proofs

To prove PFBs, blobs or shares, we can use the Celestia consensus node's RPC to
query proofs for them:

:::tip NOTE
For the go client snippets, make sure to have the following replaces in your `go.mod`:

```go
replace (
    github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v1.18.3-sdk-v0.46.14
    github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
    github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.32.0-tm-v0.34.29
)
```

Make sure to update the versions to match the latest `github.com/celestiaorg/cosmos-sdk` and
`github.com/celestiaorg/celestia-core` versions.
:::

### 1. Data root inclusion proof

To prove the data root is committed to by the Blobstream smart contract, we will
need to provide a Merkle proof of the data root tuple to a data root tuple root.
This can be created using the
[`data_root_inclusion_proof`](https://github.com/celestiaorg/celestia-core/blob/c3ab251659f6fe0f36d10e0dbd14c29a78a85352/rpc/client/http/http.go#L492-L511)
query.

This [endpoint](https://github.com/celestiaorg/celestia-core/blob/793ece9bbd732aec3e09018e37dc31f4bfe122d9/rpc/openapi/openapi.yaml#L1045-L1093)
allows querying a data root to data root tuple root proof. It takes a block
`height`, a starting block, and an end block, then it generates the binary
Merkle proof of the `DataRootTuple`, corresponding to that `height`,
to the `DataRootTupleRoot` which is committed to in the Blobstream contract.

#### Golang client

The endpoint can be queried using the golang client:

```go
package main

import (
	"context"
	"fmt"
	"github.com/tendermint/tendermint/rpc/client/http"
	"os"
)

func main() {
	ctx := context.Background()
	trpc, err := http.New("tcp://localhost:26657", "/websocket")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	err = trpc.Start()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	dcProof, err := trpc.DataRootInclusionProof(ctx, 15, 10, 20)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Println(dcProof.Proof.String())
}
```

#### HTTP request

Example request: `/data_root_inclusion_proof?height=15&start=10&end=20`

Which queries the proof of the height `15` to the data commitment defined
by the range `[10, 20)`.

Example response:

```json
{
  "jsonrpc": "2.0",
  "id": -1,
  "result": {
    "proof": {
      "total": "10",
      "index": "5",
      "leaf_hash": "vkRaRg7FGtZ/ZhsJRh/Uhhb3U6dPaYJ1pJNEfrwq5HE=",
      "aunts": [
        "nmBWWwHpipHwagaI7MAqM/yhCDb4cz7z4lRxmVRq5f8=",
        "nyzLbFJjnSKOfRZur8xvJiJLA+wBPtwm0KbYglILxLg=",
        "GI/tJ9WSwcyHM0r0i8t+p3hPFtDieuYR9wSPVkL1r2s=",
        "+SGf6MfzMmtDKz5MLlH+y7mPV9Moo2x5rLjLe3gbFQo="
      ]
    }
  }
}
```

:::tip NOTE
The values are base64 encoded. For these to be usable
with the solidity smart contract, they need to be converted to `bytes32`.
Check the next section for more information.
:::

### Full example of proving that data was committed to by BlobstreamX contract

```
package main

import (
	"context"
	"fmt"
	"github.com/celestiaorg/celestia-app/pkg/square"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethcmn "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	blobstreamxwrapper "github.com/succinctlabs/blobstreamx/bindings"
	"github.com/tendermint/tendermint/crypto/merkle"
	"github.com/tendermint/tendermint/rpc/client/http"
	"math/big"
	"os"
)

func main() {
	err := verify()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func verify() error {
	ctx := context.Background()

	// start the tendermint RPC client
	trpc, err := http.New("tcp://localhost:26657", "/websocket")
	if err != nil {
		return err
	}
	err = trpc.Start()
	if err != nil {
		return err
	}

	// get the PayForBlob transaction that contains the published blob
	tx, err := trpc.Tx(ctx, []byte("tx_hash"), true)
	if err != nil {
		return err
	}

	// get the block containing the PayForBlob transaction
	blockRes, err := trpc.Block(ctx, &tx.Height)
	if err != nil {
		return err
	}

	// get the share range of the blob inside the block
	blobShareRange, err := square.BlobShareRange(blockRes.Block.Txs.ToSliceOfBytes(), int(tx.Index), 0, blockRes.Block.Header.Version.App)
	if err != nil {
		return err
	}

	// get the nonce corresponding to the block height that contains the PayForBlob transaction
	// since BlobstreamX emits events when new batches are submitted, we will query the events
	// and look for the range committing to the blob
	// first, connect to an EVM RPC endpoint
	ethClient, err := ethclient.Dial("evm_rpc_endpoint")
	if err != nil {
		return err
	}
	defer ethClient.Close()

	// use the BlobstreamX contract binding
	wrapper, err := blobstreamxwrapper.NewBlobstreamX(ethcmn.HexToAddress("contract_Address"), ethClient)
	if err != nil {
		return err
	}

	LatestBlockNumber, err := ethClient.BlockNumber(context.Background())
	if err != nil {
		return err
	}

	eventsIterator, err := wrapper.FilterDataCommitmentStored(
		&bind.FilterOpts{
			Context: ctx,
			Start: LatestBlockNumber - 90000,
			End: &LatestBlockNumber,
		},
		nil,
		nil,
		nil,
	)
	if err != nil {
		return err
	}

	var event *blobstreamxwrapper.BlobstreamXDataCommitmentStored
	for eventsIterator.Next() {
		e := eventsIterator.Event
		if int64(e.StartBlock) <= tx.Height && tx.Height < int64(e.EndBlock) {
			event = &blobstreamxwrapper.BlobstreamXDataCommitmentStored{
				ProofNonce:     e.ProofNonce,
				StartBlock:     e.StartBlock,
				EndBlock:       e.EndBlock,
				DataCommitment: e.DataCommitment,
			}
			break
		}
	}
	if err := eventsIterator.Error(); err != nil {
		return err
	}
	err = eventsIterator.Close()
	if err != nil {
		return err
	}
	if event == nil {
		return fmt.Errorf("couldn't find range containing the transaction height")
	}

	// get the block data root inclusion proof to the data root tuple root
	dcProof, err := trpc.DataRootInclusionProof(ctx, uint64(tx.Height), event.StartBlock, event.EndBlock)
	if err != nil {
		return err
	}

	// verify that the data root was committed to by the BlobstreamX contract
	committed, err := VerifyDataRootInclusion(ctx, wrapper, event.ProofNonce.Uint64(), uint64(tx.Height), blockRes.Block.DataHash, dcProof.Proof)
	if err != nil {
		return err
	}
	if committed {
		fmt.Println("data root was committed to by the BlobstreamX contract")
	} else {
		fmt.Println("data root was not committed to by the BlobstreamX contract")
		return nil
	}
    return nil
}


func VerifyDataRootInclusion(
	_ context.Context,
	blobstreamXwrapper *blobstreamxwrapper.BlobstreamX,
	nonce uint64,
	height uint64,
	dataRoot []byte,
	proof merkle.Proof,
) (bool, error) {
	tuple := blobstreamxwrapper.DataRootTuple{
		Height:   big.NewInt(int64(height)),
		DataRoot: *(*[32]byte)(dataRoot),
	}

	sideNodes := make([][32]byte, len(proof.Aunts))
	for i, aunt := range proof.Aunts {
		sideNodes[i] = *(*[32]byte)(aunt)
	}
	wrappedProof := blobstreamxwrapper.BinaryMerkleProof{
		SideNodes: sideNodes,
		Key:       big.NewInt(proof.Index),
		NumLeaves: big.NewInt(proof.Total),
	}

	valid, err := blobstreamXwrapper.VerifyAttestation(
		&bind.CallOpts{},
		big.NewInt(int64(nonce)),
		tuple,
		wrappedProof,
	)
	if err != nil {
		return false, err
	}
	return valid, nil
}
```

### 2. Transaction inclusion proof

To prove that a rollup transaction is part of the data root, we will need to
provide two proofs: (1) a namespace Merkle proof of the transaction to (2)
a row root. This could be done via proving the shares that contain the
transaction to the row root using a namespace Merkle proof. And, a
binary Merkle proof of the row root to the data root.

These proofs can be generated using the
[`ProveShares`](https://github.com/celestiaorg/celestia-core/blob/c3ab251659f6fe0f36d10e0dbd14c29a78a85352/rpc/client/http/http.go#L526-L543)
query.

This [endpoint](https://github.com/celestiaorg/celestia-core/blob/793ece9bbd732aec3e09018e37dc31f4bfe122d9/rpc/core/tx.go#L175-L213)
allows querying a shares proof to row roots, then a row roots to data
root proofs. It takes a block `height`, a starting share index and
an end share index which define a share range. Then, two proofs are
generated:

- An NMT proof of the shares to the row roots
- A binary Merkle proof of the row root to the data root

:::tip NOTE
If the share range spans multiple rows,
then the proof can contain multiple NMT and binary proofs.
:::

#### Golang client

The endpoint can be queried using the golang client:

```go
	sharesProof, err := trpc.ProveShares(ctx, 15, 0, 1)
	if err != nil {
		...
	}
```

#### HTTP

Example request: `/prove_shares?height=15&startShare=0&endShare=1`

Which queries the proof of shares `[0,1)` in block `15`.

Example response:

```json
{
  "jsonrpc": "2.0",
  "id": -1,
  "result": {
    "data": [
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQBAAABXAAAACbaAgrOAgqgAQqdAQogL2NlbGVzdGlhLmJsb2IudjEuTXNnUGF5Rm9yQmxvYnMSeQovY2VsZXN0aWExdWc1ZWt0MmNjN250dzRkdG1zZDlsN3N0cTBzN3Z5ZTd5bTJyZHISHQAAAAAAAAAAAAAAAAAAAAAAAAASExIyQkMkMoiZGgKXAiIgrfloW1M/Y33zlD2luveDELZzr9cF92+2eTaImIWhN9pCAQASZwpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA36hewmW/AXtrw6S+QsNUzFGfeg37Da6igoP2ZQcK+04EgQKAggBGAISEwoNCgR1dGlhEgUyMTAwMBDQ6AwaQClYLQPNrFoD6H8mgmwxjFeNhwhRu39EcrVKMFkNQ8+HHuodhdOQIG/8DXEmrBwrpwj6hi+3uEsZ+0p5vrf3v8sSAQEaBElORFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
    ],
    "share_proofs": [
      {
        "end": 1,
        "nodes": [
          "AAAAAAAAAAAAAAAAAAAAAAAAABITEjJCQyQyiJkAAAAAAAAAAAAAAAAAAAAAAAAAEhMSMkJDJDKImbiwnpOdwIZBFr0UiFhPKwGy/XIIjL+gqm0fqxIw0z0o",
          "/////////////////////////////////////////////////////////////////////////////3+fuhlzUfKJnZD8yg/JOtZla2V3g2Q7y+18iH5j0Uxk"
        ]
      }
    ],
    "namespace_id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA==",
    "row_proof": {
      "row_roots": [
        "000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000121312324243243288993946154604701154F739F3D1B5475786DDD960F06D8708D4E870DA6501C51750"
      ],
      "proofs": [
        {
          "total": "8",
          "index": "0",
          "leaf_hash": "300xzO8TiLwPNuREY6OJcRKzTHQ4y6yy6qH0wAuMMrc=",
          "aunts": [
            "ugp0sV9YNEI5pOiYR7RdOdswwlfBh2o3XiRsmMNmbKs=",
            "3dMFZFaWZMTZVXhphF5TxlCJ+CT3EvmMFOpiXFH+ID4=",
            "srl59GiTSiwC9LqdYASzFC6TvusyY7njX8/XThp6Xws="
          ]
        }
      ],
      "start_row": 0,
      "end_row": 0
    },
    "namespace_version": 0
  }
}
```

:::tip NOTE
The values are base64 encoded. For these to be usable
with the solidity smart contract, they need to be converted to `bytes32`.
Check the next section for more information.
:::

## Converting the proofs to be usable in the `DAVerifier` contract

The `DAVerifier` smart contract takes the following proof format:

<!-- markdownlint-disable MD013 -->

```solidity
/// @notice Contains the necessary parameters to prove that some shares, which were posted to
/// the Celestia network, were committed to by the Blobstream smart contract.
struct SharesProof {
    // The shares that were committed to.
    bytes[] data;
    // The shares proof to the row roots. If the shares span multiple rows, we will have multiple nmt proofs.
    NamespaceMerkleMultiproof[] shareProofs;
    // The namespace of the shares.
    Namespace namespace;
    // The rows where the shares belong. If the shares span multiple rows, we will have multiple rows.
    NamespaceNode[] rowRoots;
    // The proofs of the rowRoots to the data root.
    BinaryMerkleProof[] rowProofs;
    // The proof of the data root tuple to the data root tuple root that was posted to the Blobstream contract.
    AttestationProof attestationProof;
}

/// @notice Contains the necessary parameters needed to verify that a data root tuple
/// was committed to, by the Blobstream smart contract, at some specif nonce.
struct AttestationProof {
    // the attestation nonce that commits to the data root tuple.
    uint256 tupleRootNonce;
    // the data root tuple that was committed to.
    DataRootTuple tuple;
    // the binary Merkle proof of the tuple to the commitment.
    BinaryMerkleProof proof;
}
```

<!-- markdownlint-enable MD013 -->

To construct the `SharesProof`, we will need the proof that we queried above,
and it goes as follows:

### `data`

This is the raw shares that were submitted to Celestia in the `bytes` format.
If we take the example blob that was submitted in the
[`RollupInclusionProofs.t.sol`](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L64-L65),
we can convert it to bytes using the `abi.encode(...)` as done for
[this variable](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L384-L402).
This can be gotten from the above result of the
[transaction inclusion proof](#2-transaction-inclusion-proof)
query in the field `data`, which is in `base64` encoded then be
converted to hex to be used as described.

### `shareProofs`

This is the shares proof to the row roots. These can contain multiple proofs if
the shares containing the blob span across multiple rows. To construct them, we
will use the result of the
[transaction inclusion proof](#2-transaction-inclusion-proof) section:

```json
"share_proofs": [
  {
    "start": ...,
    "end": ...,
    "nodes": [
      "...",
      "..."
    ]
  }
],
```

:::tip NOTE
If any of the fields is empty, then it will not be in the response.
For example, if the `start` field is `0`, it will be omitted in the response.
:::

While the `NamespaceMerkleMultiproof` being:

```solidity
/// @notice Namespace Merkle Tree Multiproof structure. Proves multiple leaves.
struct NamespaceMerkleMultiproof {
    // The beginning key of the leaves to verify.
    uint256 beginKey;
    // The ending key of the leaves to verify.
    uint256 endKey;
    // List of side nodes to verify and calculate tree.
    NamespaceNode[] sideNodes;
}
```

So, we can construct the `NamespaceMerkleMultiproof` with the following mapping:

- `beginKey` in the Solidity struct **==** `start` in the query response
- `endKey` in the Solidity struct **==** `end` in the query response
- `sideNodes` in the Solidity struct **==** `nodes` in the query response

- The `NamespaceNode`, which is the type of the `sideNodes`, is defined as follows:

```solidity
/// @notice Namespace Merkle Tree node.
struct NamespaceNode {
    // Minimum namespace.
    Namespace min;
    // Maximum namespace.
    Namespace max;
    // Node value.
    bytes32 digest;
}
```

So, we construct a `NamespaceNode` via taking the values from the `nodes` field
in the query response, we convert them from base64 to `hex`, then we use the
following mapping:

- `min` == the first 29 bytes in the decoded value
- `max` == the second 29 bytes in the decoded value
- `digest` == the remaining 32 bytes in the decoded value

The `min` and `max` are `Namespace` type which is:

```solidity
/// @notice A representation of the Celestia-app namespace ID and its version.
/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html
struct Namespace {
    // The namespace version.
    bytes1 version;
    // The namespace ID.
    bytes28 id;
}
```

So, to construct them, we separate the 29 bytes in the decoded value to:

- first byte: `version`
- remaining 28 bytes: `id`

An example of doing this can be found in the
[RollupInclusionProofs.t.sol](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L465-L477)
test.

### `namespace`

Which is the namespace used by the rollup when submitting data to Celestia.
As described above, it can be constructed as follows:

```solidity
/// @notice A representation of the Celestia-app namespace ID and its version.
/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html
struct Namespace {
    // The namespace version.
    bytes1 version;
    // The namespace ID.
    bytes28 id;
}
```

Via taking the `namespace` value from the `prove_shares` query response,
decoding it from base64 to hex, then:

- first byte: `version`
- remaining 28 bytes: `id`

An example can be found in the
[RollupInclusionProofs.t.sol](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L488)
test.

### `rowRoots`

Which are the roots of the rows where the shares containing the Rollup data are
localised. These can be taken from the `prove_shares` query response:

```json
"row_proof":
{
    "row_roots":
    [
        "..."
    ],
},
```

The values inside the `row_roots` are already in hex, and the Solidity type
of the `rowRoots` is `NamespaceNode`. So, we will construct them similar to the
`sideNodes` of the [`shareProofs`](#shareproofs). Except that no base64
conversion is needed.

### `rowProofs`

These are the proofs of the rows to the data root. They are of type `BinaryMerkleProof`:

```solidity
/// @notice Merkle Tree Proof structure.
struct BinaryMerkleProof {
    // List of side nodes to verify and calculate tree.
    bytes32[] sideNodes;
    // The key of the leaf to verify.
    uint256 key;
    // The number of leaves in the tree
    uint256 numLeaves;
}
```

To construct them, we take the response of the `prove_shares` query:

```json
"row_proof": {
      "row_roots": [
        "..."
      ],
      "proofs": [
        {
          "total": "...",
          "index": "...",
          "leaf_hash": "...",
          "aunts": [
            "...",
            "..."
          ]
        }
      ],
```

and do the following mapping:

- `key` in the Solidity struct **==** `index` in the query response
- `numLeaves` in the Solidity struct **==** `total` in the query response
- `sideNodes` in the Solidity struct **==** `aunts` in the query response

The type of the `sideNodes` is a `bytes32`. So, we take the values in the query
response, we convert them from base64 to hex, then we create the values.

An example can be found in the
[RollupInclusionProofs.t.sol](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L479-L484)
test.

### `attestationProof`

This is the proof of the data root to the data root tuple root, which is committed
to in the Blobstream contract:

```solidity
/// @notice Contains the necessary parameters needed to verify that a data root tuple
/// was committed to, by the Blobstream smart contract, at some specif nonce.
struct AttestationProof {
    // the attestation nonce that commits to the data root tuple.
    uint256 tupleRootNonce;
    // the data root tuple that was committed to.
    DataRootTuple tuple;
    // the binary Merkle proof of the tuple to the commitment.
    BinaryMerkleProof proof;
}
```

- `tupleRootNonce`: the nonce at which Blobstream committed to the batch containing
  the block containing the data.
- `tuple`: the `DataRootTuple` of the block:

```solidity
/// @notice A tuple of data root with metadata. Each data root is associated
///  with a Celestia block height.
/// @dev `availableDataRoot` in
///  https://github.com/celestiaorg/celestia-specs/blob/master/src/specs/data_structures.md#header
struct DataRootTuple {
    // Celestia block height the data root was included in.
    // Genesis block is height = 0.
    // First queryable block is height = 1.
    uint256 height;
    // Data root.
    bytes32 dataRoot;
}
```

which comprises a `dataRoot`, i.e. the block containing the Rollup data data root,
and the `height` which is the `height` of that block.

- `proof`: the `BinaryMerkleProof` of the data root tuple to the data root
  tuple root.
  Constructing it is similar to constructing the row roots to data root proof in
  the [rowProofs](#rowproofs) section.

An example can be found in the
[RollupInclusionProofs.t.sol](https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L488)
test.

If the `dataRoot` or the `tupleRootNonce` is unknown during the verification:

- `dataRoot`: can be queried using the `/block?height=15` query (`15` in this
  example endpoint), and taking the `data_hash` field from the response.
- `tupleRootNonce`: can be retried via querying the `BlobstreamXDataCommitmentStored`
  events from the BlobstreamX contract and looking for the nonce attesting to the
  corresponding data. An example:

```go
	// get the nonce corresponding to the block height that contains the PayForBlob transaction
	// since BlobstreamX emits events when new batches are submitted, we will query the events
	// and look for the range committing to the blob
	// first, connect to an EVM RPC endpoint
	ethClient, err := ethclient.Dial("evm_rpc_endpoint")
	if err != nil {
		return err
	}
	defer ethClient.Close()

	// use the BlobstreamX contract binding
	wrapper, err := blobstreamxwrapper.NewBlobstreamX(ethcmn.HexToAddress("contract_Address"), ethClient)
	if err != nil {
		return err
	}

	LatestBlockNumber, err := ethClient.BlockNumber(ctx)
	if err != nil {
		return err
	}

	eventsIterator, err := wrapper.FilterDataCommitmentStored(
		&bind.FilterOpts{
			Context: ctx,
			Start: LatestBlockNumber - 90000, // 90000 can be replaced with the range of EVM blocks to look for the events in
			End: &LatestBlockNumber,
		},
		nil,
		nil,
		nil,
	)
	if err != nil {
		return err
	}
	
	var event *blobstreamxwrapper.BlobstreamXDataCommitmentStored
	for eventsIterator.Next() {
		e := eventsIterator.Event
		if int64(e.StartBlock) <= tx.Height && tx.Height < int64(e.EndBlock) {
			event = &blobstreamxwrapper.BlobstreamXDataCommitmentStored{
				ProofNonce:     e.ProofNonce,
				StartBlock:     e.StartBlock,
				EndBlock:       e.EndBlock,
				DataCommitment: e.DataCommitment,
			}
			break
		}
	}
	if err := eventsIterator.Error(); err != nil {
		return err
	}
	err = eventsIterator.Close()
	if err != nil {
		return err
	}
	if event == nil {
		return fmt.Errorf("couldn't find range containing the block height")
	}
```

## High-level diagrams (TBD)

The two diagrams below summarize how a single share is committed to in Blobstream.
The share is highlighted in green. `R0`, `R1`, etc represent the respective row and
column roots, the blue and pink gradients are erasure encoded data. More details
on the square layout can be found
[in the data square layout](https://github.com/celestiaorg/celestia-app/blob/v1.1.0/specs/src/specs/data_square_layout.md)
and
[data structures](https://github.com/celestiaorg/celestia-app/blob/v1.1.0/specs/src/specs/data_structures.md#erasure-coding)
portion of the specs.

### The Celestia square

![Square](/img/blobstream/blobstream-square.png)

### The commitment scheme

![Blobstream Commitment Diagram](/img/blobstream/blobstream-commitment-diagram.png)

## Conclusion

After creating all the proofs, and verifying them:

1. Verify inclusion proof of the transaction to Celestia data root
2. Prove that the data root tuple is committed to by the Blobstream smart contract

We can be sure that the data was published to Celestia.

:::tip NOTE
The above proof constructions are implemented in Solidity,
and may require different approaches in other programming languages.
:::
