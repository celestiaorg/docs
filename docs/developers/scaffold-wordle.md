---
sidebar_label : Scaffolding The Chain
---

# Ignite and Scaffolding the Wordle Chain
<!-- markdownlint-disable MD013 -->

## Ignite

Ignite is an amazing CLI tool to help us get started building
our own blockchains for cosmos-sdk apps. It provides lots of
power toolings and scaffoldings for adding messages, types,
and modules with a host of cosmos-sdk libraries provided.

You can read more about Ignite [here](https://docs.ignite.com/).

To install Ignite, you can run this command in your terminal:

```sh
curl https://get.ignite.com/cli | bash
sudo mv ignite /usr/local/bin/
```

This installs Ignite CLI in your local machine.
This tutorial uses a MacOS but it should work for Windows.
For Windows users, check out the Ignite docs on installation
for Windows machines.

Now, refresh your terminal using `source` or open a new terminal
session for the change to take place.

If you run the following:

```sh
ignite --help
```

You should see an output of help commands meaning Ignite
was installed successfully!

## Scaffolding the Wordle Chain

Now, comes the fun part, creating a new blockchain! With Ignite,
the process is pretty easy and straightforward.

Ignite CLI comes with several scaffolding commands that are
designed to make development more straightforward by creating
everything you need to build your blockchain.

First, we will use Ignite CLI to build the foundation of a fresh
Cosmos SDK blockchain. Ignite minimizes how much blockchain code
you must write yourself. If you are coming from the EVM-world, think of
Ignite as a Cosmos-SDK version of Foundry or Hardhat but specifically
designed to build blockchains.

We first run the following command to setup our project for
our new blockchain, Wordle.

```sh
ignite scaffold chain github.com/YazzyYaz/wordle --no-module
```

This command scaffolds a new chain directory called `wordle`
in your local directory from which you ran the command. Notice
that we passed the `--no-module` flag, this is because we will be
creating the module after.

## Wordle Directory

Now, it’s time to enter the directory:

```sh
cd wordle
```

Inside you will see several directories and architecture for
your cosmos-sdk blockchain.

| File/directory | Purpose                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app/           | Files that wire together the blockchain. The most important file is `app.go` that contains type definition of the blockchain and functions to create and initialize it. |
| cmd/           | The main package responsible for the CLI of compiled binary.                                                                                                            |
| docs/          | Directory for project documentation. By default, an OpenAPI spec is generated.                                                                                          |
| proto/         | Protocol buffer files describing the data structure.                                                                                                                    |
| testutil/      | Helper functions for testing.                                                                                                                                           |
| vue/           | A Vue 3 web app template.                                                                                                                                               |
| x/             | Cosmos SDK modules and custom modules.                                                                                                                                  |
| config.yml     | A configuration file for customizing a chain in development.                                                                                                            |
| readme.md      | A readme file for your sovereign application-specific blockchain project.

Going over each one is outside the scope of this guide, but we encourage you
to read about it [here](https://docs.ignite.com/kb).

Most of the tutorial work will happen inside the `x` directory.
