---
sidebar_label: Introduction
---

# Introduction

Celestia is a modular blockchain network whose goal is to build a scalable
[data availability layer](https://blog.celestia.org/celestia-a-scalable-general-purpose-data-availability-layer-for-decentralized-apps-and-trust-minimized-sidechains),
 enabling the next generation of scalable blockchain architectures -
[modular blockchains](https://celestia.org/learn). Celestia scales by
[decoupling execution from consensus](https://arxiv.org/abs/1905.09274) and
introducing a new primitive,
[data availability sampling](https://arxiv.org/abs/1809.09044).

The former entails that Celestia is only responsible for ordering
transactions and guaranteeing their data availability; this is
similar to [reducing consensus to atomic broadcast](https://en.wikipedia.org/wiki/Atomic_broadcast#Equivalent_to_Consensus).

The latter provides an efficient solution to the
[data availability problem](https://coinmarketcap.com/alexandria/article/what-is-data-availability)
by only requiring resource-limited light nodes to sample a
small number of random chunks from each block to verify data availability.

Interestingly, more light nodes that participate in sampling
increases the amount of data that the network can safely handle,
enabling the block size to increase without equally increasing the
cost to verify the chain.
