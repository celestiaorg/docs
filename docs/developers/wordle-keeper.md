---
sidebar_label: Keeper
---

# Keeper Functions
<!-- markdownlint-disable MD013 -->

Now it’s time to implement the Keeper functions for each
message. From the Cosmos-SDK docs, [Keeper](https://docs.cosmos.network/master/building-modules/keeper.html)
is defined as the following:

> The main core of a Cosmos SDK module is a piece called the keeper.
  The keeper handles interactions with the store, has references
  to other keepers for cross-module interactions, and contains most
  of the core functionality of a module.

Keeper is an abstraction on Cosmos that allows us
to interact with the Key-Value store and change the state
of the blockchain.

Here, it will help us outline the logic for each message we create.

## SubmitWordle Function

We first start with the `SubmitWordle` function.

Open up the following file: `x/wordle/keeper/msg_server_submit_wordle.go`

Inside the following, add the following code, which we will go over in a bit:

```go
package keeper

import (
  "context"
  "crypto/sha256"
  "encoding/hex"
  "wordle/x/wordle/types"
  sdk "github.com/cosmos/cosmos-sdk/types"
  sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
  "time"
  "unicode"
)

func (k msgServer) SubmitWordle(goCtx context.Context, msg *types.MsgSubmitWordle) (*types.MsgSubmitWordleResponse, error) {
  ctx := sdk.UnwrapSDKContext(goCtx)
  // Check to See the Wordle is 5 letters
  if len(msg.Word) != 5 {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Wordle Must Be A 5 Letter Word")
  }
  // Check to See Only Alphabets Are Passed for the Wordle
  if !(IsLetter(msg.Word)) {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Wordle Must Only Consist Of Letters In The Alphabet")
  }

  // Use Current Day to Create The Index of the Newly-Submitted Wordle of the Day
  currentTime := time.Now().Local()
  var currentTimeBytes = []byte(currentTime.Format("2006-01-02"))
  var currentTimeHash = sha256.Sum256(currentTimeBytes)
  var currentTimeHashString = hex.EncodeToString(currentTimeHash[:])
  // Hash The Newly-Submitted Wordle of the Day
  var submittedSolutionHash = sha256.Sum256([]byte(msg.Word))
  var submittedSolutionHashString = hex.EncodeToString(submittedSolutionHash[:])

  var wordle = types.Wordle{
    Index:     currentTimeHashString,
    Word:      submittedSolutionHashString,
    Submitter: msg.Creator,
  }

  // Try to Get Wordle From KV Store Using Current Day as Key
  // This Helps ensure only one Wordle is submitted per day
  _, isFound := k.GetWordle(ctx, currentTimeHashString)
  if isFound {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Wordle of the Day is Already Submitted")
  }
  // Write Wordle to KV Store
  k.SetWordle(ctx, wordle)
  reward := sdk.Coins{sdk.NewInt64Coin("token", 100)}
  // Escrow Reward
  submitterAddress, _ := sdk.AccAddressFromBech32(msg.Creator)
  moduleAcct := sdk.AccAddress(crypto.AddressHash([]byte(types.ModuleName)))
  err := k.bankKeeper.SendCoins(ctx, submitterAddress, moduleAcct, reward)
  if err != nil {
    return nil, err
  }
  return &types.MsgSubmitWordleResponse{}, nil
}

func IsLetter(s string) bool {
  for _, r := range s {
    if !unicode.IsLetter(r) {
      return false
    }
  }
  return true
}
```

Here in the `SubmitWordle` Keeper function, we are doing a few things:

* We first ensure that a word submitted for Wordle of the Day is
  5 letters long and only uses alphabets. That means no integers can
  be submitted in the string.
* We then create a hash from the current day the moment the Wordle was
  submitted. We set this hash to the index of the Wordle type. This
  allows us to look up any guesses for this Wordle for subsequent
  guesses, which we will go over next.
* We then check if the index for today’s date is currently empty or
  not. If it’s not empty, this means a Wordle has already been
  submitted. Remember, only one wordle can be submitted per
  day. Everyone else has to guess the submitted wordle.
* We also have a helper function in there to check if a string only
  contains alphabet characters.

## SubmitGuess Function

The next Keeper function we will add is the following:
`x/wordle/keeper/msg_server_submit_guess.go`

Open that file and add the following code, which we will explain in a bit:

```go
package keeper

import (
  "context"
  "crypto/sha256"
  "encoding/hex"
  "wordle/x/wordle/types"
  sdk "github.com/cosmos/cosmos-sdk/types"
  sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
  "strconv"
  "time"
  "github.com/tendermint/tendermint/crypto"
)

func (k msgServer) SubmitGuess(goCtx context.Context, msg *types.MsgSubmitGuess) (*types.MsgSubmitGuessResponse, error) {
  ctx := sdk.UnwrapSDKContext(goCtx)
  // Check Word is 5 Characters Long
  if len(msg.Word) != 5 {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Guess Must Be A 5 Letter Word!")
  }
 
  // Check String Contains Alphabet Letters Only
  if !(IsLetter(msg.Word)) {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Guess Must Only Consist of Alphabet Letters!")
  }

  // Get Current Day to Pull Up Wordle of That Day As A Hash
  currentTime := time.Now().Local()
  var currentTimeBytes = []byte(currentTime.Format("2006-01-02"))
  var currentTimeHash = sha256.Sum256(currentTimeBytes)
  var currentTimeHashString = hex.EncodeToString(currentTimeHash[:])
  wordle, isFound := k.GetWordle(ctx, currentTimeHashString)
  if !isFound {
    return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "Wordle of The Day Hasn't Been Submitted Yet. Feel Free to Submit One!")
  }

  // We Convert Current Day and Guesser to A Hash To Use As An Index For Today's Guesses For That Guesser
  // That Way, A Person Can Guess 6 Times A Day For Each New Wordle Created
  var currentTimeGuesserBytes = []byte(currentTime.Format("2006-01-02") + msg.Creator)
  var currentTimeGuesserHash = sha256.Sum256(currentTimeGuesserBytes)
  var currentTimeGuesserHashString = hex.EncodeToString(currentTimeGuesserHash[:])
  // Hash The Guess To The Wordle
  var submittedSolutionHash = sha256.Sum256([]byte(msg.Word))
  var submittedSolutionHashString = hex.EncodeToString(submittedSolutionHash[:])

  // Get the Latest Guess entry for this Submitter for the current Wordle of the Day
  var count int
  guess, isFound := k.GetGuess(ctx, currentTimeGuesserHashString)
  if isFound {
    // Check if Submitter Reached 6 Tries
    if guess.Count == strconv.Itoa(6) {
      return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "You Have Guessed The Maximum Amount of Times for The Day! Try Again Tomorrow With A New Wordle.")
    }
    currentCount, err := strconv.Atoi(guess.Count)
    if err != nil {
      panic(err)
    }
    count = currentCount
  } else {
    // Initialize Count Value If No Entry Exists for this Submitter for Today's Wordle
    count = 0
  }
  // Increment Guess Count
  count += 1
  var newGuess = types.Guess{
    Index:     currentTimeGuesserHashString,
    Submitter: msg.Creator,
    Word:      submittedSolutionHashString,
    Count:     strconv.Itoa(count),
  }
  // Remove Current Guess Entry to be Updated With New Entry
  k.RemoveGuess(ctx, currentTimeGuesserHashString)
  // Add New Guess Entry
  k.SetGuess(ctx, newGuess)
  if !(wordle.Word == submittedSolutionHashString) {
    return &types.MsgSubmitGuessResponse{Title: "Wrong Answer", Body: "Your Guess Was Wrong. Try Again"}, nil
  } else {
    // Setup Reward 
    reward := sdk.Coins{sdk.NewInt64Coin("token", 100)}
    // If Submitter Guesses Correctly
    guesserAddress, _ := sdk.AccAddressFromBech32(msg.Creator)
    moduleAcct := sdk.AccAddress(crypto.AddressHash([]byte(types.ModuleName)))
    // Send Reward
    err := k.bankKeeper.SendCoins(ctx, moduleAcct, guesserAddress, reward)
    if err !=nil {
      return nil, err
    }
    return &types.MsgSubmitGuessResponse{Title: "Correct", Body: "You Guessed The Wordle Correctly!"}, nil
  }
}
```

In the above code, we are doing the following things:

* Here, we are doing initial checks again on the word to ensure
  it’s 5 characters and only alphabet characters are used, which
  can be refactored in the future or checked within the CLI commands.
* We then get the Wordle of the Day by getting the hash string of
  the current day.
* Next we create a hash string of current day and the Submitter.
  This allows us to create a Guess type with an index that uses the
  current day and the address of the submitter. This helps us when we
  face a new day and an address wants to guess the new wordle of the day.
  The index setup ensures they can continue guessing a new wordle
  every day up to the max of 6 tries per day.
* We then check if that Guess type for the Submitter for today’s
  wordle did reach 6 counts. If it hasn’t, we increment the count.
  We then check if the guess is correct. We store the Guess type with
  the updated count to the state.

## Protobuf File

  A few files need to be modified for this to work.

The first is `proto/wordle/tx.proto`.

Inside this file, fill in the empty `MsgSubmitGuessResponse`
with the following code:

```go
message MsgSubmitGuessResponse {
  string title = 1;
  string body = 2;
}
```

Next file is `x/wordle/types/expected_keepers.go`

Here, we need to add the SendCoins method to the BankKeeper
interface in order to allow sending the reward to the right guesser.

```go
type BankKeeper interface {
  SendCoins(ctx sdk.Context, fromAddr sdk.AccAddress, toAddr sdk.AccAddress, amt sdk.Coins) error
}
```

With that, we implemented all our Keeper functions! Time to
compile the blockchain and take it out for a test drive.
