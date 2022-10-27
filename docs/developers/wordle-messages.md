---
sidebar_label : Messages
---

# Messages

Messages allow us to process and submit information to our specific module.

From the Cosmos-SDK docs, [messages](https://docs.cosmos.network/master/building-modules/messages-and-queries.html#messages)
are:

> In the Cosmos SDK, messages are objects that are contained
  in transactions to trigger state transitions. Each Cosmos SDK
  module defines a list of messages and how to handle them.

For messages for Wordle, given our initial design, you will
make 2 messages with ignite.

* The first one is: `SubmitWordle` and it only passes the Wordle of the Day.
* The second one is: `SubmitGuess` and it attempts to guess the submitted
  wordle. It also passes a word as a guess.

With these initial designs, you can start creating our messages!

## Scaffolding A Message

To create the `SubmitWordle` message, you run the following command:

```sh
ignite scaffold message submit-wordle word
```

This creates the `submit-wordle` message that takes in `word` as a parameter.

You now create the final message, `SubmitGuess`:

```sh
ignite scaffold message submit-guess word
```

Here, you are passing a word as a guess with `submit-guess`.
