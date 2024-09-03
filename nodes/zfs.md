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
1. Bare Metal server with decent amount of RAM (64GB+)
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
zpool create $ZFS_POOL_NAME /dev/nvme0n1
```

:::tip NOTE
If you have more than one disk available - you can add them also:
```sh
zpool create $ZFS_POOL_NAME /dev/nvme0n1 /dev/nvme1n1
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
```sh
# Add flag --node.store /celestia/bridge/.celestia-bridge to your command, example:
celestia bridge start --metrics.tls=true --metrics --metrics.endpoint otel.celestia.observer --p2p.metrics --node.store /celestia/bridge/.celestia-bridge
```

:::tip NOTE
It is recommended to sync from scratch. In case of using a snapshot it is important to have your local route to `--data.store` identical to one in a snapshot.
:::

After completing the steps above, you can begin syncing your DA node.

You can check your compression rate with the following command:
```sh
zfs get compressratio $ZFS_POOL_NAME
```
