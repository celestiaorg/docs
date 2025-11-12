---
description: A guide to troubleshooting common issues with Celestia Node.
next:
  text: "Metrics, visualization, and alerts"
  link: "how-to-guides/celestia-app-metrics"
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
celestia <node-type> start --p2p.network <network> \
    --core.ip <URI> --core.port <port>
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

For example, validator (consensus node) ports 9090
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

### Background

An [enhancement has been made in v0.14.0+](https://github.com/celestiaorg/celestia-node/pull/3246)
to automate the detection of the running node, eliminating the need to
manually specify the `--node.store` flag for each RPC request.

**Assumptions:**

- The presence of a lock signifies a running node.
- Networks are ordered as Mainnet Beta, Mocha, Arabica, private, custom.
- Node types are ordered as bridge and light.
- Each network has only one running node type.
- Multiple nodes of the same network and type are prohibited
  (resulting in an `Error: node: store is in use`).

**Key Points:**

- Authentication token and other flags maintain their previous behavior
  and take precedence.
- Address and port details are fetched from the configuration.
- `skipAuth` allows bypassing authentication for trusted setups and follows
  Unix daemon conventions.
- Non-default node store and cel-key configurations still require specific
  flags in the configuration settings.

### Demonstration

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
celestia bridge start --core.ip rpc-mocha.pops.one --p2p.network mocha \
    --node.store /home/user/celestia-bridge-location/ --core.port <port>
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
./cel-key list --p2p.network mocha --node.type bridge \
    --keyring-dir /home/user/celestia-bridge-location/keys/
```

### Examples

#### Mainnet Beta bridge and Mocha light

This example uses a Mainnet Beta bridge node and a Mocha light node. When
making the request:

```bash
❯ celestia blob get 1318129 0x42690c204d39600fddd3 0MFhYKQUi2BU+U1jxPzG7QY2BVV1lb3kiU+zAK7nUiY=
{
 "result": "RPC client error: sendRequest failed: http status 401 Unauthorized unmarshaling response: EOF"
}
```

The request will go to the Mainnet Beta node, and a 401 will show in
this node's logs. Note that a 401 is expected because this blob was
posted to Mocha and neither the namespace nor the blob exist on Mainnet Beta.

#### Mocha bridge and Arabica light

This example uses a Mocha bridge node and an Arabica light node. When
making the request:

```bash
❯ celestia blob get 1318129 0x42690c204d39600fddd3 0MFhYKQUi2BU+U1jxPzG7QY2BVV1lb3kiU+zAK7nUiY=
{
  "result": {
    "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=",
    "data": "0x676d",
    "share_version": 0,
    "commitment": "0MFhYKQUi2BU+U1jxPzG7QY2BVV1lb3kiU+zAK7nUiY=",
    "index": 23
  }
}
```

The request will go to the Mocha bridge node, and result shown as expected.

#### Using a custom rpc.config address

When using a custom RPC config address `0.0.0.1` and port `25231`,
the CLI accurately routes to the custom address and port, where no
node is running. It fails as expected:

```bash
❯ celestia blob get 1318129 0x42690c204d39600fddd3 0MFhYKQUi2BU+U1jxPzG7QY2BVV1lb3kiU+zAK7nUiY=
{
  "result": "RPC client error: sendRequest failed: Post \"http://0.0.0.1:25231\": dial tcp 0.0.0.1:25231: connect: no route to host"
}
```

## Resetting your config

If you encounter an error, it is likely that an old config file is present:

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

For **bridge and light nodes**,
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

## Error: "too many open files"

When running a Celestia bridge node, you may encounter an error in the
logs similar to this:

```bash
Error while creating log file in valueLog.open error: while opening file: /opt/celestia/.celestia-bridge/data/003442.vlog error: open /opt/celestia/.celestia-bridge/data/003442.vlog: too many open files
```

This error indicates that the Celestia application is trying to open more
files than the operating system's limit allows. To fix this, you will need
to edit the Celestia bridge service file to increase the number of file
descriptors that the service can open.

1. Open the service file for editing:

```bash
nano /etc/systemd/system/celestia-bridge.service
```

2. Modify the `LimitNOFILE` parameter:

In the service file, find the `LimitNOFILE` parameter under the
`[Service]` section and set its value to `1400000`. It should look like this:

```ini
[Service]
...
LimitNOFILE=1400000
...
```

:::tip NOTE
Be cautious when increasing file descriptor limits. Setting this value too
high might affect system performance. Ensure the value is appropriate
for your system's capabilities.
:::

3. Reload daemon and restart bridge service:

```bash
sudo systemctl daemon-reload
```

```bash
sudo systemctl restart celestia-bridge
```

## Error: "no space left on device"

When a bridge node runs on `ext4` file system, there will be errors like the following due to large folder size:

```bash-vue
ERROR   header/sync     sync/sync.go:227        syncing headers {"from": 5074102, "to": 5161144, "err": "creating file: creating ODSQ4 file: creating Q4 file: creating Q4 file: open /root/.celestia-bridge-{{constants.mochaChainId}}/blocks/C9ADF6D9F862D92993D67977DE407D17ECF7F1DACE5FB7FE9A6845F4BD0172CE.q4: no space left on device"}
```

You may also observe similar errors from the `tar` command when extracting a snapshot of an archival bridge node.

There are two solutions to this problem:

#### Option 1: enable the large_dir feature for ext4

:::tip NOTE
If the Node Store is on the same partition as the OS, it is recommended to take Option 2.
:::

1. Stop the node
2. Unmount the device and run the following command:

```bash
# unmount the partition
# the value of <target> can be either the partition name (e.g., /dev/sdc1) or the mountpoint (e.g., /mnt/celestia)
sudo umount <target>

# enable the large_dir feature, use the partition name like /dev/sdc1 here
# if RAID is set, you can use the partition name like /dev/md0 for tune2fs
sudo tune2fs -O large_dir </dev/partition>

# perform a filesystem consistency check
sudo fsck -f </dev/yourpartition>

# mount the partition again
sudo mount </dev/yourpartition> <mountpoint>
```

3. Restart the node

#### Option 2: migrate to XFS/ZFS file system

Make sure you have your node id backed up so that you can import them later on.

## Error: "can't get key ...: too many failed passphrase attempts"

If you have initialized a bridge node with option `--keyring.backend file`, you will be asked to provide a keyring passphrase. Then a bridge node key `my_celes_key` is auto-generated by the `init` command. However, this does not work well with the systemd service setup because every time when the bridge node is started, it asks for the passphrase. The systemd service will keep failing with the following error:

```bash
ERROR        module/state        state/keyring.go:23        can't get key: `my_celes_key` from the keystore: too many failed passphrase attempts
```

Usually a bridge node wallet does not need to be funded unless you plan to do `PayForBlob` through it. We suggest using the default keyring backend (`test`) in this case which does not require a passphrase.

If you don't want to init the node again, you can do the following steps:

```bash
# update the config.toml file in the home folder of the bridge node or adjust your systemd service definition
[State]
  DefaultKeyName = "my_celes_key"
  DefaultBackendName = "test"

# recover the key using `cel-key`
# add `--keyring-dir </service_home_folder/keys/>` if you are using a custom home folder for the node
cel-key add my_celes_key --recover --node.type bridge --p2p.network <network>
```
