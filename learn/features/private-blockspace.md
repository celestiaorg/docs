# Private Blockspace

Private Blockspace lets applications publish **encrypted state to Celestia** while still making it **publicly accountable**.

Networks can keep sensitive data—like balances, positions, liquidations, and routing logic—confidential, without pushing trust back onto offchain operators. Anyone can verify that encrypted data is **available and properly committed to**, while only authorized parties can decrypt the underlying contents.

Private Blockspace is built for systems where **privacy is required** and **verifiability is non-negotiable**.

## How it works

Private Blockspace is implemented as a lightweight **Private Blockspace Proxy** that sits between your application and Celestia’s data availability layer:

1. **Submit**: Your app sends blobs to the proxy. The proxy encrypts the data, generates a zkVM proof (**Verifiable Encryption**), and publishes the encrypted blob to Celestia.

2. **Retrieve**: Your app fetches blobs through the proxy. The proxy retrieves encrypted data from Celestia and attempts to decrypt it using the configured key material.

3. **Verify**: Anyone can verify that the encrypted data is available on Celestia and that protocol-defined commitments about the plaintext hold—without revealing the plaintext itself.

## Use cases

Private Blockspace is designed for applications that need private execution or private state while preserving public guarantees. Here are a few novel use cases it can be applied to:

- **Accountable offchain exchanges**: Keep exchange state private while making availability and commitments publicly verifiable.

- **Trust-minimized data marketplaces**: Sellers can publish verifiably encrypted data to Celestia so buyers can verify availability and integrity before payment—without relying on intermediaries.

## Get started

- [About Private Blockspace](/build/private-blockspace/about): Architecture and technical details
- [Quickstart guide](/build/private-blockspace/quickstart): Run it locally and submit encrypted blobs
- [Private Blockspace Proxy](https://github.com/celestiaorg/private-blockspace-proxy/): Source code and implementation details