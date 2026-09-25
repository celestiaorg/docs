# Data availability FAQ

# What is data availability?

Data availability is about proving that a block's transactions have been published to the network. In most chains this means downloading all transaction data for a new block; in Celestia, light nodes can answer this question via DAS without full downloads.

![Data availability](/img/learn/data-availability-faq/Data-availability.png)

## What is the data availability problem?

If a block producer withholds data for a proposed block (a data withholding attack), other nodes cannot update state or verify the chain. The risk varies by architecture—for example, rollups and validiums are especially sensitive.

## How do nodes verify data availability in Celestia?

Full nodes can download entire blocks as usual. Light nodes leverage DAS: they request random shares with Merkle proofs from the extended data matrix. See [Data availability sampling](#data-availability-sampling-das) for details.

## What is data availability sampling?

DAS lets light nodes make repeated random sampling requests for small portions of a block. As more samples succeed, confidence that the full block is available rises (e.g., to 99%+). A simple analogy is coin flips: enough successful flips (samples) give high confidence the data exists.

## What security assumptions does DAS rely on?

- Enough light nodes sample for the given block size so an honest bridge node can reconstruct the full block from their collected shares.
- Light nodes connect to at least one honest bridge node to receive fraud proofs for incorrectly erasure-coded blocks; eclipse attacks can break this assumption.

## Why is block reconstruction necessary for security?

Blocks are erasure coded; malicious encoders could extend data incorrectly. Bridge nodes need the full block to produce fraud proofs of bad encoding. If only light nodes receive data and bridge nodes cannot reconstruct the block, the network could miss invalid encoding.

## What is data storage and how is it different?

Data storage concerns keeping and retrieving historical transaction data. The security assumption for storage is 1-of-N honesty—only one honest keeper of history is needed—while data availability is about new blocks being publishable and verifiable.

![Data storage](/img/learn/data-availability-faq/Data-storage.png)

## What problems arise around data storage?

If historical data cannot be retrieved, users may lose access to transaction history and nodes cannot sync from genesis. This is a retrieval problem, not an availability problem.

## Where does blockchain state fit into this?

State (balances, contract storage, validator set) is a snapshot derived from transaction data. Its growth poses different challenges than DA or data retrieval.

## Why doesn’t Celestia incentivize storing historical data?

Guaranteeing permanent storage is not the DA layer’s role, and storage needs only 1-of-N honest providers. Celestia focuses on securely publishing data; third parties store history based on their incentives.

## Who might store historical data?

- Block explorers serving past transactions
- Indexers with query APIs
- Applications or rollups needing history for processes
- Users who want their own transaction history

## How can chains improve data retrievability?

- Reward nodes for storing and serving data (e.g., storage networks like [Filecoin](https://filecoin.io)).
- Publish transaction data to an incentivized storage layer.
- Offer paid archival access or snapshots so others can sync from known good data.