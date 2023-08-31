import React from 'react';

const BsrVersionTags = ({ bsrVersions, constants }) => {
  return (
    <ul>
      <li>Celestia Chain ID - <a href={`https://github.com/celestiaorg/networks/tree/master/${constants.bsrChainId}`} target="_blank" rel="noopener noreferrer">{constants.bsrChainId}</a></li>
      <li>Celestia Node - <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${bsrVersions['node-latest-tag']}`} target="_blank" rel="noopener noreferrer">{bsrVersions['node-latest-tag']}</a></li>
      <li>Celestia App - <a href={`https://github.com/celestiaorg/celestia-app/releases/tag/${bsrVersions['app-latest-tag']}`} target="_blank" rel="noopener noreferrer">{bsrVersions['app-latest-tag']}</a></li>
      <li>Rollkit - <a href={`https://github.com/rollkit/rollkit/releases/tag/${constants.bsrRollkitVersion}`} target="_blank" rel="noopener noreferrer">{constants.bsrRollkitVersion}</a></li>
    </ul>
  );
};

export default BsrVersionTags;