# Install celestia-node

## Supported architectures

Celestia-node officially supports the following architectures:

- linux/amd64
- linux/arm64
- darwin/amd64 (macOS Intel)
- darwin/arm64 (macOS Apple Silicon)

Only these four architectures are officially tested and supported.

## Installing from source

This section goes over building and installing celestia-node. This
tutorial assumes you completed the steps in
[setting up your development environment](/operate/getting-started/environment-setup).

Install the celestia-node binary by running the following
commands:

## Installing a pre-built binary

Installing a pre-built binary is the fastest way to get started with your Celestia data availability node. Releases after celestia-node v0.13.3 have these binaries available.

The installation script will download a binary file named `celestia`. Depending on your environment and chosen installation option, the `celestia` binary will be available at one of these locations:

- The Homebrew bin directory (usually `/opt/homebrew/bin/celestia` on Apple silicon or `/usr/local/bin/celestia` on Intel Macs) when Go is installed with Homebrew
- `$GOBIN/celestia`, or `$GOPATH/bin/celestia` when `GOBIN` is unset, for other Go installations
- `/usr/local/bin/celestia`
- `$HOME/celestia-node-temp/celestia`

Pre-built binaries are available for:

- Operating systems: Darwin (Apple), Linux
- Architectures: x86_64 (amd64), arm64

### Installation Options

You can install the latest version or specify a particular version:

```bash
# Install latest version
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)"

# Install specific version, Mainnet Beta in this example
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)" -- -v v0.32.1
```

The script will:

1. Detect your system's operating system and architecture
2. Download the appropriate binary
3. Verify the checksum for security
4. Provide installation location options based on your environment:
   - If Go is installed:
     - Detected Go bin directory (the Homebrew bin directory when Go is installed with Homebrew, otherwise `$GOBIN` or `$GOPATH/bin`)
     - System bin directory (`/usr/local/bin`)
     - Keep in current directory
   - If Go is not installed:
     - System bin directory (`/usr/local/bin`)
     - Keep in current directory

Follow the instructions in the terminal output to choose your installation preferences. After installation, you can verify the setup by checking the version:

```bash
celestia version && celestia --help
```

View [the script](https://github.com/celestiaorg/docs/blob/main/public/celestia-node.sh) to learn more about what it is doing.

> **Note**: The script maintains a log file at `$HOME/celestia-node-temp/logfile.log` for troubleshooting purposes.

## Next steps

First, we recommend [reading the overview](/operate/getting-started/hardware-requirements)
of our node types, if you haven't yet.

Now that you've installed Celestia Node, it's time to
[pick your node type](/operate/getting-started/overview) and run your node!

If you're planning to run a light node,
we recommend the [quick-start guide](/operate/data-availability/light-node/quickstart/).

## Upgrading your binary

To upgrade your binary, install the latest version using the instructions above.

When upgrading from a version earlier than celestia-node v0.31.3 to v0.31.3 or later, update the node configuration after replacing the binary and before starting the node:

```bash
celestia <node_type> config-update --p2p.network <network>
```

The [v0.31.3 release](https://github.com/celestiaorg/celestia-node/releases/tag/v0.31.3) adds support for Mainnet Beta v9 and introduces new config fields. The command merges those fields into the existing configuration while preserving custom values. Review your configuration after the update, then start the node. If you run into any issues, refer to the [troubleshooting section](/operate/maintenance/troubleshooting#resetting-your-config).