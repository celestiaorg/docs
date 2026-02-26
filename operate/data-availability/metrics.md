# celestia-node metrics

This tutorial is for running metrics for your celestia-node data
availability instance. This tutorial will focus on running metrics for a light node.

This tutorial assumes you have already setup your light node
by following the tutorial in the
[light node guide](/operate/data-availability/light-node/quickstart).

## Running metrics flags

You can enable the `celestia-node` metric flags with the following
command:

```sh
celestia <node-type> start --metrics.tls=<boolean> \
    --metrics --metrics.endpoint <URI> \
    --p2p.network <network> \
    --core.ip <URI> --core.port <port>
```

Add metrics flags to your node start command and restart your node to apply it.
The metrics endpoint will gather your node's data to track your uptime.

Note that the `--metrics` flag enables metrics and expects
an input into `--metrics.endpoint`.

We will go over what the endpoint will need to be in the
[metrics endpoint design considerations](#metrics-endpoint-design-considerations)
section.

### Mainnet Beta

Here is an example for Mainnet Beta:

```sh
celestia <node-type> start --metrics.tls=true \
    --metrics --metrics.endpoint otel.celestia.observer \
    --core.ip <URI> --core.port <port>
```

### Mocha testnet

Here is an example for Mocha testnet:

```sh
celestia <node-type> start --metrics.tls=true \
    --metrics --metrics.endpoint otel.mocha.celestia.observer \
    --core.ip <URI> --core.port <port> --p2p.network mocha
```

### Arabica devnet

Here is an example for Arabica devnet:

```sh
celestia <node-type> start --metrics.tls=true \
    --metrics --metrics.endpoint otel.arabica.celestia.observer \
    --core.ip <URI> --core.port <port> --p2p.network arabica
```

### TLS connections

The `--metrics.tls` flag enables or disables a TLS connection to the
OpenTelemetry Protocol metrics backend. You need to choose a boolean
value (`true` or `false`) for this flag.

It's also common to set this flag to `false` when spinning up a local
collector
to check the metrics locally.

However, if the collector is hosted in the cloud as a separate entity
(like in a DevOps environment), enabling TLS is a necessity for secure
communication.

Here are examples of how to use it:

```bash
# To enable TLS connection
celestia <node-type> start --metrics.tls=true --metrics \
    --metrics.endpoint <URI> \
    --p2p.network <network> --core.ip <URI> --core.port <port>

# To disable TLS connection
celestia <node-type> start --metrics.tls=false --metrics \
    --metrics.endpoint <URI> \
    --p2p.network <network> --core.ip <URI> --core.port <port>
```

## Metrics endpoint design considerations

At the moment, the architecture of celestia-node metrics
works as specified in the following [ADR #010](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-010-incentivized-testnet-monitoring.md).

Essentially, the design considerations here will necessitate
running an OpenTelemetry (OTEL) collector that connects to Celestia
light node.

For an overview of OTEL, check out [the guide](https://opentelemetry.io/docs/collector).

The ADR and the OTEL docs will help you run your collector on the metrics endpoint.
This will then allow you to process the data in the collector on a
Prometheus server which can then be viewed on a Grafana dashboard.

In the future, we do want to open-source some developer toolings around
this infrastructure to allow for node operators to be able to monitor
their data availability nodes.

### Configure celestia-node to export to multiple OTEL collectors

It is not supported to directly export metrics to multiple OTEL collectors (see the discussions [here](https://github.com/open-telemetry/opentelemetry-go/issues/3055)). To achieve this goal, an agent OTEL collector needs to be deployed for the node, from which the metrics can be forwarded to any other OTEL collectors. Here are the necessary steps and example configurations.

Follow the instructions [here](https://opentelemetry.io/docs/collector/installation/) to install the OTEL collector. If you have the binary installed in `/usr/local/bin/otelcol`, you may consider creating a systemd service to run the collector as a background service. Here is an example of a systemd service definition in `/etc/systemd/system/otelcol.service`:

```ini
[Unit]
Description=OpenTelemetry Collector
After=network.target

[Service]
ExecStart=/usr/local/bin/otelcol --config /path/to/otelcol_config.yaml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

The following is an example of the `otelcol_config.yaml` file that transforms the metrics into Prometheus metrics and reports them to the Celestia OTEL collector at the same time:

```yaml
receivers:
  otlp:
    protocols:
      http: # Enable HTTP receiving
        endpoint: "127.0.0.1:4318" # the endpoint where the celestia-node will send metrics (the default value of --metrics.endpoint for celestia when --metrics is specified)
exporters:
  prometheus:
    # the node metrics will be transformed to Prometheus format and exposed on the following endpoint
    endpoint: "0.0.0.0:8889"
    namespace: "celestia"
  otlphttp:
    # report the metrics to Mocha testnet OTEL collector as an example
    # change it according to your network
    endpoint: https://otel.mocha.celestia.observer

service:
  pipelines:
    metrics:
      receivers: [otlp]
      exporters: [prometheus, otlphttp]
```

Run the following commands to enable the OTEL collector systemd service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now otelcol.service

# check the status of the service
sudo systemctl status otelcol.service
```

If the collector is up and running without any error, you can adjust the options for the `celestia-node` service:

```sh
celestia <node-type> start --metrics.tls=false \
    --metrics --metrics.endpoint localhost:4318 \
    ...
```