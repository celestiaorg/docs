# Node API OpenRPC latest reference

> Auto-generated. Do not edit manually. Regenerate with `npm run generate:node-api-skill-ref`.

## Snapshot

- Generated at: 2026-02-25T22:51:47.781Z
- OpenRPC version: v0.28.4
- Source file: `public/specs/openrpc-v0.28.4.json`
- Method count: 79

## Auth counts

- `admin`: 26
- `read`: 42
- `write`: 11

## Transaction submission methods

- `blob.Submit` (write)
  - summary: Submit sends Blobs and reports the height in which they were included. Allows sending multiple Blobs atomically synchronously. Uses default wallet registered on the Node.
  - params: blobs, options
  - result: uint64
- `da.Submit` (write)
  - summary: Submit submits the Blobs to Data Availability layer. This method is synchronous. Upon successful submission to Data Availability layer, it returns the IDs identifying blobs in DA. Deprecated: This method is deprecated and will be removed in the future.
  - params: blobs, gasPrice, ns
  - result: []da.ID
  - note: marked deprecated in spec
- `da.SubmitWithOptions` (write)
  - summary: SubmitWithOptions submits the Blobs to Data Availability layer. This method is synchronous. Upon successful submission to Data Availability layer, it returns the IDs identifying blobs in DA. Deprecated: This method is deprecated and will be removed in the future.
  - params: blobs, gasPrice, ns, options
  - result: []da.ID
  - note: marked deprecated in spec
- `state.SubmitPayForBlob` (write)
  - summary: SubmitPayForBlob builds, signs and submits a PayForBlob transaction.
  - params: blobs, config
  - result: *state.TxResponse

## Methods by package

### blob (7)

- `blob.Get` [read]
  - Get retrieves the blob by commitment under the given namespace and height.
- `blob.GetAll` [read]
  - GetAll returns all blobs under the given namespaces at the given height. If all blobs were found without any errors, the user will receive a list of blobs. If the BlobService couldn't find any blobs under the requested namespaces, the user will receive an empty list of blobs along with an empty error. If some of the requested namespaces were not found, the user will receive all the found blobs and an empty error. If there were internal errors during some of the requests, the user will receive all found blobs along with a combined error message. All blobs will preserve the order of the namespaces that were requested.
- `blob.GetCommitmentProof` [read]
  - GetCommitmentProof generates a commitment proof for a share commitment.
- `blob.GetProof` [read]
  - GetProof retrieves proofs in the given namespaces at the given height by commitment.
- `blob.Included` [read]
  - Included checks whether a blob's given commitment(Merkle subtree root) is included at given height and under the namespace.
- `blob.Submit` [write]
  - Submit sends Blobs and reports the height in which they were included. Allows sending multiple Blobs atomically synchronously. Uses default wallet registered on the Node.
- `blob.Subscribe` [read]
  - Subscribe to published blobs from the given namespace as they are included.

### blobstream (2)

- `blobstream.GetDataRootTupleInclusionProof` [read]
  - GetDataRootTupleInclusionProof creates an inclusion proof, for the data root tuple of block height `height`, in the set of blocks defined by `start` and `end`. The range is end exclusive. It's in the header module because it only needs access to the headers to generate the proof.
- `blobstream.GetDataRootTupleRoot` [read]
  - GetDataRootTupleRoot collects the data roots over a provided ordered range of blocks, and then creates a new Merkle root of those data roots. The range is end exclusive. It's in the header module because it only needs access to the headers to generate the proof.

### da (8)

- `da.Commit` [read]
  - Commit creates a Commitment for each given Blob. Deprecated: This method is deprecated and will be removed in the future.
- `da.Get` [read]
  - Get returns Blob for each given ID, or an error. Error should be returned if ID is not formatted properly, there is no Blob for given ID or any other client-level error occurred (dropped connection, timeout, etc). Deprecated: This method is deprecated and will be removed in the future.
- `da.GetIDs` [read]
  - GetIDs returns IDs of all Blobs located in DA at given height. Deprecated: This method is deprecated and will be removed in the future.
- `da.GetProofs` [read]
  - GetProofs returns inclusion Proofs for Blobs specified by their IDs. Deprecated: This method is deprecated and will be removed in the future.
- `da.MaxBlobSize` [read]
  - MaxBlobSize returns the max blob size Deprecated: This method is deprecated and will be removed in the future.
- `da.Submit` [write]
  - Submit submits the Blobs to Data Availability layer. This method is synchronous. Upon successful submission to Data Availability layer, it returns the IDs identifying blobs in DA. Deprecated: This method is deprecated and will be removed in the future.
