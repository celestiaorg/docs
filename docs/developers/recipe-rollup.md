---
sidebar_label: Running the Recipes Rollup
---

# 👩‍🍳 Running the Recipes Rollup

## ✨ Run a Celestia Light Node

Follow instructions to install and start your Celestia Data Availalbility
layer Light Node selecting the network that you had previously used. You can
find instructions to install and run the node [here](/nodes/light-node.mdx).

After you have Go and Ignite CLI installed, and your Celestia Light
Node running on your machine, you're ready to build, test, and launch your own
sovereign rollup.

![light-node.png](/img/recipes/light-node.png)  

## 🗞️ Start the Recipes Rollup

We have a handy `init.sh` found in this repo
[here](https://github.com/celestiaorg/devrel-tools).

We can copy it over to our directory with the following commands:

```sh
# From inside the `recipe` directory
cd ..
git clone https://github.com/celestiaorg/devrel-tools
cp devrel-tools/recipes/init.sh recipes/
cd recipes/
```
<!-- markdownlint-enable MD013 -->

This copies over our `init.sh` script to initialize our
Recipes Rollup.

You can view the contents of the script to see how we
initialize the Recipes Rollup.

Before starting our rollup, we'll need to find
and change `FlagDisableIAVLFastNode` to `FlagIAVLFastNode`:

```go title="recipesd/cmd/recipesd/cmd/root.go"
baseapp.SetIAVLFastNode(cast.ToBool(appOpts.Get(server.FlagIAVLFastNode))),
```

🟢 Start the chain with:

```sh
bash init.sh
```

With that, we have kickstarted our `recipesd` network!

![recipe-start.gif](/img/recipes/recipe-start.gif)

Open another teminal instance. Now, create your first
recipe in the command line by sending a transaction from alice,
when prompted, confirm the transaction by entering `y`:

<!-- markdownlint-disable MD013 -->
```bash
recipesd tx recipes create-recipe salad "spinach, mandarin oranges, sliced almonds, smoked gouda, citrus vinagrette" --from alice
```
<!-- markdownlint-enable MD013 -->

![recipes.gif](/img/recipes/recipes.gif)

## ⌨️ Query your recipes with the CLI

To query all of the on-chain recipes:

```bash
recipesd q recipes dishes
```

![query.gif](/img/recipes/query.gif)

🎉 Congratulations, again! You have now successfully built a recipe book rollup.
