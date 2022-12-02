---
sidebar_label: Wordle Overview
---

# Wordle App on Rollmint

![wordle-app](/img/wordle.jpg)

This tutorial guide will go over building a cosmos-sdk app
for Rollmint, the Sovereign-Rollup implementation of
Tendermint, for the popular game [Wordle](https://www.nytimes.com/games/wordle/index.html).

This tutorial will go over how to setup Rollmint
in the Ignite CLI and use it to build the game.
The tutorial will go over the simple design,
as well as conclude with future implementations and ideas
to extend this codebase.

> NOTE: This tutorial will explore developing with Rollmint,
  which is still in Alpha stage. If you run into bugs, please
  write a Github Issue ticket or let us know in our Discord.
  Furthermore, while Rollmint allows you to build sovereign
  rollups on Celestia, it currently does not support fraud
  proofs yet and is therefore running in "pessimistic" mode,
  where nodes would need to re-execute the transactions to check
  the validity of the chain (i.e. a full node). Furthermore,
  Rollmint currently only supports a single sequencer.

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
  6 tries are over gets an award of 100 WORDLE tokens.

We will go over the architecture to achieve this further
in the guide. But for now, we will get started setting up
our development environment.

## Table of Contents For This Tutorial

The following tutorial is broken down into the following
sections:

1. [Ignite and Chain Scaffolding](./scaffold-wordle)
2. [Installing Rollmint](./install-rollmint)
3. [Modules](./wordle-module)
4. [Messages](./wordle-messages)
5. [Types](./wordle-types)
6. [Keepers](./wordle-keeper)
7. [Running Wordle](./run-wordle)
