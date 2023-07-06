import React from 'react';
import blockspaceraceVersions from "../../versions/blockspacerace_versions.js";
import constants from "../../versions/constants.js";

const BsrVersionTags = () => {
  return (
    <ul>
      <li>Celestia Chain ID - <a href={`https://github.com/celestiaorg/networks/tree/master/${constants.bsrChainId}`} target="_blank" rel="noopener noreferrer">{constants.bsrChainId}</a></li>
      <li>Celestia Node - <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${blockspaceraceVersions['node-latest-tag']}`} target="_blank" rel="noopener noreferrer">{blockspaceraceVersions['node-latest-tag']}</a></li>
      <li>Celestia App - <a href={`https://github.com/celestiaorg/celestia-app/releases/tag/${blockspaceraceVersions['app-latest-tag']}`} target="_blank" rel="noopener noreferrer">{blockspaceraceVersions['app-latest-tag']}</a></li>
      <li>Rollkit - <a href={`https://github.com/rollkit/rollkit/releases/tag/${constants.bsrRollkitVersion}`} target="_blank" rel="noopener noreferrer">{constants.bsrRollkitVersion}</a></li>
    </ul>
  );
};

export default BsrVersionTags;
