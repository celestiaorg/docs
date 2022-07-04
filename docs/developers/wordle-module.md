# Creating the Wordle Module

For the Wordle module, we can add dependencies offered by cosmos-sdk.
Many exist for slashing, validating, auth. We will be using
the `bank` dependency for transactions.

We build the module with the `bank` dependency with the following command:

```sh
ignite scaffold module wordle --dep bank
```

This will scaffold the Wordle module to our Wordle Chain project.
