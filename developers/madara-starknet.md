# Madara and Starknet

## What's the relationship between Madara and Starket?

Starknet is a general-purpose ZK rollup that scales Ethereum using STARK
cryptography and Cairo. It's designed to be the most scalable ZK scaling
solution by innovating at every layer of the stack, whether it's the VM, the
RPC layer, or account abstraction. This makes Starknet one of the leading L2s to
build dApps that take advantage of Ethereum's security and are also scalable.

Madara, on the other hand, is not a chain in itself. Instead, it's a stack that
allows developers to build their own chain using the same tech that's being used
in Starknet and also [StarkEx](https://starkware.co/starkex/). This means that,
while Madara isn't a chain in itself, it can very well be used to run any
Starknet like chain!

By default, if you deploy a Madara chain without any modifications, you will be
running a chain that is very similar to Starknet. However, even in this case
you have your own independent block space and also get to collect fees at the
execution layer (more reasons on why you should build an app chain
[here](/#why-build-an-app-chain)). However, there are multiple ways you can
actually customize the chain using Madara to make it work best for your app.
Check out the "Build on Madara" section to learn how to do that!
