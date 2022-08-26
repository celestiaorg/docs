# Introduction

Traditionally, creating a new blockchain had been a
resource-intensive endeavor, imposing considerable
time and monetary costs. Although blockchains can be
implemented more efficiently now, existing hurdles are
still present that cause friction in the bootstrapping
process. [Modular blockchains](https://celestia.org/glossary/modular-blockchain)
can help facilitate this process while reducing the
friction caused by existing infrastructure.

## Bootstrapping costs

With the rise of SDKs such as the Cosmos SDK and its
corresponding consensus engine Tendermint, new blockchains
can be created and innovated with significant ease
compared to their predecessors. However, limitations
still exist for launching new blockchains, such as
sourcing a secure [https://celestia.org/glossary/validator-set](validator set)
so that the network is resilient to attacks.
These are non-trivial tasks that can pose difficult problems.

The next evolution of blockchain creation will be
enabled by modular architectures. For example, a new
blockchain will be able to be created using an SDK
and will have the ability to immediately utilize
existing modular blockchains. This allows blockchains
to minimally launch by specializing in execution,
outsourcing consensus, and data availability to an
existing layer. Additionally, new blockchains can
make use of settlement layers that launch on top
of data availability layers, giving developers
optionality for their architecture.

Since execution layers don’t require a consensus
mechanism, they need not source a large validator set.
Because of this, new blockchains will be able to
be bootstrapped effortlessly without imposing
considerable time or monetary costs.

## Sovereignty

Blockchains that launch as independent chains have
sovereignty over their environment. This gives
them the right to push upgrades without reliance
on other chains. A [sovereign rollup](https://blog.celestia.org/sovereign-rollup-chains/)
allows its own nodes to determine the
canonical chain and act on its fork choice rule.
The fork choice rule dictates how nodes determin
and detect forks, including agreement on which
is the ‘main’ chain (canonical chain).

![GATSBY_EMPTY_ALT](/img/learn-modular/article-4-image-1.png)

If the sovereign blockchain experiences a
liveness or safety failure that requires a
restart or some type of fork, [social consensus](https://celestia.org/glossary/social-consensus)
can be utilized to restart the chain and
act on decisions independent of outside communities.

Blockchains that aren’t independent, like rollups
on top of settlement layers, don’t retain sovereignty
because they rely on the settlement layer to validate
their transactions, which makes it the arbitrator
of the rollup’s canonical chain. As a result, if
the rollup experiences a liveness or safety failure
that requires social consensus to enact decisions,
the community of the settlement layer dictates that.

Execution layers that deploy natively to a consensus
and data availability layer are sovereign like
independent blockchains while retaining the scalability
that is provided by a modular stack.

## Execution environment

Deploying execution layers onto existing settlement layers
allows for experimentation with different types of
[execution environments](https://celestia.org/glossary/execution-environment)
However, experimentation is slightly limited because
execution layers, such as rollups, require transactions
and proofs to be interpreted inside the settlement layer.

For example, a rollup that wants to deploy on Ethereum
requires that its fraud or validity proofs are verified
in an EVM-compatible manner. Some rollups have
implemented mechanisms that enable their VM to
compile into a language that is readable using another
VM that sits inside the EVM, such as Optimism compiling
Go code into MIPs which runs inside the EVM. 

![GATSBY_EMPTY_ALT](/img/learn-modular/article-4-image-2.png)

Alternatively, rollups can deploy to data availability
layers that don’t impose the same restrictions. This is
because the data availability layer doesn’t interpret any
transactions or state updates from the execution layer.
Only the raw transaction data is published, which allows
the rollup to implement any arbitrary VM it wants.

Coupled with a data availability layer, execution layers
can conduct unconstrained experimentation with its execution
environment. Additionally, the ease at which new execution
layers will be able to be deployed on top of data availability
layers further reduces the friction in bootstrapping. This
will result in compounding innovation in the execution
environment because there are no barriers to experimentation
with competition facilitating rapid innovation.

## Conclusion

__Developing new blockchains was a challenging and
resource-intensive task. The advent of SDKs, such
as the Cosmos SDK, enabled new blockchains to be
created more efficiently than before. With modular
data availability layers, new blockchains can be
bootstrapped without the hurdles associated with
launching an existing independent chain, while
simultaneously retaining many benefits.__

1. The next evolution in creating new blockchains is
SDKs that enable new execution layers to be created
that can immediately utilize existing modular blockchains.
This increases the efficiency at which new blockchains can
be created while minimizing the cost.
2. Execution layers can be deployed on top of data
availability layers and retain the sovereignty of
an independent layer 1. This enables them to push
upgrades and utilize social consensus without any
dependence on external communities. Execution layers
deployed on settlement layers don’t have the same
assurances.
3. The execution environments that execution layers
can build are limited by being deployed on a settlement
layer. For an execution layer deployed on a data
availability layer, there are no restraints on the
type of execution environment that can be built and
deployed. This facilitates experimentation and
innovation in the execution environment that is
unconstrained by any dependency on a data
availability layer.
