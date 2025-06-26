# Celestia client overview

The Celestia client enables developers and applications to read from and submit data to Celestia nodes without running their own node infrastructure.

## Overview

The Celestia client provides a streamlined API for two key purposes:

- **Reading data** (via bridge nodes).
- **Submitting transactions** (via core/consensus nodes).

## Features

- **Read operations:** Retrieve blobs, headers, and shares.
- **Submit operations:** Submit data blobs to the Celestia network.
- **State queries:** Check account balances.
- **Key management:** Simplified keyring integration.
- **Flexible modes:**
  - **Read-only** (Bridge nodes)
  - **Full client** (Bridge + Core nodes)

## Clients

There are currently two client implementations in progress:
- [Go client](/how-to-guides/client/go.md): The primary and most stable client is written in Go. It supports full blob submission and retrieval flows.
- Rust client: This client is a work in progress. It is being designed to offer a similar developer experience for Rust users.

## Understanding read vs submit endpoints

The Celestia client is split into two key parts under the hood — one for **reading data**, and another for **submitting data** — and each needs a different type of node connection.

| Purpose               | Node type required        | Example endpoint                                      |
|-----------------------|---------------------------|--------------------------------------------------------|
| Reading blobs/headers | Bridge node | `https://your-quicknode-url.celestia-mocha.quiknode.pro/<token>` or `http://localhost:26658`|
| Submitting blobs/txs  | Consensus node (Core)     | `your-quicknode-url.celestia-mocha.quiknode.pro:9090` or `celestia-testnet-consensus.itrocket.net:9090`        |

## Security tips
- Always enable TLS when using authentication tokens.
- Do not manually set both `DAAuthToken` and `gRPC` Authorization headers.
- Use file-backed keyrings (BackendFile) for production use.
