# Setting Up Your Node As A Background Process With SystemD

SystemD is a daemon service useful for running applications as background processes.

## Consensus Nodes

If you are running a validator or consensus full node, here are
the steps to setting up `celestia-appd` as a background process.

### Start the Celestia-App with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia-App systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-appd.service
[Unit]
Description=celestia-appd Cosmos daemon
After=network-online.target
[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia-appd start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096
[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-appd.service
```

Enable and start celestia-appd daemon:

```sh
systemctl enable celestia-appd
systemctl start celestia-appd
```

Check if daemon has been started correctly:

```sh
systemctl status celestia-appd
```

Check daemon logs in real time:

```sh
journalctl -u celestia-appd.service -f
```

To check if your node is in sync before going forward:

```sh
curl -s localhost:26657/status | jq .result | jq .sync_info
```

Make sure that you have `"catching_up": false`, otherwise leave it running
until it is in sync.

## Data Availability Nodes

### Celestia Full Storage Node

Create Celestia Full Storage Node systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-full.service
[Unit]
Description=celestia-full Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia full start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-full.service
```

Enable and start celestia-full daemon:

```sh
systemctl enable celestia-full
systemctl start celestia-full && journalctl -u \
celestia-full.service -f
```

You should be seeing logs coming through of the full storage node syncing.

### Celestia Bridge Node

Create Celestia Bridge systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-bridge.service
[Unit]
Description=celestia-bridge Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia bridge start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-bridge.service
```

Enable and start celestia-bridge daemon:

```sh
systemctl enable celestia-bridge
systemctl start celestia-bridge && journalctl -u \
celestia-bridge.service -f
```

Now, the Celestia bridge node will start syncing headers and storing blocks
from Celestia application.

> Note: At startup, we can see the `multiaddress` from Celestia Bridge Node.
This is **needed for future Light Node** connections and communication between
Celestia Bridge Nodes

Example:

```sh
NODE_IP=<ip-address>
/ip4/$NODE_IP/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22
```

You should be seeing logs coming through of the bridge node syncing.

### Celestia Light Node

Start the Light Node as daemon process in the background

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-lightd.service
[Unit]
Description=celestia-lightd Light Node
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia light start --core.grpc <ip>:9090
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created succesfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-lightd.service
```

Enable and start celestia-lightd daemon:

```sh
systemctl enable celestia-lightd
systemctl start celestia-lightd
```

Check if daemon has been started correctly:

```sh
systemctl status celestia-lightd
```

Check daemon logs in real time:

```sh
journalctl -u celestia-lightd.service -f
```

Now, the Celestia Light Node will start syncing headers.
After sync is finished, Light Node will do Data Availability
Sampling (DAS) from the Bridge Node.
