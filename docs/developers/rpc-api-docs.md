---
    title: undefined
---
- [daser.SamplingStats](#daserSamplingStats): SamplingStats returns the current statistics over the DA sampling process.

- [daser.WaitCatchUp](#daserWaitCatchUp): WaitCatchUp blocks until DASer finishes catching up to the network head.

- [fraud.Get](#fraudGet): Get fetches fraud proofs from the disk by its type.

- [fraud.Subscribe](#fraudSubscribe): Subscribe allows to subscribe on a Proof pub sub topic by its type.

- [header.GetByHash](#headerGetByHash): GetByHash returns the header of the given hash from the node's header store.

- [header.GetByHeight](#headerGetByHeight): GetByHeight returns the ExtendedHeader at the given height, blocking
until header has been processed by the store or context deadline is exceeded.

- [header.GetVerifiedRangeByHeight](#headerGetVerifiedRangeByHeight): GetVerifiedRangeByHeight returns the given range [from:to) of ExtendedHeaders
from the node's header store and verifies that the returned headers are
adjacent to each other.

- [header.LocalHead](#headerLocalHead): LocalHead returns the ExtendedHeader of the chain head.

- [header.NetworkHead](#headerNetworkHead): NetworkHead provides the Syncer's view of the current network head.

- [header.Subscribe](#headerSubscribe): Subscribe to recent ExtendedHeaders from the network.

- [header.SyncState](#headerSyncState): SyncState returns the current state of the header Syncer.

- [header.SyncWait](#headerSyncWait): SyncWait blocks until the header Syncer is synced to network head.

- [node.AuthNew](#nodeAuthNew): AuthNew signs and returns a new token with the given permissions.

- [node.AuthVerify](#nodeAuthVerify): AuthVerify returns the permissions assigned to the given token.

- [node.Info](#nodeInfo): Info returns administrative information about the node.

- [node.LogLevelSet](#nodeLogLevelSet): LogLevelSet sets the given component log level to the given level.

- [p2p.BandwidthForPeer](#p2pBandwidthForPeer): BandwidthForPeer returns a Stats struct with bandwidth metrics associated with the given peer.ID.
The metrics returned include all traffic sent / received for the peer, regardless of protocol.

- [p2p.BandwidthForProtocol](#p2pBandwidthForProtocol): BandwidthForProtocol returns a Stats struct with bandwidth metrics associated with the given
protocol.ID.

- [p2p.BandwidthStats](#p2pBandwidthStats): BandwidthStats returns a Stats struct with bandwidth metrics for all
data sent/received by the local peer, regardless of protocol or remote
peer IDs.

- [p2p.BlockPeer](#p2pBlockPeer): BlockPeer adds a peer to the set of blocked peers.

- [p2p.ClosePeer](#p2pClosePeer): ClosePeer closes the connection to a given peer.

- [p2p.Connect](#p2pConnect): Connect ensures there is a connection between this host and the peer with
given peer.

- [p2p.Connectedness](#p2pConnectedness): Connectedness returns a state signaling connection capabilities.

- [p2p.Info](#p2pInfo): Info returns address information about the host.

- [p2p.IsProtected](#p2pIsProtected): IsProtected returns whether the given peer is protected.

- [p2p.ListBlockedPeers](#p2pListBlockedPeers): ListBlockedPeers returns a list of blocked peers.

- [p2p.NATStatus](#p2pNATStatus): NATStatus returns the current NAT status.

- [p2p.PeerInfo](#p2pPeerInfo): PeerInfo returns a small slice of information Peerstore has on the
given peer.

- [p2p.Peers](#p2pPeers): Peers returns connected peers.

- [p2p.Protect](#p2pProtect): Protect adds a peer to the list of peers who have a bidirectional
peering agreement that they are protected from being trimmed, dropped
or negatively scored.

- [p2p.PubSubPeers](#p2pPubSubPeers): PubSubPeers returns the peer IDs of the peers joined on
the given topic.

- [p2p.ResourceState](#p2pResourceState): ResourceState returns the state of the resource manager.

- [p2p.UnblockPeer](#p2pUnblockPeer): UnblockPeer removes a peer from the set of blocked peers.

- [p2p.Unprotect](#p2pUnprotect): Unprotect removes a peer from the list of peers who have a bidirectional
peering agreement that they are protected from being trimmed, dropped
or negatively scored, returning a bool representing whether the given
peer is protected or not.

- [share.GetEDS](#shareGetEDS): GetEDS gets the full EDS identified by the given root.

- [share.GetShare](#shareGetShare): GetShare gets a Share by coordinates in EDS.

- [share.GetSharesByNamespace](#shareGetSharesByNamespace): GetSharesByNamespace gets all shares from an EDS within the given namespace.
Shares are returned in a row-by-row order if the namespace spans multiple rows.

- [share.ProbabilityOfAvailability](#shareProbabilityOfAvailability): ProbabilityOfAvailability calculates the probability of the data square
being available based on the number of samples collected.

- [share.SharesAvailable](#shareSharesAvailable): SharesAvailable subjectively validates if Shares committed to the given Root are available on
the Network.

- [state.AccountAddress](#stateAccountAddress): AccountAddress retrieves the address of the node's account/signer

- [state.Balance](#stateBalance): Balance retrieves the Celestia coin balance for the node's account/signer
and verifies it against the corresponding block's AppHash.

- [state.BalanceForAddress](#stateBalanceForAddress): BalanceForAddress retrieves the Celestia coin balance for the given address and verifies
the returned balance against the corresponding block's AppHash.

NOTE: the balance returned is the balance reported by the block right before
the node's current head (head-1). This is due to the fact that for block N, the block's
`AppHash` is the result of applying the previous block's transaction list.

- [state.BeginRedelegate](#stateBeginRedelegate): BeginRedelegate sends a user's delegated tokens to a new validator for redelegation.

- [state.CancelUnbondingDelegation](#stateCancelUnbondingDelegation): CancelUnbondingDelegation cancels a user's pending undelegation from a validator.

- [state.Delegate](#stateDelegate): Delegate sends a user's liquid tokens to a validator for delegation.

- [state.IsStopped](#stateIsStopped): IsStopped checks if the Module's context has been stopped

- [state.QueryDelegation](#stateQueryDelegation): QueryDelegation retrieves the delegation information between a delegator and a validator.

- [state.QueryRedelegations](#stateQueryRedelegations): QueryRedelegations retrieves the status of the redelegations between a delegator and a validator.

- [state.QueryUnbonding](#stateQueryUnbonding): QueryUnbonding retrieves the unbonding status between a delegator and a validator.

- [state.SubmitPayForBlob](#stateSubmitPayForBlob): SubmitPayForBlob builds, signs and submits a PayForBlob transaction.

- [state.SubmitTx](#stateSubmitTx): SubmitTx submits the given transaction/message to the
Celestia network and blocks until the tx is included in
a block.

- [state.Transfer](#stateTransfer): Transfer sends the given amount of coins from default wallet of the node to the given account
address.

- [state.Undelegate](#stateUndelegate): Undelegate undelegates a user's delegated tokens, unbonding them from the current validator.


---



## `daser.SamplingStats`

Auth level: read

### Parameters

None required

### Result: `das.SamplingStats`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| catch_up_done | boolean | - | - |
| concurrency | integer | - | - |
| failed | object | - | - |
| head_of_catchup | integer | - | - |
| head_of_sampled_chain | integer | - | - |
| is_running | boolean | - | - |
| network_head_height | integer | - | - |
| workers | array | - | - |



---


## `daser.WaitCatchUp`

Auth level: read

### Parameters

None required

### Result: `Null`



---


## `fraud.Get`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **proofType** | string | fraud.ProofType |

### Result: `[]Proof`



---


## `fraud.Subscribe`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **proofType** | string | fraud.ProofType |

### Result: `<-chan Proof`



---


## `header.GetByHash`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **hash** | array | libhead.Hash |

### Result: `*header.ExtendedHeader`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| commit | object | - | - |
| dah | object | - | - |
| header | object | - | - |
| validator_set | object | - | - |



---


## `header.GetByHeight`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **u** | integer | uint64 |

### Result: `*header.ExtendedHeader`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| commit | object | - | - |
| dah | object | - | - |
| header | object | - | - |
| validator_set | object | - | - |



---


## `header.GetVerifiedRangeByHeight`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **from** | object | *header.ExtendedHeader<br /><br /><br /><br /><br /> |
| **to** | integer | uint64 |

### Result: `[]*header.ExtendedHeader`



---


## `header.LocalHead`

Auth level: read

### Parameters

None required

### Result: `*header.ExtendedHeader`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| commit | object | - | - |
| dah | object | - | - |
| header | object | - | - |
| validator_set | object | - | - |



---


## `header.NetworkHead`

Auth level: public

### Parameters

None required

### Result: `*header.ExtendedHeader`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| commit | object | - | - |
| dah | object | - | - |
| header | object | - | - |
| validator_set | object | - | - |



---


## `header.Subscribe`

Auth level: public

### Parameters

None required

### Result: `<-chan *header.ExtendedHeader`



---


## `header.SyncState`

Auth level: read

### Parameters

None required

### Result: `sync.State`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| End | string | - | - |
| Error |  | - | - |
| FromHash | array | - | - |
| FromHeight | integer | - | - |
| Height | integer | - | - |
| ID | integer | - | - |
| Start | string | - | - |
| ToHash | array | - | - |
| ToHeight | integer | - | - |



---


## `header.SyncWait`

Auth level: read

### Parameters

None required

### Result: `Null`



---


## `node.AuthNew`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **perms** | array | []auth.Permission |

### Result: `[]byte`



---


## `node.AuthVerify`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | string |

### Result: `[]auth.Permission`



---


## `node.Info`

Auth level: admin

### Parameters

None required

### Result: `Info`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| api_version | string | - | - |
| type | integer | - | - |



---


## `node.LogLevelSet`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **name** | string | string |
| **level** | string | string |

### Result: `Null`



---


## `p2p.BandwidthForPeer`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |

### Result: `metrics.Stats`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| RateIn | number | - | - |
| RateOut | number | - | - |
| TotalIn | integer | - | - |
| TotalOut | integer | - | - |



---


## `p2p.BandwidthForProtocol`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **proto** | string | protocol.ID |

### Result: `metrics.Stats`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| RateIn | number | - | - |
| RateOut | number | - | - |
| TotalIn | integer | - | - |
| TotalOut | integer | - | - |



---


## `p2p.BandwidthStats`

Auth level: admin

### Parameters

None required

### Result: `metrics.Stats`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| RateIn | number | - | - |
| RateOut | number | - | - |
| TotalIn | integer | - | - |
| TotalOut | integer | - | - |



---


## `p2p.BlockPeer`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **p** | string | peer.ID |

### Result: `Null`



---


## `p2p.ClosePeer`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |

### Result: `Null`



---


## `p2p.Connect`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **pi** | object | peer.AddrInfo<br /><br /><br /> |

### Result: `Null`



---


## `p2p.Connectedness`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |

### Result: `network.Connectedness`



---


## `p2p.Info`

Auth level: admin

### Parameters

None required

### Result: `peer.AddrInfo`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| Addrs | array | - | - |
| ID | string | - | - |



---


## `p2p.IsProtected`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |
| **tag** | string | string |

### Result: `bool`



---


## `p2p.ListBlockedPeers`

Auth level: admin

### Parameters

None required

### Result: `[]peer.ID`



---


## `p2p.NATStatus`

Auth level: admin

### Parameters

None required

### Result: `network.Reachability`



---


## `p2p.PeerInfo`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |

### Result: `peer.AddrInfo`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| Addrs | array | - | - |
| ID | string | - | - |



---


## `p2p.Peers`

Auth level: admin

### Parameters

None required

### Result: `[]peer.ID`



---


## `p2p.Protect`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |
| **tag** | string | string |

### Result: `Null`



---


## `p2p.PubSubPeers`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **topic** | string | string |

### Result: `[]peer.ID`



---


## `p2p.ResourceState`

Auth level: admin

### Parameters

None required

### Result: `rcmgr.ResourceManagerStat`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| Peers | object | - | - |
| Protocols | object | - | - |
| Services | object | - | - |
| System | object | - | - |
| Transient | object | - | - |



---


## `p2p.UnblockPeer`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **p** | string | peer.ID |

### Result: `Null`



---


## `p2p.Unprotect`

Auth level: admin

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **id** | string | peer.ID |
| **tag** | string | string |

### Result: `bool`



---


## `share.GetEDS`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **root** | object | *share.Root<br /><br /><br /> |

### Result: `*rsmt2d.ExtendedDataSquare`



---


## `share.GetShare`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **dah** | object | *share.Root<br /><br /><br /> |
| **row** | integer | int |
| **col** | integer | int |

### Result: `share.Share`



---


## `share.GetSharesByNamespace`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **root** | object | *share.Root<br /><br /><br /> |
| **namespace** | array | namespace.ID |

### Result: `share.NamespacedShares`



---


## `share.ProbabilityOfAvailability`

Auth level: public

### Parameters

None required

### Result: `float64`



---


## `share.SharesAvailable`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **root** | object | *share.Root<br /><br /><br /> |

### Result: `Null`



---


## `state.AccountAddress`

Auth level: read

### Parameters

None required

### Result: `state.Address`



---


## `state.Balance`

Auth level: read

### Parameters

None required

### Result: `*state.Balance`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| amount | object | - | - |
| denom | string | - | - |



---


## `state.BalanceForAddress`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **addr** | undefined | state.Address |

### Result: `*state.Balance`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| amount | object | - | - |
| denom | string | - | - |



---


## `state.BeginRedelegate`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **srcValAddr** | array | state.ValAddress |
| **dstValAddr** | array | state.ValAddress |
| **amount** | object | state.Int |
| **fee** | object | state.Int |
| **gasLim** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.CancelUnbondingDelegation`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **valAddr** | array | state.ValAddress |
| **amount** | object | state.Int |
| **height** | object | state.Int |
| **fee** | object | state.Int |
| **gasLim** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.Delegate`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **delAddr** | array | state.ValAddress |
| **amount** | object | state.Int |
| **fee** | object | state.Int |
| **gasLim** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.IsStopped`

Auth level: public

### Parameters

None required

### Result: `bool`



---


## `state.QueryDelegation`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **valAddr** | array | state.ValAddress |

### Result: `*types.QueryDelegationResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| delegation_response | object | - | - |



---


## `state.QueryRedelegations`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **srcValAddr** | array | state.ValAddress |
| **dstValAddr** | array | state.ValAddress |

### Result: `*types.QueryRedelegationsResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| pagination | object | - | - |
| redelegation_responses | array | - | - |



---


## `state.QueryUnbonding`

Auth level: public

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **valAddr** | array | state.ValAddress |

### Result: `*types.QueryUnbondingDelegationResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| unbond | object | - | - |



---


## `state.SubmitPayForBlob`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **nID** | array | namespace.ID |
| **data** | string | []byte |
| **fee** | object | state.Int |
| **gasLim** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.SubmitTx`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **tx** | array | state.Tx |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.Transfer`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **to** | array | state.AccAddress |
| **amount** | object | state.Int |
| **fee** | object | state.Int |
| **gasLimit** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |



---


## `state.Undelegate`

Auth level: write

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **delAddr** | array | state.ValAddress |
| **amount** | object | state.Int |
| **fee** | object | state.Int |
| **gasLim** | integer | uint64 |

### Result: `*state.TxResponse`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| code | integer | - | - |
| codespace | string | - | - |
| data | string | - | - |
| events | array | - | - |
| gas_used | integer | - | - |
| gas_wanted | integer | - | - |
| height | integer | - | - |
| info | string | - | - |
| logs | array | - | - |
| raw_log | string | - | - |
| timestamp | string | - | - |
| tx | object | - | - |
| txhash | string | - | - |
