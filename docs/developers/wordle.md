# Wordle App on Optimint

![mamaki-testnet](/img/wordle.jpg)

This tutorial guide will go over building a cosmos-sdk app
for Optimint, the Optimistic Rollup implementation of
Tendermint, for the popular game [Wordle](https://www.nytimes.com/games/wordle/index.html).

This tutorial will go over how to setup Optimint
in the Ignite CLI and use it to build the game.
The tutorial will go over the simple design,
as well as conclude with future implementations and ideas
to extend this codebase.

## Pre-requisites

Given this tutorial is targeted for developers who are experienced
in Cosmos-SDK, we recommend you go over the following tutorials
in Ignite to understand all the different components in Cosmos-SDK before
proceeding with this tutorial.

* [Hello, World](https://docs.ignite.com/guide/hello)
* [Blog and Module Basics](https://docs.ignite.com/guide/blog)
* [Nameservice Tutorial](https://docs.ignite.com/guide/nameservice)
* [Scavenger Hunt](https://docs.ignite.com/guide/scavenge)

You do not have to do those guides in order to follow this Wordle tutorial,
but doing so helps you understand the architecture of Cosmos-SDK better.

## Design Implementation

The rules of Wordle are simple: You have to guess the word of the day.

Key Points to Consider:

* The word is a five-letter word.
* You have 6 guesses.
* Every 24 hours, there’s a new word.

The GUI for Wordle shows you a few indicators: a
green highlight on a letter in a certain position
means that’s the correct letter for the Wordle
in the right position. A yellow highlight means
it’s a correct letter for the Wordle included in
the wrong position. A grey highlight means the letter
isn’t part of the Wordle.

For simplicity of the design, we will avoid those
hints, although there are ways to extend this codebase
to implement that, which we will show at the end.

In this current design, we implement the following rules:

* 1 Wordle can be submitted per day
* Every address will have 6 tries to guess the word
* It must be a five-letter word.  
* Whoever guesses the word correctly before their
  6 tries are over gets an award of 100 TIA tokens.

We will go over the architecture to achieve this further
in the guide. But for now, we will get started setting up
our development environment.

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
