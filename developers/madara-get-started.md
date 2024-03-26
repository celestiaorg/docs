# Build upon Madara

In this section, we will guide you through the building process so you can
start hacking on the Madara stack. We will go from running your chain locally
to interacting with it using smart contracts.

## Let's start

Madara offers two setup methods tailored to your preferences:

- **Karnot CLI**: A CLI tool managed by [Karnot](https://karnot.xyz) which
  automates and simplifies Madara's setup and installation. This is suitable for
  users who prefer a user-friendly approach.
- **Building from Source**: Build Madara from its source code, allowing finer
  control over Madara's settings and behavior, suited for more advanced users
  or those with specific customization needs.

## Using Karnot CLI

Developed by the Karnot team, the Karnot CLI streamlines app chain deployment
by automating configuration and setup.

The following repository outlines how to initialize and deploy your Madara
node using Karnot CLI.
`https://github.com/karnotxyz/karnot-cli`

### Clone the Madara CLI repository: `https://github.com/karnotxyz/karnot-cli`

```bash
git clone https://github.com/karnotxyz/madara-cli
```

### Build the CLI

```bash
cd madara-cli
cargo build --release
```

### Initialize a new app chain

```bash
./target/release/madara init
```

Fund the DA account (if applicable)

### Run the app chain

```bash
./target/release/madara run
```

### Explore StarkCompass

- Access the web interface at: `http://localhost:4000`
- Use `./target/release/madara explorer` for advanced insights.

## Cloning the Madara repository

<!-- markdownlint-disable MD013 -->

### Install dependencies

We first need to make sure you have everything needed to complete this tutorial.
| Dependency | Version | Installation |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Rust | rustc 1.69.0-nightly | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` `rustup toolchain install nightly`|

<!-- markdownlint-enable MD013 -->

### Build the chain

We will spin up a Cairo Rollup from the Madara Stack source code. You could also
use docker images, but this way we get to keep the option to modify component
behavior if we need to do so. The Madara stack source code is a
[mono repo](https://github.com/keep-starknet-strange/madara)

```bash
cd ~
git clone git@github.com:keep-starknet-strange/madara.git
```

Then let's build the chain in `release` mode

```bash
cd madara
cargo build --release
```

### Setup the chain

You first need to set up the node, which means you need
to load the genesis state into your file system.

<!-- markdownlint-disable MD013 -->

For a detailed review of values in the genesis state, refer to the following [documentation](https://github.com/keep-starknet-strange/madara/blob/8c498ea363bfa995ac28154c449266f61a4679cc/docs/genesis.md#L4A%20little).

<!-- markdownlint-enable MD013 -->

Run the following command inside the repo root to do the setup.
This fetches the config files from the `configs` folder and loads them into
your file system.

<!-- markdownlint-disable MD013 -->

#### Loading files into the default path

```bash
cargo run --release -- setup --chain=dev --from-local ./configs
```

#### Loading files into a specific path

```bash
cargo run --release -- setup --chain=dev --from-local ./configs --base-path=/path/to/folder
```

### Start the chain

Now, you can start the node. You can use the `--dev` flag to automatically include all these flags
| Flag | Purpose |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --force-authoring | Enables block authoring even if the node is offline. |
| --alice | Uses pre-defined `Alice` session keys (this is more relevant in a decentralized setup) and starts in the validator mode i.e. the node can create new blocks |
| --tmp | Runs a temporary node. This option creates a temporary directory to store the blockchain configuration, including the node database, node key, and the keystore. |
| --rpc-external | Listens to all RPC interfaces. By default, the node only listens to local RPC calls. If you set this command-line option, keep in mind that not all RPC methods are safe to be exposed publicly. Use an RPC proxy server to filter out dangerous methods. For more information about RPC methods that shouldn't be publicly exposed, see Remote Procedure Calls. Use --unsafe-rpc-external to suppress the warning if you understand the risks. |
| --rpc-methods=Unsafe | Expose all RPC methods |

```bash
cargo run --release -- --dev
```

If you used the `base-path` command in the setup phase to load genesis files in a custom directory, use the following command

```bash
cargo run --release -- --dev --base-path=/path/to/folder
```

<!-- markdownlint-enable MD013 -->

### Interact with the chain

By default, your chain will be running on port `9944`. Madara supports the
complete Starknet spec, which means any tool that interacts with Starknet using
an RPC should just work with Madara if you use `http://localhost:9944`
(or your relevant URL) as the RPC.
