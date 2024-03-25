---
description: Learn how to build rollups that use Blobstream
---

## Optimistic rollups

One type of rollups that can be built with Blobstream is optimistic rollups.
An optimistic rollup is a rollup that commits optimistically to a set of blocks,
and allows the other parties to verify that the blocks are valid,
and if they're not, they can create fraud proofs to signal that.

Through the use of Blobstream, Celestia allows optimistic rollups to use Celestia as a DA layer,
i.e., posting all the rollup data to Celestia, and only send commitments to the settlement contract.
Then,
users can use Blobstream as a source of truth to verify the rollup data
and create fraud proofs in case of a misbehavior.

To build an optimistic rollup that uses Celestia as a DA layer, the following constructions can be inspired by.

### Optimistic rollups that uses a sequence of spans

One way to construct an optimistic rollup that uses Celestia as a DA layer is to post the rollup data in Celestia.
Then in the rollup header, use the following information to reference a sequence of spans, aka a data pointer:

- `Height`: the height of the Celestia block containing the rollup data
- `Start share`: the index of the first share containing the rollup data
- `Data length`: the number of shares that the rollup data occupies

Note:
If the rollup data is submitted in multiple blocks,
the above sequence of spans can be generalized to include multiple blocks.
For simplicity, we will stick with the data only submitted to a single Celestia block.

Now that this information is saved in the rollup header/settlement contract,
and users/rollup full nodes will be able to query for the rollup data from Celestia and verify that it's valid.
And if it's not, fraud proofs can be generated.

The fraud proofs in this setup are discussed in the [inclusion proofs](https://github.com/celestiaorg/blobstream-contracts/blob/master/docs/inclusion-proofs.md) documentation.

### Optimistic rollups that use the data commitment

Another way to build a rollup is to replace the sequence of spans with a `height` and a `share commitment`.
Then, users/rollup full nodes will be able to query that data, and in case of a dispute, they can create a fraud proof.

The difference between the above construction and this one is that the proofs used will be different:
when using a sequence of spans,
the inclusion proofs will be straight from the rollup data up to the [data root tuple root](https://github.com/celestiaorg/blobstream-contracts/blob/master/README.md#how-it-works).
However, in the case of using the `height` and the `share commitment`,
an extra step would need to be done when posting the header to the settlement contract.
This step is proving that the provided commitment is part of the Celestia block (referenced by its height).
Then, fraud proofs will need to prove the following:

- share inclusion to the share commitment: meaning creating two merkle proofs:
  - share merkle proof up to the [subtree root](https://celestiaorg.github.io/celestia-app/specs/data_square_layout.html#blob-share-commitment-rules)
    corresponding to that share
  - subtree root merkle proof to the [share commitment](https://celestiaorg.github.io/celestia-app/specs/data_square_layout.html#blob-share-commitment-rules)
- share commitment inclusion to the data root tuple root: meaning four merkle proofs:
  - subtree roots merkle proofs to the share commitment: to make sure the subtree roots are valid
  - subtree roots merkle proofs up to the row roots: to prove that the subtree roots belong to a set of rows
  - row roots proofs to the data root
  - data root tuple proof to the data root tuple

Once these are valid, the rollup contract can proceed to parse the share and verify the contested claim.

Note: **Generating/verifying share commitment proofs is still not supported.
It still needs tooling to generate the proofs on the node side, and verifying them on the Solidity side.
Thus, the [sequence of spans](#optimistic-rollups-that-uses-a-sequence-of-spans) approach is preferable at the moment.**

## Zk-Rollups

Zk-rollups, aka validity rollups, can also use Celestia as a DA and Blobstream to verify that the data was posted.
However, the submission process is different from the above constructions,
since there are no fraud proofs, and everything should be verified when submitting the headers.

So, when posting to the settlement contract,
the rollup data in Celestia can be referenced either using a `share commitment` or a `sequence of spans`,
and a `height`, similar to the above constructions.

However, as explained above, the share commitment proofs generation/verification is still not supported.
Thus, we will focus on the case where we use a `sequence of spans`.
Check the [Optimistic rollups
that uses a sequence of spans](#optimistic-rollups-that-uses-a-sequence-of-spans) for more information.

So, when submitting the headers to the rollup settlement contract,
the settlement contract will need to verify the following:

- Zk-proof of the state transitions, as traditional zk-rollups do.
- Verify that the `sequence of spans` is valid, i.e., is part of the Celestia block referenced by its height,
  as described in the previous section.
- Zk-proof of the rollup data to the data root tuple root.
  The verification process of this should accept a commitment as input
  so that the contract makes sure it's the correct value that's being saved.
  The commitment can be the data root
  so that when the rollup data is proven inside the circuit, to the data root tuple root,
  the used data root is asserted to be the input one.
  Then, this same data root is used as part of the `sequence of spans` verification.

Once these are valid, the settlement contract can be sure that the state transitions are valid,
and the data was posted to Celestia.
