---
description: A guide to troubleshooting common issues with Celestia Node.
next:
  text: "Metrics, visualization, and alerts"
  link: "nodes/celestia-app-metrics"
---

# Troubleshooting

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

## Network selection

Note: If you do not select a network, the default network will be Mainnet Beta.

```sh
celestia <node-type> init --p2p.network <network>
celestia <node-type> start --p2p.network <network> --core.ip <URI>
```

:::tip
Refer to [the ports section of this page](#ports)
for information on which ports are required to be open on your machine.
:::

:::tip NOTE
It is advised before switching networks to reinitialize
your node via `init` command. This is due to an old config being present.
Re-initialisation will reset the config.
:::

### Chain ID

When interacting with celestia-node, it is important to take into account
the different chain IDs for different networks. For Mainnet Beta, there is
no need to declare a chain ID, as the default is {{ constants.mainnetChainId }},
_i.e._ no `--p2p.network string` flag is required for Mainnet Beta.

| Network      | Chain ID                       | `--p2p.network string`                  |
| ------------ | ------------------------------ | --------------------------------------- |
| Mainnet Beta | {{ constants.mainnetChainId }} | not required (`--p2p.network celestia`) |
| Mocha        | {{ constants.mochaChainId }}   | `--p2p.network mocha`                   |
| Arabica      | {{ constants.arabicaChainId }} | `--p2p.network arabica`                 |

## Ports

When interacting with a Celestia node,
you may need to open ports on your machine to allow
communication between nodes, such as bridge nodes. It is essential that
specific ports are accessible. Make sure that your firewall allows
connections to the correct ports.

If you run a node on a cloud server, make sure that the ports are open
on the server's firewall. If you run a node at home, make sure that your
router allows connections to the correct ports.

For example, validator ports 9090
and 26657 need to be accessible by the bridge, and port 2121 is
required for P2P connections for all node types.

The following ports are used by Celestia nodes:

| Port  | Protocol | Address   | Description  | Enabled by default on node | Flag                    |
| ----- | -------- | --------- | ------------ | -------------------------- | ----------------------- |
| 2121  | TCP/UDP  | localhost | P2P          | true                       | N/A                     |
| 26658 | HTTP     | localhost | RPC          | true                       | `--rpc.port string`     |
| 26659 | HTTP     | localhost | REST Gateway | false                      | `--gateway.port string` |

:::warning
The gateway endpoints have been deprecated and will be removed in the future.
If you would like to use them anyway, you can
[find more details on GitHub](https://github.com/celestiaorg/celestia-node/pull/2360).
:::

## Changing the location of your node store

In this section, we'll guide you through starting your node using a
node store in a different location than you originally started with.

First, stop your node safely using `control + C`.

Then, init your node again with a new node store:

```bash
celestia <node-type> init --node.store /home/user/celestia-<node-type>-location/ \
    --p2p.network mocha
```

Next, start your node:

```bash
celestia full start --core.ip rpc-mocha.pops.one --p2p.network mocha \
    --node.store /home/user/celestia-<node-type>-location/
```

If you choose to change the location of your node store,
you will need to execute each command on your node with
the following flag:

```bash
--node.store /home/user/celestia-<node-type>-location/
```

When using `cel-key`, the process is different.
To show the keys you should add `--keyring-dir` like this example:

```bash
./cel-key list --p2p.network mocha --node.type full \
    --keyring-dir /home/user/celestia-<node-type>-location/keys/
```

## Resetting your config

If you an encounter an error, it is likely that an old config file is present:

```sh
Error: nodebuilder/share: interval must be positive; nodebuilder/core: invalid IP addr given:

# or

Error: nodebuilder/share: interval must be positive
```

You can re-initialize your node's config with the following commands:

:::tip
Save your config so custom values are not lost.
:::

Run the following command to update your config:

```bash
celestia <node-type> config-update --p2p.network <network>
```

This will pull in any new values from new configuration
and merge them into the existing configuration.

:::tip
After using the `config-update` command, it is encouraged to
double-check that your custom values are preserved.
:::

Then, to start your node again:

```bash
celestia <node-type> start --p2p.network <network>
```

## Clearing the data store

For **bridge, full, and light nodes**,
remove the data store with this command:

```bash
celestia <node-type> unsafe-reset-store --p2p.network <network>
```

```bash
celestia light unsafe-reset-store --p2p.network mocha
```

## FATAL headers given to the heightSub are in the wrong order

If you observe a FATAL log line like:

```bash
FATAL   header/store   store/heightsub.go:87    PLEASE FILE A BUG REPORT: headers given to the heightSub are in the wrong order"
```

then it is possible the celestia-node `data/` directory contains headers from a
previous instance of the network that you are currently trying to run against.
One resolution strategy is to delete the existing celestia-node config for the
target network and re-initialize it:

```sh
# rm -rf ~/.celestia-<node-type>-<network>
rm -rf ~/.celestia-bridge-private

# celestia <node-type> init --p2p.network <network>
celestia bridge init --p2p.network private
```