- `da.SubmitWithOptions` [write]
  - SubmitWithOptions submits the Blobs to Data Availability layer. This method is synchronous. Upon successful submission to Data Availability layer, it returns the IDs identifying blobs in DA. Deprecated: This method is deprecated and will be removed in the future.
- `da.Validate` [read]
  - Validate validates Commitments against the corresponding Proofs. This should be possible without retrieving the Blobs. Deprecated: This method is deprecated and will be removed in the future.

### das (2)

- `das.SamplingStats` [read]
  - SamplingStats returns the current statistics over the DA sampling process.
- `das.WaitCatchUp` [read]
  - WaitCatchUp blocks until DASer finishes catching up to the network head.

### fraud (2)

- `fraud.Get` [read]
  - Get fetches fraud proofs from the disk by its type.
- `fraud.Subscribe` [read]
  - Subscribe allows to subscribe on a Proof pub sub topic by its type.

### header (10)

- `header.GetByHash` [read]
  - GetByHash returns the header of the given hash from the node's header store.
- `header.GetByHeight` [read]
  - GetByHeight returns the ExtendedHeader at the given height if it is currently available.
- `header.GetRangeByHeight` [read]
  - GetRangeByHeight returns the given range (from:to) of ExtendedHeaders from the node's header store and verifies that the returned headers are adjacent to each other.
- `header.LocalHead` [read]
  - LocalHead returns the ExtendedHeader of the chain head.
- `header.NetworkHead` [read]
  - NetworkHead provides the Syncer's view of the current network head.
- `header.Subscribe` [read]
  - Subscribe to recent ExtendedHeaders from the network.
- `header.SyncState` [read]
  - SyncState returns the current state of the header Syncer.
- `header.SyncWait` [read]
  - SyncWait blocks until the header Syncer is synced to network head.
- `header.Tail` [read]
  - Tail reports current tail header of the node. Tail header is the lowest height header known by the running node. Headers with height below Tail are not available to be requested. Subsequently, Shwap data requests for this height are not available as well. NOTE: In future, requests for headers below Tail will be supported by lazily fetching them from the network.
- `header.WaitForHeight` [read]
  - WaitForHeight blocks until the header at the given height has been processed by the store or context deadline is exceeded.

### node (6)

- `node.AuthNew` [admin]
  - AuthNew signs and returns a new token with the given permissions.
- `node.AuthNewWithExpiry` [admin]
  - AuthNewWithExpiry signs and returns a new token with the given permissions and TTL.
- `node.AuthVerify` [admin]
  - AuthVerify returns the permissions assigned to the given token.
- `node.Info` [admin]
  - Info returns administrative information about the node.
- `node.LogLevelSet` [admin]
  - LogLevelSet sets the given component log level to the given level.
- `node.Ready` [read]
  - Ready returns true once the node's RPC is ready to accept requests.

### p2p (21)

- `p2p.BandwidthForPeer` [admin]
  - BandwidthForPeer returns a Stats struct with bandwidth metrics associated with the given peer.ID. The metrics returned include all traffic sent / received for the peer, regardless of protocol.
- `p2p.BandwidthForProtocol` [admin]
  - BandwidthForProtocol returns a Stats struct with bandwidth metrics associated with the given protocol.ID.
- `p2p.BandwidthStats` [admin]
  - BandwidthStats returns a Stats struct with bandwidth metrics for all data sent/received by the local peer, regardless of protocol or remote peer IDs.
- `p2p.BlockPeer` [admin]
  - BlockPeer adds a peer to the set of blocked peers and closes any existing connection to that peer.
- `p2p.ClosePeer` [admin]
  - ClosePeer closes the connection to a given peer.
- `p2p.Connect` [admin]
  - Connect ensures there is a connection between this host and the peer with given peer.
- `p2p.Connectedness` [admin]
  - Connectedness returns a state signaling connection capabilities.
- `p2p.ConnectionState` [admin]
  - ConnectionState returns information about each *active* connection to the peer. NOTE: At most cases there should be only a single connection.
- `p2p.Info` [admin]
  - Info returns address information about the host.
- `p2p.IsProtected` [admin]
  - IsProtected returns whether the given peer is protected.
- `p2p.ListBlockedPeers` [admin]
  - ListBlockedPeers returns a list of blocked peers.
- `p2p.NATStatus` [admin]
  - NATStatus returns the current NAT status.
