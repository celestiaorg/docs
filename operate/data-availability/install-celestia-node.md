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

The installation script will download a binary file named `celestia`. Depending on your chosen installation option, the `celestia` binary will be available at one of these locations:

- `$GOPATH/bin/celestia` (if Go is installed)
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
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)" -- -v v0.28.4
```

The script will:

1. Detect your system's operating system and architecture
2. Download the appropriate binary
3. Verify the checksum for security
4. Provide installation location options based on your environment:
   - If Go is installed:
     - Go bin directory (`$GOPATH/bin`)
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

To upgrade your binary, you can install the latest version from the
instructions above and restart your node. If you run into any issues,
Refer to the [troubleshooting section](/operate/maintenance/troubleshooting).