# Optional: Setting up your DA node to use ZFS

> **Warning:**
Using ZFS compression may impact node performance depending on your hardware configuration. Ensure your system meets the recommended requirements before proceeding. This is an optional optimization that may not be suitable for all deployments.

Enabling ZFS compression on a DA Node server can significantly optimize storage efficiency by compressing data on the fly. Follow this step-by-step guide to implement ZFS compression without requiring any additional tuning on the DA node.

> **Note:** ZFS compression `zstd-3` example:

```
$ zfs get compressratio celestia && du -h /celestia/bridge/.celestia-bridge
NAME             PROPERTY       VALUE  SOURCE
celestia         compressratio  1.22x  -
1.3T    /celestia/bridge/.celestia-bridge
```

> EXT4, no compression:

```
$ du -h ~/.celestia-bridge/
1.8T    /home/ubuntu/.celestia-bridge/
```

## Requirements

1. A bare metal server with:
   - RAM: 64GB or more
   - CPU: Latest generation EPYC or Xeon with:
     - Clock speed: 2.1GHz or higher
     - Threads: 32 or higher
     - Note: Additional CPU overhead is required for ZFS compression
2. At least one empty disk (with no filesystem)

## Guide

Get your disk name:

```sh
lsblk --nodeps -o name
```

Verify disk is empty (should show no partitions):

```sh
lsblk YOUR_DISK_NAME (/dev/nvme0n1 or /dev/sda i.e.)
```

Verify disk is not mounted:

```sh
mount | grep YOUR_DISK_NAME
```

Set variables:

```sh
ZFS_POOL_NAME="celestia" && ZFS_DATASET_NAME="bridge"
```

Validate variables are set:

```sh
if [ -z "$ZFS_POOL_NAME" ] || [ -z "$ZFS_DATASET_NAME" ]; then
  echo "Error: Variables not set correctly"
  exit 1
fi
```

Install ZFS utils:

```sh
sudo apt update && sudo apt install zfsutils-linux
```

Create ZFS pool:

```sh
zpool create -o ashift=12 $ZFS_POOL_NAME /dev/nvme0n1
```

> **Note:** If you have more than one disk available, you can add them also:

```sh
zpool create -o ashift=12 $ZFS_POOL_NAME /dev/nvme0n1 /dev/nvme1n1
```

Verify pool status:

```sh
zpool status $ZFS_POOL_NAME
```

Verify pool properties:

```sh
zpool get all $ZFS_POOL_NAME
```

Create dataset:

```sh
zfs create $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```

Enable compression:

```sh
zfs set compression=zstd-3 $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```

Set the custom path to the bridge data folder:

> **Note:** It is recommended to sync from scratch. In case of using a snapshot it is important to have your local route to `--data.store` identical to one in a snapshot.

After completing the steps above, you can begin syncing your DA node.

You can check your compression rate with the following command:

```sh
zfs get compressratio $ZFS_POOL_NAME
```

## ZFS Fine-Tuning (Advanced)

> **Warning:**
The following settings can significantly impact data integrity and system stability. Only proceed if you fully understand the implications of each setting. These optimizations should be carefully tested in a non-production environment first.
If you want to increase your I/O performance and sync speed, you can try the following steps:

### Disable Auto-Trim

Auto-trim disabling can improve I/O performance, but may lead to increased SSD wear over time.

```sh
sudo zpool set autotrim=off $ZFS_POOL_NAME
```

> **Note:** You can always trim manually: `sudo zpool trim $ZFS_POOL_NAME`

### Disable sync

> **Warning:**
Disabling sync provides faster write speeds but significantly increases the risk of data corruption in case of system crashes or power failures. Data in memory may be permanently lost before being written to disk.

This setting should:

1. Only be used during initial node sync
2. Never be used in production environments
3. Be re-enabled immediately after initial sync completes

### Disable prefetch

Disabling reduces memory usage but can slow down performance for sequential read workloads.

```sh
echo 1 | sudo tee /sys/module/zfs/parameters/zfs_prefetch_disable
```

> **Note:** You can always re-enable it: `echo 0 | sudo tee /sys/module/zfs/parameters/zfs_prefetch_disable`

### Set record size

Setting `recordsize=256K` defines the maximum block size that ZFS will use when writing data to a dataset.

```sh
zfs set recordsize=256K $ZFS_POOL_NAME/$ZFS_DATASET_NAME
```