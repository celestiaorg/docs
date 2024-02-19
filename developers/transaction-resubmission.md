---
description: This is a guide on transaction resubmission on Celestia.
---

# Transaction resubmission

In cases where transactions are not included within a 75-second window,
resubmission is necessary. This is especially important during network
congestion, as transactions with relatively low fees may not be processed
even after the network clears up.

Regardless of whether they originate from celestia-app or celestia-node,
transactions will not be re-gossiped, except in the presence of a new peer.

## Monitoring and resubmission

Monitor the status of your transactions. If a transaction is not included within
a 75-second window, it should be resubmitted. This can be done manually or
through automated processes.

Changes introduced in [celestiaorg/celestia-core#1089](https://github.com/celestiaorg/celestia-core/pull/1089)
may affect transaction gossiping and inclusion speed.

## Notes

- All transactions, regardless of their origin, are subject to being sorted and
  pruned based on fees.
- It is the user or developer's responsibility to monitor and possibly resubmit
  transactions if they are not included in a 75-second window.
