# Network Endpoints

This document serves as the central reference for all network endpoints in the Celestia ecosystem.

## Production RPC Endpoints

These RPC providers are meant to be used in production environments.

| Provider | URL |
|----------|------|
| Numia | For RPC access: <https://docs.numia.xyz/infra/overview/getting-started> |
| Numia | For data warehouse access: <https://docs.numia.xyz/sql/querying-data/chains/celestia> |
| Grove | <https://www.grove.city/> |
| QuickNode | <https://www.quicknode.com/chains/celestia> |

:::warning
Do not rely on the free community endpoints listed below for production deployments. Production deployments should rely on service providers with SLAs or your own node.
:::

## Community Endpoints

### Consensus RPC Endpoints

- `public-celestia-rpc.numia.xyz`
- `rpc.celestia.pops.one`
- `rpc.lunaroasis.net`
- [Additional endpoints...]

### API Endpoints

- `public-celestia-lcd.numia.xyz`
- `api.celestia.pops.one`
- `api.lunaroasis.net`
- [Additional endpoints...]

### gRPC Endpoints

- `public-celestia-grpc.numia.xyz`
- `grpc.celestia.pops.one`
- `grpc.lunaroasis.net:443`
- [Additional endpoints...]

### WebSocket Endpoints

- `wss://celestia-ws.chainode.tech:33373/websocket`
- `wss://celestia-mainnet-ws.itrocket.net:443/websocket`
- `wss://celestia.cumulo.org.es:443/websocket`
- `wss://rpc.archive.celestia.cumulo.com.es:443/websocket`

## Data Availability (DA) Node Endpoints

These endpoints are specifically for DA nodes to sync blocks and access state:

### Bridge Node Sync Endpoints

These RPC endpoints allow bridge nodes to sync blocks from the Celestia network.
Users need to provide a `--core.ip string` from a consensus node's URL or IP that
populates a default RPC port at 26657 to their respective DA node.

### State Access Endpoints

These gRPC endpoints for DA nodes provide state access for querying the chain's
state and broadcasting transactions (balances, blobs, etc.) to the Celestia network.

Example usage:
```bash
celestia <da_type> start --core.ip <url> --core.port <port>
```

:::tip Bridge nodes
Not all RPC endpoints guarantee the full block history. Find [an archive endpoint on the community dashboard](https://celestia-tools.brightlystake.com/) or run your own consensus node with no pruning for your bridge node.
:::

## Network-Specific Endpoints

For network-specific endpoints (Mainnet Beta, Mocha, Arabica), please refer to:
- [Mainnet Beta](/how-to-guides/mainnet.md)
- [Mocha Testnet](/how-to-guides/mocha-testnet.md)
- [Arabica Devnet](/how-to-guides/arabica-devnet.md) 