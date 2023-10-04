---
sidebar_label: Node metrics
description: A guide on how to run metrics for your Celestia Node DA instance.
---

# Celestia Node metrics

This tutorial is for running metrics for your `celestia-node` Data
Availability instance.

This tutorial will focus on running metrics for a light-node.

This tutorial assumes you have already setup your light node
by following the tutorial in the [Node API tutorial](../developers/node-tutorial.mdx).

## Running metrics flags

You can enable the `celestia-node` metric flags with the following
command:

<!-- markdownlint-disable MD013 -->

```sh
celestia light start --core.ip <ip-address> --metrics --metrics.endpoint <ip-address:port> --p2p.network <network>
```

:::tip
The `--core.ip` gRPC port defaults to 9090,
so if you do not specify it in the command
line, it will default to that port. You can
add the port after the IP address or use the
`--core.grpc.port` flag to specify another
port if you prefer.

Refer to
[the ports section of the celestia-node troubleshooting page](../../nodes/celestia-node-troubleshooting/#ports)
for information on which ports are required to be open on your machine.
:::

<!-- markdownlint-enable MD013 -->

Note that the `--metrics` flags enables metrics and expects
an input into `--metrics.endpoint`.

We will go over what the endpoint will need to be in the following section.

## Metrics endpoint design considerations

At the moment, the architecture of `celestia-node` metrics
works as specified in the following [ADR](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-010-incentivized-testnet-monitoring.md).

Essentially, the design considerations here will necessitate
running an OpenTelemetry (OTEL) collector that connects to Celestia
light node.

For an overview of OTEL, check out [the guide](https://opentelemetry.io/docs/collector).

The ADR and the OTEL docs will help you run your collector on the metrics endpoint.
This will then allow you to process the data in the collector on a
Prometheus server which can then be viewed on a Grafana dashboard.

In the future, we do want to open-source some developer toolings around
this infrastructure to allow for node operators to be able to monitor
their Data Availability nodes.
