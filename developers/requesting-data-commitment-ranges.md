# Requesting data commitment ranges

To request proofs to be submitted to the Blobstream X contract at a
different cadence, you can do one of the following:

1. [RECOMMENDED] Run the Blobstream X operator with hosted proving, by
   the Succinct platform
   [following these instructions](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#operator-with-hosted-proving)
   . - `.env` 1. `TENDERMINT_RPC_URL` from
   [the public Celestia list](https://docs.celestia.org/nodes/mainnet#consensus-nodes). 2. `SUCCINCT_RPC_URL` = `https://alpha.succinct.xyz/api` 3. Request for `SUCCINCT_API_KEY` from
   [the Succinct team](https://alpha.succinct.xyz/partner). 4. `CHAIN_ID` is the chain ID of the deployed Blobstream X contract. 5. `CONTRACT_ADDRESS`: Blobstream X proxy contract address. 6. `NEXT_HEADER_FUNCTION_ID` & `HEADER_RANGE_FUNCTION_ID`: Get the
   `functionId`'s from the Blobstream X contract by using the
   `nextHeaderFunctionId` and `headerRangeFunctionId` respectively,
   which are public storage variables.
2. [Run the Blobstream X operator with local proving](https://github.com/succinctlabs/blobstreamx?tab=readme-ov-file#local-proving--relaying).
   1. Note: Requires a large cloud machine to run in a reasonable
      amount of time. EC2 r6a.16xlarge takes ~30 minutes to generate a
      header range proof.
3. Directly request a proof via the Blobstream X contract interface.
   Unlike the Blobstream X operator which handles requests off-chain,
   requesting on-chain requires gas, but the proof will be generated
   and relayed by the Succinct platform. 1. Call `requestHeaderRange(uint64 _targetBlock)` with the end
   of the range you want a commitment for. 1. A `DataCommitmentStored(uint256, uint64, uint64, bytes32)`
   will be emitted for the requested range when it is stored in the
   contract. Listen to this event to know that the proof has been
   generated successfully.
