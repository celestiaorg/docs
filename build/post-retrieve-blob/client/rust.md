# Rust client

The [Lumina Rust client](https://github.com/eigerco/lumina/tree/main/client) provides a high-level API for interacting with a Celestia node over RPC and gRPC. It builds on top of the lower-level `celestia-rpc` and `celestia-grpc` crates and exposes a unified `Client` that supports both **read-only** and **submit** modes.

In read-only mode, the client connects to a node via RPC (and optionally gRPC) to query headers, blobs, and state.

In submit mode, it additionally uses gRPC and a local signer to build, sign, and broadcast transactions such as transfers and PayForBlobs.

The crate re-exports common Celestia types (namespaces, blobs, app versions, etc.) and is designed to be the easiest way for Rust applications to integrate with Celestia nodes for data retrieval, blob submission, and general chain interaction. ([lib.rs][1], [docs.rs][2])

[1]: https://lib.rs/crates/celestia-client "celestia-client, in Rust // Lib.rs"
[2]: https://docs.rs/celestia-client/latest/celestia_client/ "celestia-client, in Rust // Docs.rs"