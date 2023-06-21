---
sidebar_label: Node API
description: An overview of the Celestia Node API.
---

# Node API

The Celestia Node API is made for interacting with `celestia-node`.
There are a two ways in which a user and developer can interact with
the API, the RPC API and the Gateway API. The API's documentation
can be found [here](https://node-rpc-docs.celestia.org/).

## RPC API

The RPC API primarily focuses on developers and projects building on
top of Celestia, who are willing to run their own DA nodes. The RPC API
provides a richer set of features and a superior user experience. Unlike the Gateway API, the RPC API allows access
to the internal wallet and keyring of the DA node, as well as other
sensitive and administrative capabilities.

### Library

The node can be used as a Golang library and designed for programmatic API access.
<!-- (WIP atm([celestiaorg/celestia-node#2349](https://github.com/celestiaorg/celestia-node/issues/2349))
and needs to be cleaned up for convenience as well as needs examples) -->

### RPC

The RPC API is also exposed to OpenRPC(JSON-RPC 2.0) for users wanting
to run their DA node as a separate DA service. It provides the same
set of features as the library with an additional authentication system
with different permissions levels to protect the wallet and
signing + providing RPC-level DOS protection.

### RPC API tutorial

The [node tutorial](../node-tutorial/), which uses the RPC CLI, is the recommended way
to get started interacting with your Celestia node.

## Gateway API

The gateway API is a REST API which is meant to be deployed by infra
providers to enable the public read-only gateway to the DA network for
external users who don't want or can't run light nodes
(like browsers currently) over HTTP. It has no wallet or signing
functionality.

<!-- We may also implement super-light-clients over Gateway API at some point. -->

### Gateway API tutorial

The Prompt scavenger gateway API tutorial can be found [here](../prompt-scavenger/).
