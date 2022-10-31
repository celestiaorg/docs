# Fork Choice Rule with Data Availability Sampling

- [Preamble](#preamble)
- [Invalid vs Unavailable](#invalid-vs-unavailable)
- [Scenarios](#scenarios)

## Preamble

Tendermint provides finality under an honest 2/3 of voting
power assumption. It is one of several
["BFT" consensus protocols](https://arxiv.org/abs/1807.04938)
(also known as "classical" consensus protocols).
Under that assumption, new _valid_ blocks are immediately and
forever final as soon as 2/3 of voting power commits to the block.
Therefore, under that assumption, Tendermint is fork-free.

Contemporary blockchains support full nodes (which are
secure under no assumption on voting power honesty) and
light nodes (which are secure under an honest majority of
voting power assumption). Celestia is unique in
[supporting light nodes with stronger security guarantees](../../nodes/light-node.mdx):

1. Full nodes are secure under no assumptions on voting power honesty
2. Light nodes are secure under [an honest minority of nodes and synchronous communication](https://arxiv.org/abs/1809.09044),
  and no assumptions on voting power honesty

Note that _secure_ in this context is defined as "not accepting invalid blocks"
and is orthogonal to _consensus safety_. The introduction of light nodes
that do not depend on an honest majority assumption also introduces additional
cases that must be analyzed.

## Invalid vs Unavailable

Tendermint (and other consensus protocols) requires blocks to be _valid_,
i.e. pass a [validity predicate](https://arxiv.org/abs/1807.04938) before
they are accepted by an honest node. Note that both validity and invalidity
are deterministic and monotonic, i.e. that once a block is valid or invalid,
it will be valid or invalid for all future time.

With [Data Availability Sampling](https://arxiv.org/abs/1809.09044) (DAS),
there is a notion of _available_ and _unavailable_ blocks. Both are
probabilistic rather than deterministic. Availability is assumed
monotonic (i.e. once a block is available, it will remain available since
The Internet Never Forgets), but unavailability is not. A block proposer
may hide a block to make currently-online nodes see the block as unavailable,
then reveal the entire (valid) block at a later time.

## Scenarios

We consider two scenarios.

### Scenario 1

**A dishonest majority hide a committed block, commit to a second block
at the same height within the weak subjectivity window to fork the chain,
then reveal the first block**.

This is trivially equivocation and requires social consensus to resolve
which fork to accept. The unavailability of the first block is orthogonal.
Nodes that detect equivocation by a majority of voting power within the weak
subjectivity window must halt regardless.

### Scenario 2

**A dishonest majority hide a committed block, commit additional blocks on
top of it, then reveal the first block within the weak subjectivity window**.

There is no equivocation. Note that a node cannot distinguish a dishonest
majority in this scenario from a transient network failure on their end and
an honest majority.

A requirement is that full nodes and light nodes agree on the same head
of the chain automatically in this case, i.e. without human intervention.

Light nodes follow consensus state (i.e. validator set changes and commits)
and perform DAS. If a block is seen as unavailable but has a commit, DAS is
performed on the block continuously until either DAS passes, or the weak
subjectivity window is exceeded at which point the node halts.

Full nodes fully download and execute blocks. If a block is seen as
unavailable but has a commit, full downloading is re-attempted continuously
until either it succeeds, or the weak subjectivity window is exceeded at
which point the node halts.

Under [an honest minority of nodes and synchronous communication](https://arxiv.org/abs/1809.09044)
assumptions, passing DAS probabilistically guarantees the block can be
fully downloaded. Therefore, the above protocol guarantees light nodes
and full nodes will agree on the same head automatically without manual
intervention, under a synchrony assumption equal to the unbonding window
(formal proof pending).

> Note: whether re-downloading/re-sampling is attempted at a fixed interval
 or on receipt of a new block header with a Tendermint commit is an
 implementation detail.

Another thing to consider:

> Note: users may wish to set a much shorter timeout than the unbonding
  window before they are notified of their node being unable to verify the
  availability of a committed block. This does not affect the properties
  analyzed above, but may result in more manual attention in the event of
  intermittent network disruptions.
