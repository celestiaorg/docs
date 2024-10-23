---
description: An overview of the celestia-node API.
---

# Node API

The celestia-node API is made for interacting with celestia-node.
There are two ways in which a user and developer can interact with
the API, the RPC API and the Gateway API. View
[the API's documentation](https://node-rpc-docs.celestia.org/).

## RPC API

The RPC API primarily focuses on developers and projects building on
top of Celestia, who are willing to run their own DA nodes. The RPC API
provides a richer set of features and a superior user experience.
Unlike the Gateway API, the RPC API allows access
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

The [quick start guide](../how-to-guides/quick-start.md) is the easiest way to get started.

The [node tutorial](./node-tutorial.md), which uses the RPC CLI, is the
recommended way
to learn more about interacting with your Celestia node.

Other ways to get started are with the [Rust](./rust-client-tutorial.md) and [Golang](./golang-client-tutorial.md) tutorials.

## Gateway API

:::warning
The gateway endpoints have been deprecated and will be removed in the future.
If you would like to use them anyway, you can
[find more details on GitHub](https://github.com/celestiaorg/celestia-node/pull/2360).
:::

The gateway API is a REST API which is meant to be deployed by infra
providers to enable the public read-only gateway to the DA network for
external users who don't want or can't run light nodes
(like browsers currently) over HTTP. It has no wallet or signing
functionality.

<!-- We may also implement super-light-clients over Gateway API at some point. -->

### Gateway API tutorial

Check out the [Prompt scavenger gateway API tutorial](./prompt-scavenger.md)
for more details.
