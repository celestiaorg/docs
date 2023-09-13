---
sidebar_label: Reserved Namespaces
description: Reserved Namespaces on the Celestia Network.
---

# Reserved Namespaces

This is a table of reserved namespaces on the Celestia Network.

You can learn more
[here](https://celestiaorg.github.io/celestia-app/specs/namespace.html#reserved-namespaces)
in the celestia-app specs.

<!-- markdownlint-disable MD013 -->

| name | type | category | value | description |
| ---- | ---- | -------- | ----- | ----------- |

| `TRANSACTION_NAMESPACE` | `Namespace` | Primary | `0x0000000000000000000000000000000000000000000000000000000001` | Namespace for ordinary Cosmos SDK transactions. |
| `INTERMEDIATE_STATE_ROOT_NAMESPACE` | `Namespace` | Primary | `0x0000000000000000000000000000000000000000000000000000000002` | Namespace for intermediate state roots (not currently utilized). |
| `PAY_FOR_BLOB_NAMESPACE` | `Namespace` | Primary | `0x0000000000000000000000000000000000000000000000000000000004` | Namespace for transactions that contain a PayForBlob. |
| `PRIMARY_RESERVED_PADDING_NAMESPACE` | `Namespace` | Primary | `0x00000000000000000000000000000000000000000000000000000000FF` | Namespace for padding after all primary reserved namespaces. |
| `MAX_PRIMARY_RESERVED_NAMESPACE` | `Namespace` | Primary | `0x00000000000000000000000000000000000000000000000000000000FF` | Namespace for the highest primary reserved namespace. |
| `MIN_SECONDARY_RESERVED_NAMESPACE` | `Namespace` | Secondary | `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00` | Namespace for the lowest secondary reserved namespace. |
| `TAIL_PADDING_NAMESPACE` | `Namespace` | Secondary | `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE` | Namespace for padding after all blobs to fill up the original data square. |
| `PARITY_SHARE_NAMESPACE` | `Namespace` | Secondary | `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF` | Namespace for parity shares. |

<!-- markdownlint-enable MD013 -->
