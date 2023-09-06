---
sidebar_label: Frequently Asked Questions (FAQs)
description: FAQs about the Celestia network.
---

# Frequently Asked Questions

This page answers frequently asked questions (FAQs) about the Celestia network
and ecosystem.

## Table of Contents

1. [Frequently Asked Questions](#frequently-asked-questions)
    1. [Networks](#networks)
    2. [Deviations from Cosmos SDK](#deviations-from-cosmos-sdk)
    3. [Ongoing Development & Versioning](#ongoing-development--versioning)
    4. [Transaction parameters & serialization](#transaction-parameters--serialization)
        1. [Transaction encoding and decoding](#transaction-encoding-and-decoding)
        2. [Gas](#gas)
    5. [Staking](#staking)
    6. [Consensus](#consensus)
        1. [Block production](#block-production)
    7. [Developers](#developers)
        1. [Prefixes for address generation](#prefixes-for-address-generation)
        2. [Precision of the Currency](#precision-of-the-currency)
        3. [Explorers](#explorers)
        4. [RPC and address state](#rpc-and-address-state)
    8. [Custodians](#custodians)
    9. [Vesting](#vesting)
    10. [Governance](#governance)

## Networks

**Q:** Which network should I join?

**A:** We plan to support the Mocha testnet with validators and Arabica as a POA
devnet. You can learn more about each network and the latest versions
[here](../../nodes/participate) .The recommendation now is to join Mocha,
as it is running a 1.0 release candidate. It should be very similar to what
we see on Mainnet.

---

**Q:** What parameters will you launch with based on
[these params](https://docs.cosmos.network/v0.46/modules/staking/08_params.html)?

**A:** We plan to launch with the following parameters:

* UnbondingTime = 3 weeks
* MaxValidators = 100
* KeyMaxEntries = 7
* HistoricalEntries = 3
* BondDenom = TIA
* MinCommissionRate = 0.05 (5%)

---

**Q:** What's the Mainnet Chain ID?

**A:** `celestia`

---

**Q:** Does Celestia have a genesis file? Where can I find it?

**A:** The genesis file for Celestia has not been finalized yet. It will
be released closer to launch when it is finalized.

---

**Q:** What version of Cosmos SDK will Mainnet be on?

**A:** v0.46.0

## Deviations from Cosmos SDK

**Q:** Are there any noteworthy deviations from the Cosmos SDK?

**A:** Yes. We added ABCI++ early and have QGB modules in Cosmos-SDK.

## Ongoing Development & Versioning

**Q:** What is your upgrade policy?

**A:** Our upgrade policy is ultimately whatever the community determines,
but we hope to see  updates regularly. However, we might not add new
functionality, meaning new standard modules are unlikely to be added unless
explicitly decided on via community governance.

---

**Q:** Would any updates on the Cosmos chain be applied to Celestia as well?
Or is there the possibility of the transaction models diverging in the future?

**A:** If ‘Cosmos chain’ refers to the Cosmos Hub, then yes, any updates on
the Cosmos chain would be applied to Celestia as well. There is a low
possibility of the transaction models diverging in the future.

## Transaction parameters & serialization

**Q:** Will Celestia serialize `SendMessage`, `DelegationMessage`, `BeginRedelegateMessage`,
and `UndelegateMessage` exactly the same as in Cosmos?
Are they sufficient to support the E2E staking flow on Celestia?

**A:** Yes, these transaction types on Celestia will be serialized exactly as
on Cosmos.
Yes, they are sufficient to support the E2E staking flow on Celestia.

---

**Q:** Can a user transfer coins using `MsgSend` from Cosmos SDK?

**A:** Yes.

---

**Q:** Can a user delegate with `MsgDelegate` from Cosmos SDK (x/staking)?

**A:** Yes.

---

**Q:** Can a user undelegate with `MsgUndelegate` from Cosmos SDK?

**A:** Yes.

---

**Q:** Can a delegating user withdraw rewards with `MsgWithdrawDelegatorReward`?

**A:** Yes.

---

**Q:** Is the vesting module (x/auth/vesting) from Cosmos SDK the same in
Celestia?

**A:** Yes.

---

**Q:** Is the transaction fee paid in the same currency awarded from delegation?

**A:** Yes.

### Transaction encoding and decoding

**Q:** Are there any methods that Celestia supports that Cosmos does not?

**A:** `MsgPayForData` is not part of Cosmos, it is Celestia-specific. It has
since been renamed to
[`MsgPayForBlobs`](https://github.com/celestiaorg/celestia-app/blob/4135eddedaaa2728e96ab134fc8a479a71e487a2/proto/celestia/blob/v1/tx.proto#L16-L17).
 That's the only Celestia-specific message
you should have to handle as a special case. We do use a custom TxDecoder
[here](https://github.com/celestiaorg/celestia-app/blob/4135eddedaaa2728e96ab134fc8a479a71e487a2/app/encoding/encoding.go#L45-L47)
which is defined
[here](https://github.com/celestiaorg/celestia-app/blob/4135eddedaaa2728e96ab134fc8a479a71e487a2/app/encoding/index_wrapper_decoder.go#L8).

**Q:** Since Celestia is using a custom transaction decoder, is it also using a
custom encoding?

**A:** Yes, see the answer above.

### Gas

**Q:** How exactly is fee pricing done?

**A:** The gasLimit and gasPrice are set by the transaction sender.

---

**Q:** Will there be any burning mechanism on Celestia at the Mainnet launch?

**A:** There is no timeline for when Celestia will move to a fee-burning model.

---

**Q:** The `gasLimit`, and `gasPrice` are set by the transaction sender, but
usually there's a provision to estimate how much gasLimit would be required by
a particular type of transaction and an average `gasPrice` based on network
congestion. What is the recommended way to estimate this?

**A:** `celestia-app` already exports `EstimateGas`. For messages that don't
contain blobs (i.e. normal Cosmos SDK transactions like a token transfer)
estimating gas can be done similarly to the example
[here](https://github.com/cosmology-tech/cosmology/blob/main/packages/core/src/messages/utils.ts#L64).

---

**Q:** Is there an endpoint where we can query the `gasLimit` and `gasPrice`?

**A:** The `gasLimit` and `gasPrice` are set by the transaction sender.

## Staking

**Q:** Does Celestia's staking match the Cosmos SDK's?

**A:** Yes.

---

**Q:** Can you please confirm with me that the coins never leave the wallet when
delegating (staking) to a validator on a Celestia network? From my understanding
it's using the Cosmos protocol in terms of validator, and should be the case.
Tokens are at risk of slashing but never leave the wallet, so the owner of the
tokens always have custody of its coins.

**A:** Correct the tokens do not leave the delegator’s wallet. Learn more
[here](https://hub.cosmos.network/main/delegators/delegator-faq.html).

---

**Q:** Do tokens leave the wallet when delegating to a validator on a Celestia
network?

**A:** No, tokens never leave the wallet when delegating (staking) to a
validator on a Celestia network.

---

**Q:** Is slashing expected to be active for misbehaving validators at the
Mainnet launch?

**A:** Yes, slashing for misbehaving validators is expected to be live at
Mainnet launch.

---

**Q:** Is manual withdrawal of rewards necessary?

**A:** Yes, manual withdrawal of rewards that are generated is necessary.

---

**Q:** When do rewards accumuluate?

**A:** Rewards accumulate at every block.

## Consensus

**Q:** Will Celestia use CometBFT PoS consensus?

**A:** Yes, Celestia will use CometBFT PoS (fka Tendermint) consensus.

---

**Q:** How many Mainnet validators will there be?

**A:** The final number of Mainnet validators is 100.

---

**Q:** What is the minimum stake needed for each validator?

**A:** Theoretically, the minimal stake needed for each validator is 1 TIA.

---

**Q:** Can anyone become a validator on Celestia?

**A:** Anyone is allowed to be a validator as long as they stake enough. Note
that "enough" is not a fixed amount; it's determined by who stakes more or
receives more delegations.

### Block production

**Q:** Is block producer selection deterministic or random? Any references
to the exact code where this is happening is also helpful.

**A:** Block producer selection is deterministic given our use of CometBFT
(fka Tendermint) for Consensus.

---

**Q:** Is there information available about the issuance rate for block rewards?

**A:** There is no information on the issuance rate for block rewards yet.

## Developers

**Q:** Can I use cosmjs for Celestia integration into TypeScript or JavaScript?

**A:** Yes, you can. We recommend [Cosmology](https://github.com/cosmology-tech).

---

**Q:** Is there any typescript implementation that you guys have regarding the
decoding of the transaction objects? Since Cosmjs cannot do it directly?

**A:** Not yet available. Cosmology should work out of the box with Celestia,
here is a [demo](https://rollkit.dev/tutorials/gm-world-fronten) with chain
configs for our testnets and a rollup.

### Prefixes for address generation

**Q:** What prefix will Celestia have on Mainnet?

**A:** The prefix is Celestia. You can find this
[here](https://docs.celestia.org/developers/keplr/#add-celestia-network-to-keplr).

### Precision of the Currency

**Q:** What is the smallest decimal point for the currency?

**A:** The smallest decimal point is utia, which is TIA^10-6.

### Explorers

**Q:** What are the best explorers to use?

**A:** View the options for explorers under the respective network's
landing page:

* [Arabica devnet](../../nodes/arabica-devnet)
* [Mocha testnet](../../nodes/mocha-testnet)

### RPC and address state

**Q:** Using these endpoints:

* cosmos/distribution/{_version}/delegators/{address}/rewards
* cosmos/staking/{_version}/delegators/{address}/unbonding_delegations
* cosmos/staking/{_version}/delegations/{address}
* cosmos/bank/{_version}/balances/{address}

Will the same endpoints be available on the celestia nodes? Will we have to
account for other types of balances (such as vesting or locked) to support
your use case?

**A:** Yes, the same endpoints will be available on the Celestia nodes. No,
you will not have to account for other types of balances (such as vesting
or locked).

## Custodians

**Q:** What is the envisioned support for TGE? Examples could be generating
addresses that will be hardcoded into the Genesis file, or generating gentx
(genesis transactions)

**A:** If custodian will be supporting on-chain lockups, then our preference
is to have custodian generate TGE addresses on behalf of itself/its customers.
We will be sharing more specific details about the address creation process
over the coming weeks.

---

**Q:** Will custodians have access to Celestia's nodes when Mainnet goes live?

**A:** Yes, custodians will be able to access Celestia's nodes when Mainnet
goes live.

---

**Q:** Do you know approximately how much later after the Mainnet launch
you're planning to list the Celestia Token on a (centralized) exchange?
It's mainly to plan the following points: - Offer Brokerage for Celestia
to our clients - Custody Fees are usually charged as a percentage of the
total amount under custody. Hence, we usually require an official pricefeed
to calculate the Fiat amount to be charged on the Assets under custody.

**A:** We intend to list our token on centralized exchanges with our mainnet
launch (day one). We intend to list our token on only non-US CEXs with our
mainnet launch.

## Vesting

**Q:** Which types of vesting accounts are used in Cosmos SDK?

**A:** Vesting accounts in Cosmos SDK include linear and delayed vesting.
([source](https://docs.cosmos.network/v0.46/modules/auth/05_vesting.html))

## Governance

**Q:** How will the on-chain governance model work?

**A:** The on-chain governance model will be the same as that of the Cosmos Hub,
albeit much more limited.
