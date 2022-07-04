# Scaffolding the Wordle Chain

Now, comes the fun part, creating a new blockchain! With Ignite,
the process is pretty easy and straightforward.

We first run the following command to setup our project for
our new blockchain, Wordle.

```sh
ignite scaffold chain github.com/YazzyYaz/wordle --no-module
```

This command scaffolds a new chain directory called `wordle`
in your local directory from which you ran the command. Notice
that we passed the `--no-module` flag, this is because we will be
creating the module after.

Now, it’s time to enter the directory:

```sh
cd wordle
```

Inside you will see several directories and architecture for
your cosmos-sdk blockchain. Going over each one is outside
the scope of this guide, but we encourage you
to read about it [here](https://docs.ignite.com/guide/hello#blockchain-directory-structure).
