#### Introduction

Monolithic blockchains have pursued varying scalability techniques over time, many of which have proven unsuccessful. Modular blockchains present a way for a monolithic blockchain to be split up among multiple specialized layers. As a result, each layer can implement mechanics for scalability that may have required many tradeoffs in a monolithic architecture.

#### Execution layers

In a modular stack, an execution layer can consist of any type of blockchain that is primarily responsible for executing user-facing transactions. This can include designs such as sidechains, state channels, plasma, and rollups, among others. Of them, rollups have recently emerged as the dominant execution layer.
Rollups are a type of blockchain that post their blocks to a parent chain to ensure validity and <a href="https://celestia.org/glossary/data-availability" target="_blank" rel="noopener noreferrer" style="color:#7B2BF9;">data availability</a>. Over time, two primary designs have emerged for rollups, optimistic and zk-rollups.

##### Optimistic rollups

Optimistic rollups post their blocks to a parent chain, which receives the block with the corresponding signatures and optimistically assumes the transactions are correct. To allow for the rollup blocks to be challenged in the event the block is suspected to be invalid, a dispute window is provided for challenges to be made. If a block is challenged, a <a href="https://celestia.org/glossary/data-availability" target="_blank" rel="noopener noreferrer" style="color:#7B2BF9;">fraud proof</a> is used to verify whether it is invalid. Once the dispute window has closed, challenges can’t be made against the block and it is considered final.

![GATSBY_EMPTY_ALT](/img/learn-modular/article-3-image-2.png)

One primary scalability improvement that optimistic rollups provide is moving execution away from the parent chain. Once transactions get executed on an optimistc rollup, the parent chain need not re-execute them because they automatically are assumed correct. Therefore, the burden of execution is alleviated from the parent chain.

The second scalability improvement is alleviating state growth from the parent chain. By moving applications and transactions to a different chain, the parent chain can reduce the rate at which its state grows. Reducting growth is particularly important as a large state increases hardware requirements for nodes which can negatively affect decentralization. Therefore, reducing state growth is key for sustainable scaling.

##### zk-Rollups

Unlike optimistic rollups, zk-rollups don’t assume that their transactions are correct. With every block that is posted to the parent chain a <a href="https://celestia.org/glossary/validity-proof" target="_blank" rel="noopener noreferrer" style="color:#7B2BF9;">validity proof</a> is provided that attests to the correctness of the block. Since transactions are considered final once the validity proof is verified, a dispute window is not required to challenge the rollup block’s validity.

![GATSBY_EMPTY_ALT](/img/learn-modular/article-3-image-3.png)

zk-rollups provide similar scalability benefits to that of Optimistic rollups by alleviating the execution bottleneck and state growth from its parent chain. Additionally, zk-rollups also provide scalability for compute verification through the use of validity proofs.

In most blockchains, block producers execute transactions and place them in a block, which is subsequently re-executed by nodes to verify correctness. A validity proof allows nodes to efficiently verify transactions without having to re-execute them - they only verify a single proof.

A parent chain is used as a key example in explaining rollups based on their current architecture. As explored in the previous lesson, rollups can deploy to a consensus and data availability layer that doesn’t have execution functionality. In this instance, the data availability layer wouldn’t act as a parent chain as the execution layer is sovereign and unrestricted.

#### Data availability layers

By separating consensus and execution, data availability layers can make scalability optimizations without the constraints of also providing settlement layer functionality. 

One of the primary scalability improvements that data availability layers provide is block verification. Since consensus isn't concerned with transaction validity, block verification is reduced to only data availability verification. A key component of this is <a href="https://celestia.org/glossary/data-availability-sampling" target="_blank" rel="noopener noreferrer" style="color:#7B2BF9;">data availability sampling</a>, which allows nodes to verify availability without having to download the entire block. This is done by completing multiple rounds of sampling small random chunks. 

![GATSBY_EMPTY_ALT](/img/learn-modular/article-3-image-1.png)

The implication of data availability sampling on light nodes’ resource requirements is that the number of sampling rounds and size of the chunks remains fixed regardless of the block size, only the header size increases. For example, given a block size of 250kb the overhead would be approximately 2kb, and for a 1000kb block it would be approximately 4kb.

Data availability sampling also minimizes bandwidth cost for light nodes. In a blockchain where the entire block is downloaded to verify data availability, the bandwidth cost for the node is equal to the size of the block. With data availability sampling, the bandwidth cost for a node becomes significantly smaller since only a fraction of the data is required to be downloaded.

For example, given a block size of 1000kb and no data availability sampling, the bandwidth overhead is the entire 1000kb. With data availability sampling, that 1000kb bandwidth overhead reduces to only 33kb. 

#### Settlement layers

The current scope of settlement layers has been borne out of necessity for a blockchain to scale using a separate execution layer. However, that situation is imperfect as the now settlement layer is still burdened by applications and their corresponding user-based transaction activity. This results in a settlement layer that is crowded with transactions from both individual users and execution layers.

An optimal settlement layer should have negligible user-based transaction activity, such as only staking and native token transfers. Besides that, there is no additional need for non-execution layer transactions on the settlement layer because it adds extra overhead to the system.

The vast majority of the settlement layers transaction activity should consist of execution layers settling transactions. <a href="https://forum.celestia.org/t/increasing-scalability-of-the-evm-for-rollups-by-restricting-state-and-contract-set/78" target="_blank" rel="noopener noreferrer" style="color:#7B2BF9;">One method</a> of influencing this behavior is to limit smart contracts such that they are only used to interact with execution layers, providing proof verification and bridging tokens. By doing so an environment can be created that is conducive to scaling a settlement layer. Many techniques used to scale execution and data availability layers are also applicable to the settlement layer, including mechanics such as parallel transaction processing, fraud or validity proof, weak statelessness, and history expiry.

<div class="conclusion"> 

#### Conclusion

**Modular blockchains can provide many mechanics for scalability that significantly increase the overall throughput of a modular stack. Such blockchains can make adjustments and implement scalability improvements that may have been infeasible or limiting given a monolithic architecture.**

1. The two main designs of rollups are optimistic and zk-Rollups. Optimistic rollups provide scalability through data compression and alleviating state growth on the parent chain. zk-Rollups scale similarly, as well as through efficient compute verification with validity proofs.
2. Data availability layers scale block verification and minimize bandwidth costs for light nodes. This is possible with data availability sampling, which allows light nodes to verify data availability by only downloading small random samples of a block.
3. Settlement layers can scale using the same techniques from execution and data availability layers. In their current form, settlement layers are unideal. A more optimal approach would be to create an environment that limits smart contracts to favor interactions with execution layers.
</div>