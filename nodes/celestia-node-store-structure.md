---
description: This section contains information on the celestia-node datastore and it's contents.
---

# celestia-node store

The node's store refers to the storage structure
used to manage the data that supports the node's operation.
It consists of directories and files that contain the node's state,
configuration, and other information relevant to the node.

Below are the directories contained in the node's store:

- `/blocks`: This directory stores blocks. Each file contained in this directory
represents a block on Celestia and contains it's associated data.

- `/data`: This directory contains the block header files.

- `/config`: This directory stores the files used to set the node's operational parameters.
It contains the following configuration files:

  - `app.toml`: The configuration file to define application settings such as logging levels and performance tuning.

  - `client.toml`: used to configure parameters for client interactions like API endpoints or timeouts.

- `config.toml`: This is the node's primary configuration file.
It defines the node's core settings such as the network parameters and the node's identity.

- `inverted_index`: This file stores indexed data that can be used make blockchain queries.

- `/keys`: This directory stores the cryptographic key pair that is used to operate the node.

- `/transients`: This directory stores temporary data such as cache files
that are used while the node is operating, but are not a part of the permanent blockchain state.