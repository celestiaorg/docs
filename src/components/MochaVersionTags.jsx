import React from 'react';

const MochaVersionTags = ({ mochaVersions, constants }) => {
  return (
    <ul>
      <li>Celestia Chain ID - <a href={`https://github.com/celestiaorg/networks/tree/master/${constants.mochaChainId}`} target="_blank" rel="noopener noreferrer">{constants.mochaChainId}</a></li>
      <li>Celestia Node - <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${mochaVersions['node-latest-tag']}`} target="_blank" rel="noopener noreferrer">{mochaVersions['node-latest-tag']}</a></li>
      <li>Celestia App - <a href={`https://github.com/celestiaorg/celestia-app/releases/tag/${mochaVersions['app-latest-tag']}`} target="_blank" rel="noopener noreferrer">{mochaVersions['app-latest-tag']}</a></li>
      <li>Rollkit - <a href={`https://github.com/rollkit/rollkit/releases/tag/${constants.mochaRollkitVersion}`} target="_blank" rel="noopener noreferrer">{constants.mochaRollkitVersion}</a></li>
    </ul>
  );
};

export default MochaVersionTags;