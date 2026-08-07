# Private blockspace quickstart

Private blockspace encrypts your blob data before it’s posted to Celestia using a lightweight proxy.  
In this quickstart, you’ll use hosted Celestia nodes (like QuickNode) instead of running your own.

## Troubleshooting

| Error message | Cause | Fix |
| --- | --- | --- |
| `TLS_CERTS_PATH required` | Missing or commented-out cert vars | Generate certs (see above). |
| `account not found` | Unfunded signer | Use [Mocha faucet](https://faucet.celestia-mocha.com). |
| `blob: not found` | Wrong commitment | Run `blob.GetAll` to find the real one. |
| `grpc-status header missing` | Invalid gRPC URL | Must be `https://<host>:9090`, no token. |

## ✅ You’re done

You’re running **private blockspace** end-to-end using hosted infrastructure.

✅ No local Celestia node  
✅ Fully containerized  
✅ Encrypted data posted to Celestia