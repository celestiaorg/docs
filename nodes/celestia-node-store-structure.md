---
description: This section contains information on the celestia-node datastore and its contents.
---

# celestia-node datastore

The node's datastore refers to the storage structure
used to manage the data that supports the node's operation.
It consists of directories and files that contain the node's state,
configuration, and other information relevant to the node.

The following are the directories and files found in the datastore:

- `/blocks`: This directory stores blocks. Each file contained in this directory
represents a block on Celestia and contains its associated data. The light node's datastore does not contain this directory as light nodes do not store blocks.

- `/data`: This directory contains block headers and various files belonging to node LSM storage system such as `DISCARD`, `KEYREGISTRY`, and`MANIFEST`.

- `/index`: This directory stores the index files that handle mapping specific keys such as block heights, to the corresponding data. The light node's datstore does not contain this directory.

- `/inverted_index`: This directory stores inverted index files used for mapping queries to the corresponding data location, and various files belonging to node LSM storage system such as `DISCARD`, `KEYREGISTRY`, `LOCK`, and `MANIFEST`. The light node's datastore does not contain this directory.
  
- `/keys`: This directory stores the cryptographic key pairs that are used to operate the node.

- `/transients`: This directory contains temporary data such as cache files
that are used while the node is operating, but are not a part of the permanent blockchain state.

- `config.toml`: This is the node's primary configuration file. It defines the node's core settings such as the network parameters.