- `p2p.PeerInfo` [admin]
  - PeerInfo returns a small slice of information Peerstore has on the given peer.
- `p2p.Peers` [admin]
  - Peers returns connected peers.
- `p2p.Ping` [admin]
  - Ping pings the selected peer and returns time it took or error.
- `p2p.Protect` [admin]
  - Protect adds a peer to the list of peers who have a bidirectional peering agreement that they are protected from being trimmed, dropped or negatively scored.
- `p2p.PubSubPeers` [admin]
  - PubSubPeers returns the peer IDs of the peers joined on the given topic.
- `p2p.PubSubTopics` [admin]
  - PubSubTopics reports current PubSubTopics the node participates in.
- `p2p.ResourceState` [admin]
  - ResourceState returns the state of the resource manager.
- `p2p.UnblockPeer` [admin]
  - UnblockPeer removes a peer from the set of blocked peers.
- `p2p.Unprotect` [admin]
  - Unprotect removes a peer from the list of peers who have a bidirectional peering agreement that they are protected from being trimmed, dropped or negatively scored, returning a bool representing whether the given peer is protected or not.

### share (7)

- `share.GetEDS` [read]
  - GetEDS retrieves the complete Extended Data Square (EDS) for the specified height. The EDS contains all shares organized in a 2D matrix format with erasure coding. Returns the full EDS or an error if retrieval fails.
- `share.GetNamespaceData` [read]
  - GetNamespaceData retrieves all shares that belong to the specified namespace within the Extended Data Square (EDS) at the given height. The shares are returned in a row-by-row order, maintaining the original layout if the namespace spans multiple rows. Returns the namespace data or an error if retrieval fails.
- `share.GetRange` [read]
  - GetRange retrieves a range of the *original* shares and their corresponding proofs within a specific namespace in the Extended Data Square (EDS) at the given height. The range is defined by start and end indexes. Returns the range data with proof to the data root or an error if retrieval fails.
- `share.GetRow` [read]
  - GetRow retrieves all shares from a specific row in the Extended Data Square (EDS) at the given height. Returns the complete row of shares or an error if retrieval fails.
- `share.GetSamples` [read]
  - GetSamples retrieves multiple shares from the Extended Data Square (EDS) specified by the header at the given sample coordinates. Returns an array of samples containing the requested shares or an error if retrieval fails.
- `share.GetShare` [read]
  - GetShare retrieves a specific share from the Extended Data Square (EDS) at the given height using its row and column coordinates. Returns the share data or an error if retrieval fails.
- `share.SharesAvailable` [read]
  - SharesAvailable performs a subjective validation to check if the shares committed to the ExtendedHeader at the specified height are available and retrievable from the network. Returns an error if the shares are not available or if validation fails.

### state (14)

- `state.AccountAddress` [read]
  - AccountAddress retrieves the address of the node's account/signer
- `state.Balance` [read]
  - Balance retrieves the Celestia coin balance for the node's account/signer and verifies it against the corresponding block's AppHash.
- `state.BalanceForAddress` [read]
  - BalanceForAddress retrieves the Celestia coin balance for the given address and verifies the returned balance against the corresponding block's AppHash. NOTE: the balance returned is the balance reported by the block right before the node's current head (head-1). This is due to the fact that for block N, the block's `AppHash` is the result of applying the previous block's transaction list.
- `state.BeginRedelegate` [write]
  - BeginRedelegate sends a user's delegated tokens to a new validator for redelegation.
- `state.CancelUnbondingDelegation` [write]
  - CancelUnbondingDelegation cancels a user's pending undelegation from a validator.
- `state.Delegate` [write]
  - Delegate sends a user's liquid tokens to a validator for delegation.
- `state.GrantFee` [write]
  - No comment exists yet for this method.
- `state.QueryDelegation` [read]
  - QueryDelegation retrieves the delegation information between a delegator and a validator.
- `state.QueryRedelegations` [read]
  - QueryRedelegations retrieves the status of the redelegations between a delegator and a validator.
- `state.QueryUnbonding` [read]
  - QueryUnbonding retrieves the unbonding status between a delegator and a validator.
- `state.RevokeGrantFee` [write]
  - No comment exists yet for this method.
- `state.SubmitPayForBlob` [write]
  - SubmitPayForBlob builds, signs and submits a PayForBlob transaction.
- `state.Transfer` [write]
  - Transfer sends the given amount of coins from default wallet of the node to the given account address.
- `state.Undelegate` [write]
  - Undelegate undelegates a user's delegated tokens, unbonding them from the current validator.

