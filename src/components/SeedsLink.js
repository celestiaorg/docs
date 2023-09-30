import React from 'react';

const SeedsLink = ({ chainId }) => (
  <p>
    Find a seed from{" "}
    <a href={`https://github.com/celestiaorg/networks/blob/master/${chainId}/seeds.txt`}>
      the list
    </a> and pick one.
  </p>
);

export default SeedsLink;