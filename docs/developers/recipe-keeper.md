---
sidebar_label: Keepers
---

# 🔁 Keepers

## 📗 Define `Recipe` type and `AppendRecipe` keeper method

Create a file `recipes/proto/recipes/recipes/recipe.proto` and
define the `Recipe` message:

```go title="recipes/proto/recipes/recipes/recipe.proto"
syntax = "proto3";

package recipes.recipes;

option go_package = "recipes/x/recipes/types";

message Recipe {
  string creator = 1;
  uint64 id = 2;
  string dish = 3; 
  string ingredients = 4; 
}
```

## 📘 Define keeper methods

Now you’ll define your `AppendRecipe` keeper method.

Create the `recipes/x/recipes/keeper/recipe.go` file. The
`AppendRecipe` function is a placeholder to brainstorm how
to implement it:

```go title="recipes/x/recipes/keeper/recipe.go"
package keeper

import (
  "encoding/binary"

  "github.com/cosmos/cosmos-sdk/store/prefix"
  sdk "github.com/cosmos/cosmos-sdk/types"

  "recipes/x/recipes/types"
)

// func (k Keeper) AppendRecipe() uint64 {
//    count := k.GetRecipeCount()
//    store.Set()
//    k.SetRecipeCount()
//    return count
// }
```

Add these prefixes to the `recipes/x/recipes/types/keys.go` file
in the `const` and add a comment for your reference:

```go title="recipes/x/recipes/types/keys.go"
const (
  //...

  // Keep track of the index of recipes  
  RecipeKey      = "Recipe-value-"
  RecipeCountKey = "Recipe-count-"
)
```

Next, implement `GetRecipeCount` in the `recipes/x/recipes/keeper/recipe.go` file:

<!-- markdownlint-disable MD013 -->
```go title="recipes/x/recipes/keeper/recipe.go"
func (k Keeper) GetRecipeCount(ctx sdk.Context) uint64 {
  Get the store using storeKey (which is "recipes") and RecipeCountKey (which is "Recipe-count-")
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.RecipeCountKey))
  
  // Convert the RecipeCountKey to bytes
  byteKey := []byte(types.RecipeCountKey)
  
  // Get the value of the count
  bz := store.Get(byteKey)
  
  // Return zero if the count value is not found (for example, it's the first recipe)
  if bz == nil {
    return 0
  }
  
  // Convert the count into a uint64
  return binary.BigEndian.Uint64(bz)
}
```

And then `SetRecipeCount`:

```go title="recipes/x/recipes/keeper/recipe.go"
func (k Keeper) SetRecipeCount(ctx sdk.Context, count uint64) {
  // Get the store using storeKey (which is "recipes") and RecipeCountKey (which is "Recipe-count-")
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.RecipeCountKey))
  
  // Convert the RecipeCountKey to bytes
  byteKey := []byte(types.RecipeCountKey)
  
  // Convert count from uint64 to string and get bytes
  bz := make([]byte, 8)
  binary.BigEndian.PutUint64(bz, count)
  
  // Set the value of Recipe-count- to count
  store.Set(byteKey, bz)
}
```
<!-- markdownlint-enable MD013 -->

Now you’re ready to implement the `AppendRecipe` function at
the top of the file above `GetRecipeCount` and `SetRecipeCount`:

```go title="recipes/x/recipes/keeper/recipe.go"
func (k Keeper) AppendRecipe (ctx sdk.Context, recipe types.Recipe) uint64 {
  // Get the current number of recipes in the store
  count := k.GetRecipeCount(ctx)
  
  // Assign an ID to the recipe based on the number of recipes in the store
  recipe.Id = count
  
  // Get the store
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.RecipeKey))
  
  // Convert the recipe ID into bytes
  byteKey := make([]byte, 8)
  binary.BigEndian.PutUint64(byteKey, recipe.Id)
  
  // Marshal the recipe into bytes
  appendedValue := k.cdc.MustMarshal(&recipe)
  
  // Insert the recipe bytes using recipe ID as a key
  store.Set(byteKey, appendedValue)
  
  // Update the recipe count
  k.SetRecipeCount(ctx, count+1)
  return count
}
```

Now you have implemented all the code required to create
new recipes and store them on-chain. When a transaction that
contains a message type `MsgCreateRecipe` is broadcast, the
message is routed to the recipes module.

- `k.CreateRecipe` calls `AppendRecipe`, which gets the recipe
count, adds a recipe using the count as the ID, increments the
count, and returns the ID
