---
description: Learn how you can build celestia-app.
---

# Install celestia-app

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import arabicaVersions from '/.vitepress/constants/arabica_versions.js'
import mochaVersions from '/.vitepress/constants/mocha_versions.js'
import mainnetVersions from '/.vitepress/constants/mainnet_versions.js'
</script>

This tutorial will guide you through installing celestia-app, both
[from source](#building-binary-from-source) and with
[a pre-built binary](#installing-a-pre-built-binary)

## Building binary from source

This section of the tutorial presumes you completed the steps in
[setting up your own environment](./environment.md).

The steps below will create a binary file named `celestia-appd`
inside `$HOME/go/bin` folder which will be used later to run the node.
Be sure to select the correct network to install the binary for.

1. Remove any existing copy of celestia-app, clone the repository,
   and change into the directory:

   ```bash
   cd $HOME
   rm -rf celestia-app
   git clone https://github.com/celestiaorg/celestia-app.git
   cd celestia-app
   ```

2. Check out to the desired version, based on the network you will use:

   ::: code-group

   ```bash-vue [Mainnet Beta]
   git checkout tags/{{mainnetVersions['app-latest-tag']}} -b {{mainnetVersions['app-latest-tag']}}
   ```

   ```bash-vue [Mocha]
   git checkout tags/{{mochaVersions['app-latest-tag']}} -b {{mochaVersions['app-latest-tag']}}
   ```

   ```bash-vue [Arabica]
   git checkout tags/{{arabicaVersions['app-latest-tag']}} -b {{arabicaVersions['app-latest-tag']}}
   ```

   :::

3. Build and install the `celestia-appd` binary:

   ```bash
   make install
   ```

4. To check if the binary was successfully installed you can run the binary
   using the `--help` flag:

   ```sh
   celestia-appd --help
   ```

You will see an output with the menu for `celestia-appd`. Learn more
on the [helpful CLI commands page](./celestia-app-commands.md)

## Installing a pre-built binary

Installing a pre-built binary is the fastest way to get started with your
Celestia consensus node. Releases after celestia-app v1.3.0 should have
these binaries available.

The steps below will download a binary file named `celestia-appd`.
Depending on the setup that you choose during installation, the `celestia-appd`
binary will be available at either:

- `$HOME/celestia-app-temp/celestia-appd`
- `/usr/local/bin/celestia-appd`

Pre-built binaries are available for:

- Operating systems: Darwin (Apple), Linux
- Architectures: x86_64 (amd64), arm64

To install the latest pre-built binary you can run this command in your
terminal:

```bash
bash -c "$(curl -sL https://docs.celestia.org/celestia-app.sh)"
```

Follow the instructions in the terminal output to choose your installation
preferences.

You will see an output with the menu for `celestia-appd`. Learn more
on the [helpful CLI commands page](./celestia-app-commands.md)

View [the script](https://github.com/celestiaorg/docs/tree/main/public/celestia-app.sh)
to learn more about what it is doing.

## Ports

When interacting with a consensus node,
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

The following ports are used by Celestia app nodes:

| Port  | Protocol | Address   | Description | Enabled by default on node     | Flag                    |
| ----- | -------- | --------- | ----------- | ------------------------------ | ----------------------- |
| 2121  | TCP/UDP  | localhost | P2P         | true                           | N/A                     |
| 9090  | HTTP     | 0.0.0.0   | gRPC        | true                           | `--grpc.address string` |
| 26657 | TCP      | localhost | RPC         | false (only open to localhost) | `--rpc.laddr string`    |
