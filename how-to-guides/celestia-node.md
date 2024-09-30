---
description: Learn to build and install celestia-node.
---

# Install celestia-node

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import arabicaVersions from '/.vitepress/constants/arabica_versions.js'
import mochaVersions from '/.vitepress/constants/mocha_versions.js'
import mainnetVersions from '/.vitepress/constants/mainnet_versions.js'
</script>

## Installing from source

This section goes over building and installing celestia-node. This
tutorial assumes you completed the steps in
[setting up your development environment](./environment.md).

Install the celestia-node binary by running the following
commands:

1. Remove any existing copy of celestia-node, clone the repository,
   and change into the directory:

   ```bash
   cd $HOME
   rm -rf celestia-node
   git clone https://github.com/celestiaorg/celestia-node.git
   cd celestia-node/
   ```

2. Check out to the desired version, based on the network you will use:

   ::: code-group

   ```bash-vue [Mainnet Beta]
   git checkout tags/{{mainnetVersions['node-latest-tag']}}
   ```

   ```bash-vue [Mocha]
   git checkout tags/{{mochaVersions['node-latest-tag']}}
   ```

   ```bash-vue [Arabica]
   git checkout tags/{{arabicaVersions['node-latest-tag']}}
   ```

   :::

3. Build the `celestia` binary:

   a. Standard build

   ```bash
   make build
   ```

   b. Experimental build

   :::tip OPTIONAL
   If you're a node operator comfortable with experimental features and
   seeking optimal performance with minimal RAM usage, this option is
   recommended for you.

   ```bash
   make build-jemalloc
   ```

   This build option enables CGO, and downloads and installs
   [jemalloc](https://jemalloc.net/).
   [Learn more about the build command](https://github.com/celestiaorg/celestia-node/releases/tag/v0.12.1#:~:text=%F0%9F%8F%97%EF%B8%8F-,New%20build%20option,-%3A%20Makefile%20now%20has).
   :::

4. Install the binary:

   ```bash
   make install
   ```

5. Build the `cel-key` utility:

   ```bash
   make cel-key
   ```

6. Verify that the binary is working and check the version:

   ```bash
   celestia version
   ```

The output will show the semantic version of celestia-node,
commit hash, build date, system version, and Golang version.

## Installing a pre-built binary

Installing a pre-built binary is the fastest way to get started with your
Celestia data availability node. Releases after celestia-node v0.13.3 should have
these binaries available.

The steps below will download a binary file named `celestia`.
Depending on the setup that you choose during installation, the `celestia`
binary will be available at either:

- `$HOME/celestia-node-temp/celestia`
- `/usr/local/bin/celestia`

Pre-built binaries are available for:

- Operating systems: Darwin (Apple), Linux
- Architectures: x86_64 (amd64), arm64

To install the latest pre-built binary you can run this command in your
terminal:

```bash
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)"
```

Follow the instructions in the terminal output to choose your installation
preferences.

You will see an output with the menu for `celestia`.

View [the script](https://github.com/celestiaorg/docs/tree/main/public/celestia-node.sh)
to learn more about what it is doing.

## Next steps

First, we recommend [reading the overview](./overview.md)
of our node types, if you haven't yet.

Now that you've installed Celestia Node, it's time to
[pick your node type](./decide-node.md) and run your node!

If you're planning to run a light node,
we recommend the [node RPC CLI tutorial](../tutorials/node-tutorial.md).

## Upgrading your binary

To upgrade your binary, you can install the latest version from the
instructions above and restart your node. If you run into any issues,
Refer to the [troubleshooting section](./celestia-node-troubleshooting.md).
