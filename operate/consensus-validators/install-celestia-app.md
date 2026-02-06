# Install celestia-app

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
[setting up your own environment](/operate/getting-started/environment-setup).

The steps below will create a binary file named `celestia-appd`
inside `$HOME/go/bin` folder which will be used later to run the node.
Be sure to select the correct network to install the binary for.

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

```bash
# Install latest version
bash -c "$(curl -sL https://docs.celestia.org/celestia-app.sh)"

# Install specific version, latest version for Mocha testnet in this example
bash -c "$(curl -sL https://docs.celestia.org/celestia-app.sh)" -- -v v6.4.10-mocha
```

Follow the instructions in the terminal output to choose your installation
preferences.

You will see an output with the menu for `celestia-appd`. Learn more
on the [helpful CLI commands page](/operate/consensus-validators/cli-reference)

View [the script](https://github.com/celestiaorg/docs/blob/main/public/celestia-app.sh)
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
| 2121  | TCP/UDP  | 127.0.0.1 | P2P         | true                           | N/A                     |
| 9090  | HTTP     | 0.0.0.0   | gRPC        | true                           | `--grpc.address string` |
| 26657 | TCP      | 127.0.0.1 | RPC         | false (only open to localhost) | `--rpc.laddr string`    |

## Next steps

Now that you've installed `celestia-appd`, learn how to run a [consensus](/operate/consensus-validators/consensus-node) and [validator](/operate/consensus-validators/validator-node) node.