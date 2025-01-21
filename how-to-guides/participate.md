<!-- markdownlint-disable MD033 -->

# Participate in the Celestia networks

<!-- ## Coffee -->

<script setup>
import ArabicaVersionTags from '../.vitepress/components/ArabicaVersionTags.vue'
import MochaVersionTags from '../.vitepress/components/MochaVersionTags.vue'
import MainnetVersionTags from '../.vitepress/components/MainnetVersionTags.vue'
import constants from '../.vitepress/constants/constants.js'
</script>

## Mainnet Beta

Celestia’s [Mainnet Beta](./mainnet.md) is the production network
for deploying Mainnet Beta rollups and applications. This marks the
culmination of years of development and community testing. While
the network is stable and continues to receive updates, it remains
experimental and users may experience occasional instability or
reduced performance.

### Compatible software versions for Mainnet Beta

<MainnetVersionTags/>

## Testnets

Celestia currently has two existing testnets that you can participate in:

### Arabica Devnet

[Arabica devnet](./arabica-devnet.md) is a devnet focused on developers who
want to deploy sovereign rollups on the latest changes from Celestia's codebase.
Arabica will be updated frequently and might be unstable at times given new updates.
Validators won't be able to validate on Arabica as it is not designed for
validators to participate.

#### Compatible software versions for Arabica devnet

<ArabicaVersionTags/>

### Mocha testnet

[Mocha testnet](./mocha-testnet.md) is a testnet focused on enabling validators
to test out their infrastructure by running nodes connected to the network. Developers
can also deploy sovereign rollups on Mocha, it just will always be behind Arabica
as Mocha upgrades are slower given they need to be done via breaking network upgrades
in coordination with the validator community on Mocha.

### Compatible software versions for Mocha testnet

<MochaVersionTags/>

## Network upgrades

There are a few ways to stay informed about network upgrades:

- Telegram [announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord [Mainnet Beta announcements](https://discord.com/channels/638338779505229824/1169237690114388039)
- Discord [Mocha announcements](https://discord.com/channels/638338779505229824/979037494735691816)

See the [network upgrade process page](./network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](./network-upgrade-process.md#ginger-network-upgrade).
