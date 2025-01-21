---
description: Learn how to setup your DA node to use on-fly compression with ZFS.
---

# Setting up your DA node to use ZFS

Enabling ZFS compression on a DA Node server can significantly optimize storage efficiency by compressing data on the fly. Follow this step-by-step guide to implement ZFS compression without requiring any additional tuning on the DA node.

:::tip NOTE
ZFS, compression `zstd-3`:
```
$ zfs get compressratio celestia && du -h /celestia/bridge/.celestia-bridge
NAME             PROPERTY       VALUE  SOURCE
celestia         compressratio  2.05x  -
2.6T    /celestia/bridge/.celestia-bridge
```
EXT4, no compression:
```
$ du -h ~/.celestia-bridge/
5.0T    /home/ubuntu/.celestia-bridge/
```
:::

## Requirements:
1. A bare metal server with a substantial amount of RAM (64GB or more) and a modern CPU (latest generation EPYC or Xeon with a clock speed of 2.1GHz or higher and 32 threads or higher is recommended)
2. At least one empty disk (with no filesystem)

## Guide:

Get your disk name:
```sh
lsblk --nodeps -o name
```

Set variables:
```sh
ZFS_POOL_NAME="celestia" && ZFS_DATASET_NAME="bridge"
```

Install ZFS utils:
```sh
sudo apt update && sudo apt install zfsutils-linux
```

Create ZFS pool:
```sh
zpool create -o ashift=12 $ZFS_POOL_NAME /dev/nvme0n1
```

:::tip NOTE
If you have more than one disk available - you can add them also:
```sh
zpool create -o ashift=12 $ZFS_POOL_NAME /dev/nvme0n1 /dev/nvme1n1
```
:::

Create dataset:
```sh
zfs create $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```

Enable compression:
```sh
zfs set compression=zstd-3 $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```

Set the custom path to the bridge data folder:

::: code-group

```sh [Mainnet Beta]
# Add flag --node.store /celestia/bridge/.celestia-bridge to your command, example:
celestia bridge start --metrics.tls=true --metrics --metrics.endpoint otel.celestia.observer --p2p.metrics --node.store /celestia/bridge/.celestia-bridge
```

```sh [Mocha]
# Add flag --node.store /celestia/bridge/.celestia-bridge-mocha-4 to your command, example:
celestia bridge start --metrics.tls=true --metrics --metrics.endpoint otel.celestia-mocha.com --p2p.metrics --node.store /celestia/bridge/.celestia-bridge-mocha-4 --p2p.network mocha
```

```sh [Arabica]
# Add flag --node.store /celestia/bridge/.celestia-bridge-arabica-11 to your command, example:
celestia bridge start --node.store /celestia/bridge/.celestia-bridge-arabica-11 --p2p.network arabica
```

:::

:::tip NOTE
It is recommended to sync from scratch. In case of using a snapshot it is important to have your local route to `--data.store` identical to one in a snapshot.
:::

After completing the steps above, you can begin syncing your DA node.

You can check your compression rate with the following command:
```sh
zfs get compressratio $ZFS_POOL_NAME
```

## ZFS Fine-Tuning (Advanced)
If you want to increase your I/O performance and sync speed, you can try the following steps:
### Disable Auto-Trim
Auto-trim disabling can improve I/O performance, but may lead to increased SSD wear over time.
```sh
sudo zpool set autotrim=off $ZFS_POOL_NAME
```

:::tip NOTE
You always can trim maually: `sudo zpool trim $ZFS_POOL_NAME`
:::

### Disable sync
Disabling boosts write speed, but risks data loss if the system crashes before data is written to disk.
```sh
zfs set sync=disabled $ZFS_POOL_NAME
```

:::tip NOTE
You should not keep the `sync` feature disabled permanently; it is useful during the initial DA node sync but can be re-enabled afterward. You can enable `sync` again with: `sudo zfs set sync=enabled $ZFS_POOL_NAME`.
:::

### Disable prefetch
Disabling reduces memory usage but can slow down performance for sequential read workloads.
```sh
echo 1 | sudo tee /sys/module/zfs/parameters/zfs_prefetch_disable
```

:::tip NOTE
You can always re-enable it: `echo 0 | sudo tee /sys/module/zfs/parameters/zfs_prefetch_disable`
:::

### Set record size
Setting `recordsize=256K` defines the maximum block size that ZFS will use when writing data to a dataset.
```sh
zfs set recordsize=256K $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```
