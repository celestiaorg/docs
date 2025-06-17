---
description: Learn how to set up a local devnet with Celestia consensus and bridge nodes.
---

# Local devnet setup

This guide covers how to set up a local devnet with both consensus and bridge
nodes for development and testing purposes. A local devnet allows you to run a
complete Celestia network environment on your local machine.

## Prerequisites

- [Install celestia-app](/how-to-guides/celestia-app.md)
- [Install celestia-node](/how-to-guides/celestia-node.md)
- [Install Docker and Docker Compose](https://docs.docker.com/get-docker)
  (for Docker setup)

## Script-based setup

### Single consensus node

To start a local consensus node using the provided script:

1. Clone and build celestia-app:

   ```bash
   git clone https://github.com/celestiaorg/celestia-app.git
   cd celestia-app
   make install
   ```

2. Run the single node script:

   ```bash
   ./scripts/single-node.sh
   ```

   This script will:

   - Initialize a new chain with a single validator
   - Create a genesis file with pre-funded accounts
   - Start the consensus node
   - Make RPC endpoints available at `localhost:26657`

### Single consensus node + bridge node

To set up both a consensus node and a bridge node together:

1. Follow the consensus node setup above

2. In a new terminal, run the bridge node script:

   ```bash
   ./scripts/single-bridge-node.sh
   ```

   This will:

   - Start a bridge node that connects to your local consensus node
   - Enable data availability sampling
   - Make the bridge node API available at `localhost:26658`

## Docker setup

For a containerized setup using Docker Compose, you can use a simplified
configuration based on the Celestia ZKEVM IBC demo repository.

1. Create a `docker-compose.yml` file with the following content:

   ```yaml
   version: "3.8"
   services:
     celestia-validator:
       image: ghcr.io/celestiaorg/celestia-app:latest
       container_name: celestia-validator
       volumes:
         - celestia_validator_data:/home/celestia
       ports:
         - "9090:9090"
         - "26656:26656"
         - "26657:26657"
       command: |
         sh -c "
         celestia-appd init mynode --chain-id private &&
         celestia-appd start
         "
       networks:
         - celestia-network

     celestia-bridge:
       image: ghcr.io/celestiaorg/celestia-node:latest
       container_name: celestia-bridge
       environment:
         - P2P_NETWORK=private
       volumes:
         - celestia_bridge_data:/home/celestia
       ports:
         - "26658:26658"
       command: >
         celestia bridge start
         --p2p.network private
         --core.ip celestia-validator
         --rpc.addr 0.0.0.0
         --rpc.port 26658
       depends_on:
         - celestia-validator
       networks:
         - celestia-network

   volumes:
     celestia_validator_data:
     celestia_bridge_data:

   networks:
     celestia-network:
       driver: bridge
   ```

2. Start the services:

   ```bash
   docker-compose up -d
   ```

3. Check the status:

   ```bash
   docker-compose ps
   docker-compose logs celestia-validator
   docker-compose logs celestia-bridge
   ```

## Default endpoints

Once your local devnet is running, you can access these endpoints:

| Service         | Endpoint                 |
| --------------- | ------------------------ |
| Consensus RPC   | `http://localhost:26657` |
| Consensus gRPC  | `http://localhost:9090`  |
| Consensus P2P   | `http://localhost:26656` |
| Bridge node API | `http://localhost:26658` |

## Testing your setup

You can test that your local devnet is working by:

1. Checking node status:

   ```bash
   curl http://localhost:26657/status
   ```

2. Querying the latest block:

   ```bash
   curl http://localhost:26657/block
   ```

3. For bridge nodes, check the DA network info:

   ```bash
   curl http://localhost:26658/head
   ```

## Stopping the devnet

### Stopping script-based setup

Stop the processes with `Ctrl+C` in each terminal.

### Stopping Docker setup

```bash
docker-compose down
```

To also remove the volumes:

```bash
docker-compose down -v
```

## Next steps

With your local devnet running, you can:

- [Submit blob data](/how-to-guides/submit-data.md)
- Test rollup integrations
- Develop applications using the [Celestia Node API](/tutorials/node-api.md)
- Practice validator operations without risking real tokens
