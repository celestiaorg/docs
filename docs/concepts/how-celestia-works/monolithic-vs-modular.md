---
sidebar_label: Monolithic vs. modular blockchains
---

# Monolithic vs. modular blockchains

Blockchains instantiate [replicated state machines](https://dl.acm.org/doi/abs/10.1145/98163.98167):
the nodes in a permissionless distributed network apply an ordered sequence
of deterministic transactions to an initial state resulting in a common
final state. This means blockchains require the following four functions:

- __Execution__ entails executing transactions that update the state correctly.
    Thus, execution must ensure that only valid transactions are executed, i.e.,
    transactions that result in valid state machine transitions.
- __Settlement__ entails an environment for execution layers to verify proofs,
    resolve fraud disputes, and bridge between other execution layers.
- __Consensus__ entails agreeing on the order of the transactions.
- __Data Availability__ (DA) entails making the transaction data available.
    Note that execution, settlement, and consensus require DA.

Traditional blockchains, i.e. _monolithic blockchains_, implement all four
functions together in a single base consensus layer. The problem with
monolithic blockchains is that the consensus layer must perform a lot of
different tasks and it cannot be optimized for only one of these functions.
As a result, the monolithic paradigm limits the throughput of the system.

![Modular VS Monolithic](/img/concepts/monolithic-modular.png)

As a solution, modular blockchains decouple these functions among
multiple specialized layers as part of a modular stack. Due to the
flexibility that specialization provides, there are many possibilities
in which that stack can be arranged. For example, one such arrangement
is the separation of the four functions into three specialized layers.

The base layer consists of DA and consensus and thus, is referred to
as the Consensus and DA layer (or for brevity, the DA layer), while both
settlement and execution are moved on top in their own layers. As a result,
every layer can be specialized to optimally perform only its function and thus,
increase the throughput of the system. Furthermore, this modular paradigm
enables multiple execution layers, i.e.,
[rollups](https://vitalik.ca/general/2021/01/05/rollup.html), to use the
same settlement and DA layers.
