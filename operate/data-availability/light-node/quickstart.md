# Light node: overview & quickstart

Celestia light nodes perform data availability sampling (DAS) to verify that
block data is available without downloading it all. They can also post and
retrieve blobs (data) from the Celestia network.

## Overview

Light nodes are the most common way to interact with Celestia networks.

![light-node](/img/nodes/LightNodes.png)

Light nodes:

1. Listen for `ExtendedHeaders` (block headers + DA metadata).
2. Perform DAS on received headers.

## Optional: run a light node in your browser

The easiest way to try a light node is with [Lumina.rs](https://lumina.rs) in
your browser.

<img
  width="1000"
  alt="Lumina.rs in browser"
  src="https://github.com/user-attachments/assets/5c6ae717-503e-4b83-844f-8716f33ec76c"
/>

You can also run Lumina on the decentralized explorer,
[Celenium](https://celenium.io).

<img
  width="1000"
  alt="Celenium running a light node with Lumina.rs"
  src="https://github.com/user-attachments/assets/28183a24-8bb1-4f77-850c-d0528de075c7"
/>

## Run a light node (CLI)

This guide assumes you've completed:

- [Hardware requirements](/operate/getting-started/hardware-requirements)
- [Environment setup](/operate/getting-started/environment-setup)

If you see `header: syncing in progress`, wait for the node to sync or use
[fast sync](/operate/data-availability/light-node/advanced#fast-sync-with-a-trusted-hash).

## Next steps

- More operations and configuration: [Advanced](/operate/data-availability/light-node/advanced)
- Submitting blobs from an app: [Submit data](/learn/TIA/submit-data)