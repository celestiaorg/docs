import React from 'react';

const PeersLink = ({ chainId }) => (
  <p>
    Note: You can find more peers 
    <a href={`https://github.com/celestiaorg/networks/blob/master/${chainId}/peers.txt`}>{" "}
      here
    </a>.
  </p>
);

export default PeersLink;