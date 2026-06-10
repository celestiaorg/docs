# How to run op-alt-da with AWS KMS

## Overview

This guide walks through running [op-alt-da](https://github.com/celestiaorg/op-alt-da) (da-server) using a Celestia key stored in Amazon Web Services (AWS) key management service (KMS). You will use the localstack, a mock of AWS, to learn how to run the da-server. Once you've done this, you can log in to AWS and use your private key in [prod](#production-aws).

## Prerequisites

- Docker
- Go 1.21+
- A Celestia RPC endpoint from [Quicknode](https://quicknode.com/)

## Getting started

## Production (AWS)

For production AWS KMS usage:

1. Create a KMS keypair in AWS with key spec `ECC_SECG_P256K1` and key usage `SIGN_VERIFY`.

2. Create an alias for your key (e.g., `alias/op-alt-da/my_celes_key`). Per AWS requirements, the alias name must start with `alias/`.

3. Configure your IAM policy with the minimum required permissions:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "kms:GetPublicKey",
           "kms:Sign"
         ],
         "Resource": "arn:aws:kms:REGION:ACCOUNT_ID:key/KEY_ID"
       }
     ]
   }
   ```

4. Update your `config.toml`:

   ```toml
   [celestia]
   keyring_backend = "awskms"
   default_key_name = "alias/op-alt-da/my_celes_key"

   [celestia.awskms]
   region = "us-east-2"
   endpoint = ""
   ```

   Note: Leave `endpoint` empty for production AWS. The `default_key_name` must include the full alias path (e.g., `alias/my_celes_key` or `alias/op-alt-da/my_celes_key`).