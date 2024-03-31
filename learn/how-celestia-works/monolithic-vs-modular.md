---
description: Comparison between monolithic and modular blockchains.
---

# Monolithic vs. modular blockchains

Blockchains instantiate [replicated state machines](https://dl.acm.org/doi/abs/10.1145/98163.98167):
the nodes in a permissionless distributed network apply an ordered sequence
of deterministic transactions to an initial state resulting in a common
final state.

In other words, this means that nodes in a network all follow
the same set of rules (_i.e._, an ordered sequence of transactions) to go from a
starting point (_i.e._, an initial state) to an ending point
(_i.e._, a common final state). This process ensures that all
nodes in the network agree on the final state
of the blockchain, even though they operate independently.

This means blockchains
require the following four functions:

- **Execution** entails executing transactions that update the state correctly.
  Thus, execution must ensure that only valid transactions are executed, _i.e._,
  transactions that result in valid state machine transitions.
- **Settlement** entails an environment for execution layers to verify proofs,
  resolve fraud disputes, and bridge between other execution layers.
- **Consensus** entails agreeing on the order of the transactions.
- **Data Availability** (DA) entails making the transaction data available.
  Note that execution, settlement, and consensus require DA.

Traditional blockchains, _i.e._ _monolithic blockchains_, implement all four
functions together in a single base consensus layer. The problem with
monolithic blockchains is that the consensus layer must perform numerous
different tasks, and it cannot be optimized for only one of these functions.
As a result, the monolithic paradigm limits the throughput of the system.

![Modular VS Monolithic](/img/learn/monolithic-modular.png)

As a solution, modular blockchains decouple these functions among
multiple specialized layers as part of a modular stack. Due to the
flexibility that specialization provides, there are many possibilities
in which that stack can be arranged. For example, one such arrangement
is the separation of the four functions into three specialized layers.

The base layer consists of DA and consensus and thus, is referred to
as the Consensus and DA layer (or for brevity, the DA layer), while both
settlement and execution are moved on top in their own layers. As a result,
every layer can be specialized to optimally perform only its function, and thus,
increase the throughput of the system. Furthermore, this modular paradigm
enables multiple execution layers, _i.e._,
[rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html), to use the
same settlement and DA layers.
