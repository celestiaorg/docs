# Fraud Proofs of Incorrectly Extended Data
<!-- markdownlint-disable MD013 -->

The requirement of downloading the 4k intermediate Merkle roots is a consequence of using a 2-dimensional Reed-Solomon encoding scheme. Alternatively, DAS could be designed with a standard (i.e., 1-dimensional) Reed-Solomon encoding, where the original data is split into k  chunks and extended with k additional chunks of parity data. Since the block data commitment is the Merkle root of the 2k resulting data chunks, light nodes no longer need to download O(n ) bytes to validate block headers.

The downside of the standard Reed-Solomon encoding is dealing with malicious block producers that generate the extended data incorrectly.

This is possible as __Celestia does not require a majority of the consensus (i.e., block producers) to be honest to guarantee data availability.__ Thus, if the extended data is invalid, the original data might not be recoverable, even if the light nodes are sampling sufficient unique chunks (i.e., at least k for a standard encoding and k × k for a 2-dimensional encoding).

As a solution, _Fraud Proofs of Incorrectly Generated Extended Data_ enable light nodes to reject blocks with invalid extended data. Such proofs require reconstructing the encoding and verifying the mismatch. With standard Reed-Solomon encoding, this entails downloading the original data, i.e., O(n) bytes. Contrastingly, with 2-dimensional Reed-Solomon encoding, only O(n ) bytes are required as it is sufficient to verify only one row or one column of the extended matrix.
