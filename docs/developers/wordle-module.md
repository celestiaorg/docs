---
sidebar_label: Module
---

# Creating the Wordle Module

For the Wordle module, you can add dependencies offered by Cosmos-SDK.

From the Cosmos-SDK docs, a [module](https://docs.ignite.com/guide/nameservice#cosmos-sdk-modules)
is defined as the following:

> In a Cosmos SDK blockchain, application-specific logic
  is implemented in separate modules. Modules keep code easy
  to understand and reuse. Each module contains its own message
  and transaction processor, while the Cosmos SDK is responsible
  for routing each message to its respective module.

Many modules exist for slashing, validating, auth.

## Scaffolding A Module

You will be using the `bank` module dependency for transactions.

From the Cosmos-SDK docs, the [`bank`](https://docs.cosmos.network/master/modules/bank/)
module is defined as the following:

> The bank module is responsible for handling multi-asset coin
  transfers between accounts and tracking special-case pseudo-transfers
  which must work differently with particular kinds of accounts
  (notably delegating/undelegating for vesting accounts). It exposes
  several interfaces with varying capabilities for secure interaction
  with other modules which must alter user balances.

You build the module with the `bank` dependency with the following command:

```sh
ignite scaffold module wordle --dep bank
```

This will scaffold the Wordle module to your Wordle Chain project.
