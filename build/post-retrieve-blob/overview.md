# Overview to posting and retrieving blobs on Celestia

This section will show you how to post and retrieve blobs on Celestia using the transaction client in Golang and Rust.

There are two transaction clients available:

| Option     | What you need                       | Endpoints to set                  | Guides                                                    |
| ---------- | ----------------------------------- | --------------------------------- | --------------------------------------------------------- |
| **Golang** | Local keyring handled by the client | **2** — DA bridge RPC + Core gRPC | [Go client tutorial](/build/post-retrieve-blob/client/go) |
| **Rust**   | Local keyring handled by the client | **2** — DA bridge RPC + Core gRPC | [Rust client](/build/post-retrieve-blob/client/rust)      |