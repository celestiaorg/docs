# How to run op-alt-da with AWS KMS

## Overview

This guide walks through running [op-alt-da](https://github.com/celestiaorg/op-alt-da) (da-server) using a Celestia key stored in Amazon Web Services (AWS) key management service (KMS). You will use the localstack, a mock of AWS, to learn how to run the da-server. Once you've done this, you can log in to AWS and use your private key in [prod](#production-aws).

## Prerequisites

- Docker
- Go 1.21+
- A Celestia RPC endpoint from [Quicknode](https://quicknode.com/)
- [cel-key utility installed](/operate/keys-wallets/celestia-node-key/#installation)

## Getting started

## Production (AWS)

For production AWS-KMS usage, remove the endpoint, set your region, and private key:

```toml
[celestia.awskms]
region = "us-east-2"
endpoint = ""
alias_prefix = "alias/op-alt-da/"
auto_create = false
import_key_name = "celestia_key"
import_key_hex = "YOUR_EXPORTED_PRIVATE_KEY_HEX"
```