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

Celestia-app is the software that enables you to run
consensus nodes (including validators) and provide RPC endpoints.

## Supported architectures

Celestia-app officially supports the following architectures:

- linux/amd64
- linux/arm64
- darwin/amd64 (macOS Intel)
- darwin/arm64 (macOS Apple Silicon)

Only these four architectures are officially tested and supported.

## Building binary from source

This section of the tutorial assumes you completed the steps in
[setting up your own environment](/how-to-guides/environment.md).

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
   git checkout tags/{{mainnetVersions['app-latest-tag']}}
   ```

   ```bash-vue [Mocha]
   git checkout tags/{{mochaVersions['app-latest-tag']}}
   ```

   ```bash-vue [Arabica]
   git checkout tags/{{arabicaVersions['app-latest-tag']}}
   ```

   :::

3. Build and install the `celestia-appd` binary with multiplexer support:

   ```bash
   make install
   ```

4. To check if the binary was successfully installed you can run the binary
   using the `--help` flag:

   ```sh
   celestia-appd --help
   ```

You will see an output with the menu for `celestia-appd`. Learn more
on the [helpful CLI commands page](/how-to-guides/celestia-app-commands.md)

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

To install the latest, or a specific version of the pre-built binary you can run this command in your
terminal:

```bash-vue
# Install latest version
bash -c "$(curl -sL https://docs.celestia.org/celestia-app.sh)"

# Install specific version, latest version for Mocha testnet in this example
bash -c "$(curl -sL https://docs.celestia.org/celestia-app.sh)" -- -v {{mochaVersions['app-latest-tag']}}
```

Follow the instructions in the terminal output to choose your installation
preferences.

You will see an output with the menu for `celestia-appd`. Learn more
on the [helpful CLI commands page](/how-to-guides/celestia-app-commands.md)

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

| Port  | Protocol | Address   | Description                                                         | Enabled by default on node     | Flag                       |
| ----- | -------- | --------- | ------------------------------------------------------------------- | ------------------------------ | -------------------------- |
| 1317  | HTTP     | 0.0.0.0   | REST API (gRPC-gateway) - HTTP endpoints for blockchain queries    | true                           | `--api.address string`     |
| 2121  | TCP/UDP  | 127.0.0.1 | P2P networking - Communication between nodes in the network        | true                           | N/A                        |
| 9090  | HTTP     | 0.0.0.0   | gRPC server - Programmatic access for advanced integrations        | true                           | `--grpc.address string`    |
| 26657 | TCP      | 127.0.0.1 | Tendermint RPC - JSON-RPC server for blockchain queries and txs    | false (only open to localhost) | `--rpc.laddr string`       |

## Understanding port exposure and security

### External exposure requirements

When setting up your consensus node, understanding which ports need external
access is crucial for both functionality and security:

**Ports that typically need external exposure:**

- **Port 2121**: Required for P2P connectivity with other nodes in the network
- **Port 9090**: Needed if your node will serve gRPC clients (like bridge nodes)
- **Port 26657**: Required for external RPC access (enable with `--rpc.laddr tcp://0.0.0.0:26657`)

**Ports for internal/localhost access:**

- **Port 1317**: REST API, often used internally or through proxies
- **Port 26657**: By default only listens on localhost for security

### App vs Core endpoint distinction

Celestia consensus nodes expose different types of endpoints:

**App-level endpoints** (Cosmos SDK):

- **Port 1317**: REST API using gRPC-gateway for HTTP-based blockchain queries
- **Port 9090**: gRPC server for efficient programmatic access to blockchain data

**Core-level endpoints** (Tendermint/CometBFT):

- **Port 26657**: Tendermint RPC for consensus-layer operations, transaction submission, and blockchain queries
- **Port 2121**: P2P networking for consensus communication between validators and nodes

For bridge nodes connecting to your consensus node, they typically use the gRPC endpoint (port 9090) to access blockchain data efficiently. The distinction matters because app-level endpoints provide access to application state and transactions, while core-level endpoints handle consensus operations and network communication.

For more details on Cosmos SDK APIs, see the [Cosmos SDK documentation](https://docs.cosmos.network/main/core/grpc_rest).

## Next steps

Now that you've installed `celestia-appd`, learn how to run a [consensus](/how-to-guides/consensus-node.md) and [validator](/how-to-guides/validator-node.md) node.
