# Create celestia-app network on 3 Digital Ocean Droplets

Inspired from instructions [here](https://github.com/celestiaorg/networks/blob/a378c7cddb91a71db533631d7bbc2b67cb956d5c/README.md)

## Initial Setup

The initial setup assumes you create 3 Digital Ocean Droplets, other cloud provider VMs sharing a VPC likely work but haven't been tested. It is assumed that you have a terminal with an ssh key that has permissions for all 3 VM nodes. 

A walk through video is available [here](https://www.loom.com/share/e8dd61974ede492db51f3bf7331970da)

## Run on all Nodes
```
apt install moreutils -y
apt install jq -y
# node_num should be 0, 1, or 2 depending on the node
node_num={0, 1, 2}
# This is a `celestia-appd` binary compiled for amd64 linux
# You could also retrieve the celestia-app source code from https://github.com/celestiaorg/celestia-app
# Install with `make install`, move the resulting `celestia-appd` to `/usr/local/bin` and add execution permissions (chmod +x)
wget https://fra1.digitaloceanspaces.com/celestia-node-binaries/celestia-appd
mv celestia-appd /usr/local/bin/celestia-appd
chmod +x /usr/local/bin/celestia-appd
git clone https://github.com/celestiaorg/networks.git
networks/scripts/firewall_ubuntu.sh
node_name="MightyValidator-${node_num}"
acc_addr=$(networks/scripts/1_create_key.sh $node_name | tail -n 1)
echo $acc_addr > ~/account-address-$node_num.txt
```

## Run on a terminal not ssh'd to a node
```
mkdir /tmp/orchestrate && cd /tmp/orchestrate
# Retrieve the correct IPv4 Addresses of your nodes
node0_ip=<node-0-ip>
node1_ip=<node-1-ip>
node2_ip=<node-2-ip>
scp root@$node1_ip:/root/account-address-1.txt ./account-address-1.txt
scp root@$node2_ip:/root/account-address-2.txt ./account-address-2.txt
scp ./account-address-1.txt root@$node0_ip:/root/account-address-1.txt
scp ./account-address-2.txt root@$node0_ip:/root/account-address-2.txt
```

## Run on orchestrator node
```
celestia-appd init ReiAyanami --chain-id devnet-2
acc_addr_0=$(cat account-address-0.txt)
acc_addr_1=$(cat account-address-1.txt)
acc_addr_2=$(cat account-address-2.txt)
celestia-appd add-genesis-account $acc_addr_0 800000000000celes
celestia-appd add-genesis-account $acc_addr_1 800000000000celes
celestia-appd add-genesis-account $acc_addr_2 800000000000celes
networks/scripts/fix_genesis.sh ~/.celestia-app/config/genesis.json celes
```

## Run on a terminal not ssh'd to a node
```
scp root@$node0_ip:/root/.celestia-app/config/genesis.json ./genesis.json 
scp ./genesis.json root@$node1_ip:/root/.celestia-app/config/genesis.json
scp ./genesis.json root@$node2_ip:/root/.celestia-app/config/genesis.json
```

## Run on all nodes
```
# Validate genesis.json is same
cat ~/.celestia-app/config/genesis.json | jq .app_state.bank.balances
celestia-appd gentx $node_name 5000000000celes --keyring-backend=test --chain-id devnet-2
```

## Run on a terminal not ssh'd to a node
```
mkdir gentx
scp root@$node0_ip:/root/.celestia-app/config/gentx/* ./gentx/.
scp root@$node1_ip:/root/.celestia-app/config/gentx/* ./gentx/.
scp root@$node2_ip:/root/.celestia-app/config/gentx/* ./gentx/.
scp -r  gentx/ root@$node0_ip:/root/.celestia-app/config/.
```

## Run on orchestrator node
```
celestia-appd collect-gentxs
```

## Run on a terminal not ssh'd to a node
```
# Copy final genesis.json from node0
scp root@$node0_ip:/root/.celestia-app/config/genesis.json ./golden-genesis.json
scp ./golden-genesis.json root@$node1_ip:/root/.celestia-app/config/genesis.json
scp ./golden-genesis.json root@$node2_ip:/root/.celestia-app/config/genesis.json
```

## Run on all nodes
```
celestia-appd start
```
