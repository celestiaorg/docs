# Introduction

A new paradigm is emerging in which
modular blockchains are enabling new
chains to be constructed in ways that
were not previously possible. Because
of this, the design possibilities are
vast for both the individual blockchain
and the modular stack it is a part of.
Different types of modular blockchains
can work synergistically, varying by
purpose and architecture.

## The modular blockchain stack

The four functions that modular blockchains
can consist of are execution, settlement,
consensus, and data availability. 

- Execution: The environment where applications
live and state changes are executed.
- Settlement: Provides an optional hub for
execution layers to verify proofs, resolve
fraud disputes, and bridge between other
execution layers.
- Consensus: Agree on the ordering of transactions.
- Data availability: Verifies that transaction
data is available.

It is typical for layers within a modular
stack to provide more than one function,
as in many cases it is impractical to have
one without another. For example, a layer
that specializes in data availability also
requires consensus to order the data,
otherwise the history of the data can’t
be determined.

## Layer 1 & layer 2

Naive modular stacks were initially
constructed to provide scalability to a
monolithic layer 1. In this stack,
layer 1 provides all key functions—including
execution—while layer 2 specializes
only in execution.

![GATSBY_EMPTY_ALT](/img/learn-modular/article-2-image-1.png)

With a rollup as the layer 2 it provides
an environment for applications to be
deployed to, and for transactions to be
processed that interact with those applications.
Layer 1 supports the rollup by allowing
it to publish its blocks, which at minimum
ensures that the transaction data in the block
is ordered and available. Since layer 1
also has execution capabilities, it can
ensure the validity of transactions if
the layer 2 requires. Additionally, the
layer 1 can also act as a hub to connect
layer 2s, allowing them to bridge tokens
and liquidity between them.

Essentially, the layer 1 is a monolithic chain
that yields additional scale from layer 2.
In most cases, the capacity of layer 2 is also
dependent on layer 1s capacity. As a result,
this implementation of a layer 1 & layer 2
stack is suboptimal for scalability.

## Execution & settlement & data availability

To optimize more of the benefits that a modular
blockchain stack can provide, the functions can
be decoupled across multiple layers such that
each layer in the stack is modular.

![GATSBY_EMPTY_ALT](/img/learn-modular/article-2-image-2.png)

The execution layer sits at the top of the
stack and plays the same role as layer 2 in
the previous stack. Modular stacks beyond
layer 1 and 2 are more flexible in their
construction, requiring more specific naming
that is coherent with the functionality that
each layer provides.

The settlement layer is unique to that of regular
layer 1s that provide settlement because it
decouples the settlement functionality from
the rest of the functions. The result is an
execution chain that can be used specifically
for settlement, enabling a
[trust-minimized bridge](https://celestia.org/glossary/trust-minimized-bridge)
between the execution and settlement layer and
providing a way by which execution layers can
bridge between each other.

Once the execution layer has published its
blocks to the settlement layer, it will build
its own blocks that include transactions from
the execution layer and publish only the
transaction data to the base layer. This is
only one of multiple ways that the settlement
layer could function within the modular stack.

At the bottom of this construction is the consensus
and data availability layer. As the name suggests,
it only provides consensus over the ordering of
transactions and verifies that their data is available.
Because there is no execution functionality, only
transaction data is published by the settlement
layer rather than the contents of the entire block.

## Execution & data availability

In the previous two modular stacks, the execution
layer solely focused on execution and off-loaded
the remaining functions to other layers. However,
because modular blockchains are flexible in the
purposes they can provide, an execution layer isn’t
only limited to only posting its blocks to a
settlement layer. For example, a modular stack
can be created that involves no settlement layer,
only an execution layer on top of a consensus
and data availability layer.

![GATSBY_EMPTY_ALT](/img/learn-modular/article-2-image-3.png)

Under this modular stack, the execution layer
would be sovereign such that it has the ability
to fork, and for its nodes to determine which 
execution rules are canonical. If the execution
layer is a rollup and requires fraud or validity
proofs to be verified, they can be distributed
through the rollup's peer-to-peer layer rather
than published to a settlement layer. Validity
proofs would be distributed with each block,
and fraud proofs only during disputes.

Since there is no settlement layer involved,
only the data availability layer is responsible
for providing security for transaction ordering
and data availability. This enables the execution
layer to receive the full scalability benefits
of decoupling consensus from execution as there
is no middle layer to forward the transaction
data to the base layer.

## Conclusion

__By decoupling functions and dividing them acros
specialized layers, different modular stacks can
be created to serve varying goals with more
optimal approaches. With the flexibility
that modular blockchains provide, a wide
design space is open to tackle unique
challenges.__

1. A modular stack can consist of a combination
of different layers. Since it is common for most
layers in the stack to consist of at least two
components, in many cases it is impractical to
have one without another (e.g. consensus and
data availability layer).
2. Naive modular stacks were initially introduced
with layer 2s, providing scalability to a
monolithic layer 1 blockchain. Since the 
capacity of layer 2s depends on layer 1, a
more modular approach is required to optimize
the stack.
3. A modular stack can be constructed that
consists of three layers rather than two.
The execution layer can utilize a settlement
layer for all the functionality that is
required (e.g. bridging and dispute resolution)
but also harness the benefits of a separate
consensus and data availability layer.
4. A modular stack can also consist of an
execution layer that runs natively on a
consensus and data availability layer.
Under this construction, execution layer
nodes would verify blocks through its
peer-to-peer layer rather than from a
settlement layer contract. This enables
sovereignty for the execution layer as
it can determine its environment without
permission from any underlying layers.
