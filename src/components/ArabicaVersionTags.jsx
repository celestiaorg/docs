import React from 'react';

const ArabicaVersionTags = ({ arabicaVersions, constants }) => {
  return (
    <ul>
      <li>Celestia Chain ID - <a href={`https://github.com/celestiaorg/networks/tree/master/${constants.arabicaChainId}`} target="_blank" rel="noopener noreferrer">{constants.arabicaChainId}</a></li>
      <li>Celestia Node - <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${arabicaVersions['node-latest-tag']}`} target="_blank" rel="noopener noreferrer">{arabicaVersions['node-latest-tag']}</a></li>
      <li>Celestia App - <a href={`https://github.com/celestiaorg/celestia-app/releases/tag/${arabicaVersions['app-latest-tag']}`} target="_blank" rel="noopener noreferrer">{arabicaVersions['app-latest-tag']}</a></li>
      <li>Rollkit - <a href={`https://github.com/rollkit/rollkit/releases/tag/${constants.arabicaRollkitVersion}`} target="_blank" rel="noopener noreferrer">{constants.arabicaRollkitVersion}</a></li>
    </ul>
  );
};

export default ArabicaVersionTags;