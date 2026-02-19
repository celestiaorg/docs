# Jailing and slashing on Celestia

Slashing is a mechanism employed in proof of stake blockchains
that is used to deter and punish malicious behavior.
It functions by removing a percentage of a validator's stake
each time they act harmfully towards the network.

Celestia is built with the Cosmos SDK and uses the `x/slashing` module.

If a validator gets slashed, delegators bonded to that validator will also
have the same percentage of their delegated funds slashed.

The following are the conditions for a validator to get jailed or slashed:

1. **Downtime**: If a validator is offline for more than 25% of a rolling window
   of the last 5,000 blocks, they will be jailed for 1 minute.
   During this period, the validator is removed from the validator set
   temporarily, and will be unable to propose new blocks or earn rewards.
   After the jail period, the validator can send an unjail request to
   rejoin the validator set.

2. **Double signing**: This is a more severe offense and results in getting slashed.
   If a validator engages in double signing, the validator
   will lose 2% of their stake and the remainder of their stake
   will be returned to them. The validator will be permanently removed
   from the validator set and will not have the ability to unjail.
   Delegators bonded to that validator will automatically enter the unbonding
   period for 21 days, and can delegate to another validator after
   they have been unbonded.

For more details on the jailing and slashing parameters, refer to the
[celestia-app specifications](https://celestiaorg.github.io/celestia-app/parameters_v6.html)
page.