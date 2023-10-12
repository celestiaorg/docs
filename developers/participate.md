<!-- markdownlint-disable MD033 -->

# Participate in the Celestia testnets

<script setup>
import ArabicaVersionTags from '../.vitepress/components/ArabicaVersionTags.vue'
import MochaVersionTags from '../.vitepress/components/MochaVersionTags.vue'
import CoffeeVersionTags from '../.vitepress/components/CoffeeVersionTags.vue'
import InlineText from '../.vitepress/components/InlineText.vue'
import constants from '../.vitepress/versions/constants.js'
</script>

Celestia currently has two existing testnets that you can participate in:

- Coffee: TBD
  <CoffeeVersionTags/>
- Arabica devnet: A devnet focused on developers who
  want to deploy sovereign rollups on the latest changes from Celestia's codebase.
  Arabica will be updated frequently and might be unstable at times given new updates.
  Validators won't be able to validate on Arabica as it is not designed for
  validators to participate.
  - Compatible software versions
    <ArabicaVersionTags/>
- Mocha testnet: A testnet focused on enabling validators
  to test out their infrastructure by running nodes connected to the network. Developers
  can also deploy sovereign rollups on Mocha, it just will always be behind Arabica
  as Mocha upgrades are slower given they need to be done via hardforks in coordination
  with the validator community on Mocha.
  - Compatible software versions
    <MochaVersionTags/>

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

## DRAFT AREA

Mocha's chain ID is currently: <InlineText :constant="constants.mochaChainId"/>

Arabica's chain ID is currently: <InlineText :constant="constants.arabicaChainId"/>
