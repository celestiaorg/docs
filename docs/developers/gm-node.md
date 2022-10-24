---
sidebar_label: Run a Light Node
---

# 🪶 Run a Celestia DA Light Node

A Celestia Light Node on the Mamaki Testnet is required to complete this
tutorial. Run the following commands to install Celestia-Node:

<!-- markdownlint-disable MD010 -->
```bash
cd && rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node
git checkout tags/v0.3.0-rc2
make install
```
<!-- markdownlint-enable MD010 -->

![1.png](/img/gm/1.png)

Inside the celestia-node repository is a utility named `cel-key` that uses the
key utility provided by Cosmos-SDK under the hood. The utility can be used to
`add`, `delete`, and manage keys for any DA node
type `(bridge || full || light)`, or just keys in general.

## 🗝 Create a key

Create your key for the node:

```bash
make cel-key
```

Verify the version of your Celestia-Node with the `celestia version` command,
it should be `v0.3.0-rc2`:

```bash
celestia version
```

```output
# OUTPUT

Semantic version: v0.3.0-rc2
Commit: 89892d8b96660e334741987d84546c36f0996fbe
Build Date: Fri Oct  7 01:08:14 UTC 2022
System version: amd64/linux
Golang version: go1.18.2
```

## 🟢 Initialize Light Node

Now, we’re ready to initialize the Celestia Light Node. You can do so by running:

```bash
celestia light init
```

Query our key's address using `cel-key` :

```bash
./cel-key list --node.type light --keyring-backend test
```

![2.png](/img/gm/2.png)

## 🚰 Visit Faucet

Use the `#mamaki-faucet` channel in the Celestia Discord to request testnet
tokens:

```bash
$request <Wallet-Address>
```

Start Celestia Light node with a connection to a public Core Endpoint:

<!-- markdownlint-disable MD013 -->
```bash
celestia light start --core.grpc https://rpc-mamaki.pops.one:9090 --keyring.accname my_celes_key
```
<!-- markdownlint-enable MD013 -->

![3.png](/img/gm/3.png)

In another terminal window, check the balance from our visit to the faucet:

```bash
curl -X GET http://localhost:26658/balance
```

Your response should look like this, denominated in `utia` in JSON format.

```json
{"denom":"utia","amount":"100000000"}
```

Now that we are set with Go and Ignite CLI installed, and our Celestia Light
Node running on our machine, we’re ready to build, test, and launch our own
sovereign rollup.
