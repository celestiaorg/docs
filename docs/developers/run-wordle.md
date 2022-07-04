# Run the Wordle Chain

In one terminal window, run the following command:

```sh
ignite chain build 
```

This will compile the blockchain code you just wrote.
It will also compile a daemon binary we can use to
interact with the blockchain. This binary will have
the name `wordled`

When the compilation finishes, it's time to start `wordled`. You
can start the chain with optimint configurations by running the following:

```sh
wordled start --optimint.aggregator true --optimint.da_layer celestia --optimint.da_config='{"base_url":"http://XXX.XXX.XXX.XXX:26658","timeout":60000000000,"gas_limit":6000000,"namespace_id":[0,0,0,0,0,0,255,255]}' --optimint.namespace_id 000000000000FFFF --optimint.da_start_height 21380
```

In another window, run the following to submit a Wordle:

```sh
wordled tx wordle submit-wordle giant --from alice
```

This will ask you to confirm the transaction with the following message:

```sh
{"body":{"messages":[{"@type":"/YazzyYaz.wordle.wordle.MsgSubmitWordle","creator":"cosmos17lk
3fgutf00pd5s8zwz5fmefjsdv4wvzyg7d74","word":"giant"}],"memo":"","timeout_height":"0","extensi
on_options":[],"non_critical_extension_options":[]},"auth_info":{"signer_infos":[],"fee":{"am
ount":[],"gas_limit":"200000","payer":"","granter":""}},"signatures":[]}

confirm transaction before signing and broadcasting [y/N]:
```

Confirm with a Y.

You will then get a response on the transaction indicating it has
been submitted.

Test out a few things for fun:

```sh
wordled tx wordle submit-guess 12345 --from alice
```

After confirming the transaction, you will see the response shows
an Invalid Error because you submitted integers.

Now try:

```sh
wordled tx wordle submit-guess ABCDEFG --from alice
```

After confirming the transaction, you will see the response shows
an Invalid Error because you submitted a word larger than 5 characters.

Now try to submit another wordle even though one was already submitted

```sh
wordled tx wordle submit-wordle meter --from bob
```

After submitted the transactions and confirming, you will get an
error that a wordle has already been submitted for the day.

Now let’s try to guess a five letter word:

```sh
wordled tx wordle submit-guess least --from bob
```

Given you didn’t guess the correct word, it will increment the
guess count for Bob’s account.

We can verify this by querying the list:

```sh
wordled q wordle list-guess --output json
```

This outputs all Guess objects submitted so far, with the index
being today’s date and the address of the submitter.

With that, we implemented a basic example of Wordle using
Cosmos-SDK and Ignite and Optimint. Read on to how you can
extend the code base.

## Extending in the Future

There are many ways this codebase can be extended:

1. You can improve messaging around when you guess the correct word.
2. You can hash the word prior to submitting it to the chain,
  ensuring the hashing is local so that it’s not revealed via
  front-running by others monitoring the plaintext string when
  it’s submitted on-chain.
3. You can improve the UI in Terminal using a nice interface for
  Wordle. Some examples are [here](https://github.com/nimblebun/wordle-cli).
4. You can improve current date to stick to a specific timezone.
5. You can create a bot that submits a wordle every day at a specific time.
