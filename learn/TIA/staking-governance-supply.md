# Staking, governance, & supply

## Proof-of-stake on Celestia

Celestia is a proof-of-stake blockchain based on CometBFT and the Cosmos SDK.
Celestia supports in-protocol delegation and will start with an initial
validator set of 100.

Staking TIA as a validator or delegator enables you to earn staking rewards from
the network. Validators charge a fee to delegators which gives them a percentage
of staking rewards.

Learn
[how proof of stake works on Cosmos SDK chains like Celestia](https://docs.cosmos.network/main/modules/staking).

| Consensus mechanism  | Proof-of-stake |
| -------------------- | -------------- |
| Blockchain framework | Cosmos SDK     |
| Validator set size   | 100            |
| Delegation support   | Yes            |

Learn how to
[stake on your own at the community dashboards](/learn/tia/staking).

## Inflation

TIA inflation started at 8% annually.

1. Initially, it was set to decrease by 10% every year until reaching a long-term issuance rate of 1.5%.

2. With the v4 Lotus upgrade ([CIP-29](https://cips.celestia.org/cip-029.html)) in July 2025, the inflation rate dropped from ~7.2% to ~5.0% and was set to continue decreasing by 6.7% every year until it stabilized at 1.5%.

3. With the v6 ([CIP-41](https://cips.celestia.org/cip-041.html#inflation-schedule-over-time)) upgrade in November 2025, the inflation rate again dropped to ~2.5% and will continue to decrease by 6.7% every year until it stabilizes at 1.5%.

The diagram below illustrates both the initial inflation rates and those after the v6 upgrade.

![inflation diagram](/img/learn/TIA_inflation_post-cip41.jpg)

For an in-depth understanding, refer to
[ADR019](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-019-strict-inflation-schedule.md).

## Decentralised governance

### Network parameters

TIA holders (not just stakers) can propose and vote on governance proposals to
change a subset of network parameters. To learn more, see a
[complete list of both the changeable and non-changeable parameters and their values](https://celestiaorg.github.io/celestia-app/parameters_v6.html).
Additionally, learn how to
[submit and vote on governance proposals](/operate/consensus-validators/cli-reference#governance).

### Community pool

Starting at genesis, Celestia’s
[community pool](https://docs.cosmos.network/main/modules/distribution)
receives 2% of all Celestia block rewards. TIA stakers may vote to fund
ecosystem initiatives as in many other Cosmos SDK chains.

Learn how to
[submit a governance proposal to spend community pool funds](/operate/consensus-validators/cli-reference#community-pool).

## TIA allocation at genesis

Celestia will have a total supply of 1,000,000,000 TIA at genesis,
split across five categories described in the chart and table below.

![allocation diagram](/img/learn/Celestia_TIA_Allocation_at_Genesis.png)

| Category                  | Description                                                                                                                                                                                                                                   | %      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Public Allocation         | Genesis Drop and Incentivized Testnet: 7.41%<br/>Future initiatives: 12.59%                                                                                                                                                                   | 20.00% |
| R&D & Ecosystem           | Tokens allocated to the Celestia Foundation and core devs for research, development, and ecosystem initiatives including:<br/>- Protocol maintenance and development<br/>- Programs for rollup developers, infrastructure, and node operators | 26.79% |
| Early Backers: Series A&B | Early supporters of Celestia                                                                                                                                                                                                                  | 19.67% |
| Early Backers: Seed       | Early supporters of Celestia                                                                                                                                                                                                                  | 15.90% |
| Initial Core Contributors | Members of Celestia Labs, the first core contributor to Celestia                                                                                                                                                                              | 17.64% |

### Unlocks

Celestia’s 1 billion TIA supply at genesis will be subject to several different
unlock schedules. All tokens, locked or unlocked, may be staked, but staking
rewards are unlocked upon receipt and will add to the circulating supply.

**Circulating supply** is defined as the amount of TIA tokens in general
circulation without onchain transfer restrictions.

**Available supply** is defined as the amount of TIA tokens that are either part
of the circulating supply or are unlocked but subject to some form of governance
to determine when the tokens are allocated. This includes the unlocked portion
of the R&D & Ecosystem tokens and the tokens set aside for future initiatives.

_The definitions for circulating and available supply were adapted from
[Optimism’s definitions](https://community.optimism.io/docs/governance/allocations/#token-distribution-details)._

![supply diagram](/img/learn/Celestia_TIA_Available_Supply.png)

Unlock schedule by category is described in the table below.

_Note: Due to 2024 being a leap year, the yearly unlock intervals will occur on October 30th of each year. For example, unlocks at year 1 will occur on October 30, 2024._

| Category                  | Unlock Schedule                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| Public Allocation         | Fully unlocked at launch.                                                                   |
| R&D & Ecosystem           | 25.00% unlocked at launch.<br/>Remaining 75.00% unlocks continuously from year 1 to year 4. |
| Initial Core Contributors | 33.33% unlocked at year 1.<br/>Remaining 66.67% unlocks continuously from year 1 to year 3. |
| Early Backers: Seed       | 33.33% unlocked at year 1.<br/>Remaining 66.67% unlocks continuously from year 1 to year 2. |
| Early Backers: Series A&B | 33.33% unlocked at year 1.<br/>Remaining 66.67% unlocks continuously from year 1 to year 2. |