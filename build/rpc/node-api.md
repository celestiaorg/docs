<style>{`
  article button:has(svg):has(*:is(:contains("Copy page"), :contains("Copied"))) {
    display: none !important;
  }
  /* Fallback: hide the container if :has() or :contains() not supported */
  article div[class*="border"][class*="inline-flex"][class*="float-end"] {
    display: none !important;
  }
`}</style>

# Node API

<div style={{ display: 'none' }}>

## Celestia Node API

The Celestia Node API is the collection of RPC methods that can be used to interact with the services provided by Celestia Data Availability Nodes. Node API uses auth tokens to control access to this API.

Celestia node RPC reference for blob, blobstream, da, das, fraud, header, node, p2p, share, and state packages. Includes methods like blob.Get, blob.GetAll, blob.GetProof, blob.Submit, share.GetShare, share.GetRange, share.GetNamespaceData, share.GetEDS, share.SharesAvailable, state.SubmitPayForBlob, state.Balance, state.Transfer, header.NetworkHead, header.GetByHeight, header.Subscribe, p2p.Peers, p2p.Connect, p2p.Info, da.Submit, da.Validate, da.GetProofs, das.SamplingStats, node.AuthNew, node.Info, blobstream.GetDataRootTupleInclusionProof, fraud.Subscribe.

</div>