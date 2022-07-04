# Messages

Messages allow us to process and submit information to our specific module.

For messages for Wordle, given our initial design, we will
make 2 messages with ignite.

The first one is: SubmitWordle and it only passes the Wordle of the Day.
The second one is: GuessWord and it attempts to guess the submitted
wordle. It also passes a word as a guess.

With these initial designs, we can start creating our messages!

To create the SubmitWordle message, we run the following command:

```sh
ignite scaffold message submit-wordle word
```

This creates the submit-wordle message that takes in `word` as a parameter.

We now create the final message, SubmitGuess:

```sh
ignite scaffold message submit-guess word
```

Here, we are passing a word as a guess.
