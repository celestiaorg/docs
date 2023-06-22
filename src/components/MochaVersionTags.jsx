import React from 'react';
import mochaVersions from "../../versions/mocha_versions.js";
import constants from "../../versions/constants.js";

const MochaVersionTags = () => {
  return (
    <ul>
      <li>Celestia Node - <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${mochaVersions['node-latest-tag']}`} target="_blank" rel="noopener noreferrer">{mochaVersions['node-latest-tag']}</a></li>
      <li>Celestia App - <a href={`https://github.com/celestiaorg/celestia-app/releases/tag/${mochaVersions['app-latest-tag']}`} target="_blank" rel="noopener noreferrer">{mochaVersions['app-latest-tag']}</a></li>
      <li>Rollkit - <a href={`https://github.com/rollkit/rollkit/releases/tag/${constants.mochaRollkitVersion}`} target="_blank" rel="noopener noreferrer">{constants.mochaRollkitVersion}</a></li>
    </ul>
  );
};

export default MochaVersionTags;
