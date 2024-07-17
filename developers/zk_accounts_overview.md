---
description: Overview of ZK Accounts
---

# Overview of ZK Accounts

## Overview

In order to achieve ["functional escape velocity"](https://vitalik.eth.limo/general/2019/12/26/mvb.html) (i.e. in order to support non-trivial L2s), a blockchain must be sufficiently expressive. While it was previously assumed that a blockchain would have to provide general _execution_ to meet the bar for sufficient expressivity, ZK proofs—also known as validity proofs—loosen this requirement. Using such systems, a blockchain only needs to provide _verification_ of ZK proofs.

## Background

Popularized with [Ethereum's account model](https://ethereum.org/en/whitepaper/#ethereum-accounts), transactions on blockchains with general execution have traditionally required only the following for spending from an account (equivalently, transaction validity):

1. Correct account nonce (or other replay protection mechanism), and
1. Sufficient account balance to pay fees and send funds, and
1. Valid digital signature based on the account's public key.

This is as opposed to Bitcoin, which allows [limited scripting](https://ethereum.org/en/whitepaper/#scripting) in the form of stateless predicates to control spending UTXOs. The lack of flexibility in the traditional account model signficantly restricts users' ability to define conditions under which their accounts can be used; infamously, native multisigs are not possible on Ethereum. Some account-based blockchain, such as those based on the Cosmos SDK, can support [additional functionality natively](https://github.com/cosmos/cosmos-sdk/tree/main/x) such as multisig accounts or vesting accounts, however each such feature needs to be enshrined individually.

ZK proofs can provide the best of both worlds: expressive account control without individual enshrinement into the protocol.

## Protocol Sketch

A sketch of a ZK account protocol is actually surpisingly simple. A ZK account is a special account type in the Celestia state machine that is associated with a _verification key_, which uniquely represents a program whose execution over inputs can be verified. The program is entirely determined by the user, and does not require specific enshrinement in the Celestia state machine.

Spending from the ZK account (equivalently, advancing the state of the ZK account) is done through a transaction that provides a proof against the current ZK account state. If the proof is correctly verified, the funds of the account are unlocked and spendable as defined in the transaction. Inputs to the proof verifier depend on the specific application of the ZK account (detailed in the following section), which can be defined at account creation time or at transaction sending time. In the simplest form, inputs could be a public key and a nonce—sufficiency of TIA balance would have to be enforced by the Celestia state machine.

## Applications of ZK Accounts

The protocol sketch in the previous section allows for conditional simple transfers, but not much more on its own. Significant additional functionality can be enabled by enshrining a small amount of additional logic, described non-exhaustively in this section.

### Account Abstraction

While the protocol sketch is a form of account abstraction in that conditions for spending from a ZK account can be set by the user, this abstraction is only of limited use if the ZK account cannot interact with any other account. As an addition to the protocol sketch, we can allow messages from _other_ accounts as inputs to the verifier. This would enable ZK accounts to delegate restricted or unrestricted control over spending to another account.

Restricted control could be useful in the case of two ZK rollups bridging atomically through the Celestia state machine in a single Celestia transaction. The first rollup could withdraw tokens from its ZK account, which then get sent via a message to the second rollup, and ingested into the second rollup's ZK account. Rollup bridging is described in more detail in [Lazybridging](#lazybridging).

Unrestricted control could be useful to delegate control of an account to another account. This has applications with [keystore rollups](#keystore-rollups).

### Upgrades

The verification key associated with a ZK account does not need to be fixed at account creation time. Borrowing a playbook from account abstraction, each ZK account can instead store its verification key as mutable. A specific execution path of the verifier can trigger an upgrade, which can either be from posting a valid proof to the ZK account itself, or from another account entirely. The upgrade would change the verification key, potentially arbitrarily, essentially changing the program controlling spending of the ZK account. In the context of a ZK rollup, this would mean upgrading the execution logic of the rollup.

### Lazybridging

> "Lazybridging is a lifestyle."

Lazybriding is an extension to base ZK account functionality that allows for trust-minimized two-way bridges between the Celestia state machine and rollups (for both TIA and arbitrary tokens potentially), and incoming bridging of assets from non-IBC external chains. The extension is another execution path of the verifier that can trigger the unlocking of specific account funds to be spent from the ZK account, rather than the entirety of the account funds as with the protocol sketch.

For rollups (both ZK and optimistic), lazybriding is implemented as two components working in unison: one in the Celestia state machine as described above, and one in the rollup's state transition function. For example, the rollup can have an enshrined transaction type or an enshrined smart contract that can burn assets on the rollup, triggering the withdrawal of those assets from the associated ZK account on Celestia.

Another form of lazybriding is relaying assets from non-IBC chains, such as Ethereum. In this scheme, the ZK account would verify the correctness of the remote chain's consensus and some subset of its state transition (e.g. just the logs for an EVM chain). In other words, it does not require the remote chain to opt-in to using Celestia for data availability.

### Keystore Rollups

Finally, a [keystore rollup](https://notes.ethereum.org/@vbuterin/minimal_keystore_rollup) is a rollup which abstracts mutable user public keys behind unique immutable identifiers. The identifiers then control the assets, rather than the public keys. When combined with account abstraction, this allows keystore rollup accounts to control both other accounts in the Celestia state machine and other rollups that use ZK accounts.

## Follow the Development of ZK Accounts

### Working Group and CIP

A working group for designing and implementing ZK accounts meets every two weeks: [Zero Knowledge in the Celestia Baselayer](https://forum.celestia.org/t/zero-knowledge-in-the-celestia-baselayer/1475). A [work-in-progress CIP](https://github.com/celestiaorg/CIPs/pull/91) is also available, with [call recordings](https://github.com/celestiaorg/CIPs/tree/main/wgs/zk) and additional resources.

### Content

- Initial proposal: [Achieving base layer functionality escape velocity without on-chain smart contracts, using sovereign ZK rollups](https://forum.celestia.org/t/achieving-base-layer-functionality-escape-velocity-without-on-chain-smart-contracts-using-sovereign-zk-rollups/958)
- Proposed designs: [Celestia Snark Accounts Design Spec](https://forum.celestia.org/t/celestia-snark-accounts-design-spec/1639)
- Discussion on inputs: [Public Inputs for SNARK Accounts](https://github.com/celestiaorg/celestia-app/discussions/2902)
- Talk: [ZK Accounts on Celestia](https://www.youtube.com/watch?v=SrZ9Ux2Ktt8)
- Podcast: [How ZK Accounts Expand dApp Limits](https://www.youtube.com/watch?v=VMmI77qcLyg)
