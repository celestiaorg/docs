---
sidebar_label: Integrating Celestia
---

# Integrating Celestia

## Celestia Service Provider Notes

Celestia is a fairly standard cosmos-sdk based chain. We use the latest version of tendermint and the cosmos-sdk, with only minor modifications to each. This means that we are:

- Using the default cosmos-sdk modules: auth, bank, distribution, staking, slashing, mint, crisis, ibchost, genutil, evidence, ibctransfer, params, gov (limited in some TBD capacities), upgrade, vesting, feegrant, capability, and payment.
- Use the standard digital keys schemes provided by the cosmos-sdk and tendermint, those being secp256k1 for user transactions, and tm-ed25519 for signing and verifying consensus messages.

While exactly which modules used is subject to change, Celestia aims to be as minimal as possible.

### Custody and Key Management

Celestia supports many already existing key management systems, as we rely on the cosmos-sdk and tendermint libraries for signing and verifying transactions. [Cosmos-sdk documentation](https://docs.cosmos.network/master/basics/accounts.html#keys-accounts-addresses-and-signatures)

### RPC and Querying

Only the standard RPC endpoints for tendermint and the cosmos-sdk are exposed, we do not currently add or subtract any core functionality, but this could change in the future. The same goes for querying data from the chain.

### Compatibility

Linux, particularly ubuntu 20.04 LTS, is the most well tested. Potentially compatible with other OSs, but they are currently untested. Some of the cryptography libraries used for erasure data are not guaranteed to work on other platforms.

### Syncing

Since we utilize tendermint and the cosmos-sdk, syncing the chain can be performed by any method that is supported by those libraries. This includes fast-sync, state sync, and quick sync.

### Notable exceptions relative to other blockchains

Relative to other tendermint based chains, Celestia will have significantly longer blocktimes of around 60 seconds. The reason behind this block time is to optimize the bandwidth used by light clients that are sampling the chain, and is not because we have modified tendermint consensus in any meaningful way. Validators will likely download/upload relatively large blocks. It should be noted that while these blocks are large, very little typical blockchain state execution is actually occurring on Celestia. Meaning that the bandwidth requirements will likely be larger than that of a typical cosmos-sdk based blockchain full node, the computing requirements should be similar in magnitude.
