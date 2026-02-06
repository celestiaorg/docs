# Custom networks and values

This section will cover importing bootstrapper IDs, chain ID,
and network ID. This will allow you to import custom values
for a chain that is not in the default configuration.

If you have a custom network you can export `CELESTIA_CUSTOM`, which will
look something like:

```bash

```

Query your node ID [from the CLI](/operate/data-availability/light-node/advanced#find-your-node-id).
These values with examples would look like:

```bash

```

Then, start your node with:

```bash
celestia <node-type> start [flags...]
```