# Introducing the Quantum Gravity Bridge (QGB) Orchestrator-Relayer

The QGB orchestrator-relayer is a crucial component in the implementation
of the Quantum Gravity Bridge. It is designed to streamline communication
between different blockchain networks, specifically between Celestia and
Ethereum Virtual Machine (EVM) chains. The orchestrator is responsible
for signing QGB attestations, while the relayer ensures that these attestations
are relayed to the target EVM chain.

You can view the `orchestrator-relayer` repository
[here](https://github.com/celestiaorg/orchestrator-relayer).
Read more about the QGB
[here](https://github.com/celestiaorg/quantum-gravity-bridge/tree/76efeca0be1a17d32ef633c0fdbd3c8f5e4cc53f#how-it-works)
and [here](https://blog.celestia.org/celestiums/).

In order to utilize the QGB orchestrator-relayer, users need to set up the
appropriate environment and tools. This involves installing Go 1.20.2, cloning
the repository, and installing the QGB CLI. Once set up, users can run the
orchestrator if they are a `celestia-app` validator.
However, if they're a Celestium and want to target a new EVM chain,
they can deploy a new QGB contract and run a relayer to post
commitments on that chain.
