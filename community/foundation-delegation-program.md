# The Celestia Foundation Delegation Program

![Delegation program banner](/img/foundation-delegation-program.jpg)

## Objectives of the program

The primary objectives of the Celestia Foundation Delegation Program are:

* To provide a fair opportunity for Celestia’s users to join the validator set,
while ensuring the validator set remains proficient, trustworthy,
and dependable.
* To maintain network stability by promoting a steady transition of validators
and avoiding sudden and disruptive changes in participation.
* To enable the Celestia Foundation to use its stake towards its mission of
fostering a modular blockchain network that delivers exceptional performance.

## Foundation delegation process

### Program launch

Prospective validators are welcome to apply to the program starting February 6,
2024. The application is designed to assess a validator’s uptime performance
and contributions to the Celestia ecosystem. Of the 100 total slots in
Celestia’s active validator set, up to 50 will receive delegations within the
program.

Application submissions will be reviewed by the Celestia Foundation. More
details about the application and eligibility criteria are described below.

### Cohort process

![cohort timeline](/img/cohort-timeline.jpg)

Every 4 months, the Celestia Foundation will distribute a portion of the
Foundation’s total available stake to a cohort of validators who meet
certain criteria, detailed below. Here is an overview of how the cohort
process will work for Cohort 1 and what that means for future cohorts.

### Key Points

* Initial Cohort (Cohort 1): 50 applicants will be accepted
  * Grading System: Applicants in Cohort 1 are divided into first, second,
  and third place based on eligibility criteria outlined in this document.
  * Delegation Duration: This varies based on the applicant’s placement in
  Cohort 1. First place receives 12 months of delegation, second place receives
  8 months, third place receives 4 months.

| Tier          | Placement       | Delegation Duration | Renewal By Cohort |
|---------------|-----------------|---------------------|-------------------|
| First Place   | Applicants 1-20 | 12 months           | Cohort 4          |
| Second Place  | Applicants 21-35| 8 months            | Cohort 3          |
| Third Place   | Applicants 36-50| 4 months            | Cohort 2          |

* Subsequent Cohorts (Cohorts 2-onwards):
  * After Cohort 1, open slots may be filled by Cohort 1 members up for
  renewals or new applicants. There will be no Tiers (e.g. First Place,
  Second Place, Third Place) in cohorts after Cohort 1. This structure
  allows for a steady flow of both existing applicants and new applicants
  to maintain a stable set of participants in the program.

During this period, so long as the validator maintains high uptime and
does not violate the rules of the program, the validator will receive
the delegation for the duration of the cohort they are currently in.

### Eligibility criteria

The minimum requirements for participation in the program are as follows:

* Run an active Mainnet Beta validator **or** an active Mocha testnet validator
for at least 1 month before application deadline
* Run a bridge node (on Mainnet Beta if you are already an active Mainnet Beta
validator or on Mocha testnet if not) that is connected and reporting
to the Celestia Labs [OTEL collector](../how-to-guides/celestia-node-metrics.md)
(for new applicants - on testnet, so that we can evaluate performance)
* Not jailed or slashed in the 6 months before application deadline
* Not associated with an exchange or custodian
* Not in the top 10 validators by delegation power, unless it enters the
top 10 as a result of the Foundation’s delegation under this program
* Have 10% or less commission
* Not based within the US, within any country subject to economic sanctions,
or within any other prohibited jurisdiction, and successfully complete a
compliance screen
* Dedicated email address so that the Foundation can reach you in the event
of emergency upgrades and fixes
* Maintain a fully archival (non pruned) bridge node for both Mainnet Beta and Mocha if selected for the program
* Not running your infrastructure in Hetzner or OVH 

Not adhering to any of the criteria above will automatically disqualify your
application, and violating any of the criteria after you have received
delegation will result in withdrawal of the delegation. A participant
who loses stake due to being jailed by the protocol may reapply to the
program after 2 cohort periods.

Applicants are also expected to have reviewed Celestia docs and recommended
guides on devops and monitoring setups.

Other optional but important criteria:

* Develop and maintain developer tooling, services, applications, and
dashboards
* Work on projects aligned with Celestia's values
* Contribute to documentation and new guides and tutorials
* Quality of infrastructure
* Operated within a location that improves geolocation of the validator set

### Undelegation criteria

* Getting slashed/tombstoned (cannot apply for 1 year afterwards)
* Getting jailed more than once during the cohort’s applicable delegation
period
* Violating the
[Celestia.org Community Code of Conduct](../community/coc.md)
or engaging in harmful activities towards the network
* Failing to upgrade your node in a timely manner (24 hours or less)
* If necessary to protect or secure Mainnet Beta or to comply with applicable
law
* For any other reason, in the Celestia Foundation’s sole discretion

## Application

The program will be divided into cohorts with applications open for new
applicants and renewal of existing applicants every 4 months. Validators
will be delegated for up to a year. For each cohort, the deadline to
apply/be evaluated (if you are reapplying) is exactly 1 month prior to
the date of being delegated to.

### Application details

Before applying, be ready to share the following:

* General info
  * Security Email
  * Validator Entity Name
  * Discord ID
  * Mark if entity or individual
  * Website if any
  * Github page of your organization
  * Team experience and roster (including Twitter + Github links)
  * Which networks you validate on Mainnet Beta + links to your validators
  * A personal statement why you should receive delegation from the
  Foundation (max 1500 characters)
* Infrastructure
  * Validator address and bridge node ID on Mainnet Beta
  * If you don't run an active Mainnet Beta validator, please provide us with
  validator address, bridge node ID and blobstream address on Mocha-4
  * Have you been slashed or jailed in the last 6 months on Celestia or
  other chains you validated on.
  * Hosting provider and Data Center location (Mainnet Beta and testnet if applicable)
  * Setup of the 2 components (validator and bridge)
    * Hardware
    * Security setup (servers, private keys)
    * Monitoring and alerting
* Contributions
  * Please list all technical contributions for Celestia and its ecosystem
  * Please list all community contributions for Celestia and its ecosystem

Please note, the objective of the program is to contribute to Celestia’s
resilience and uptime. If you contribute a lot to the Celestia ecosystem,
but your validator uptime is low, this will negatively impact your chance
at selection for the program. Furthermore, merely receiving delegation
from the Foundation under the program does not guarantee your placement
in the active validator set.

[Get Started with the Application Form](https://forms.gle/RHTLvvkF4jHuaviEA)

## Cohort information

The Foundation will report each cohort’s composition and the duration of
their respective delegations.

* [Cohort 1](https://docs.google.com/spreadsheets/d/1Fxu9uYJ4wxfHChEiSg5bmXAMU8IZSq7J3GYDCFgk1HA/edit#gid=0): 50 Validator Seats
* [Cohort 2](https://docs.google.com/spreadsheets/d/1Fxu9uYJ4wxfHChEiSg5bmXAMU8IZSq7J3GYDCFgk1HA/edit?gid=855157686#gid=855157686): 15 Validator Seats (Applications open June 1, 2024)
* Cohort 3: 15 Validator Seats (Applications open October 1, 2024)
* Cohort 4: 20 Validator Seats (Applications open February 1, 2025)

IMPORTANT: Each validator selected for the program has to maintain a fully archival (non pruned) bridge node for both Mainnet Beta and Mocha.

## Feedback process

Validators in the program will receive a feedback form every quarter, so
the program can be continually improved.
