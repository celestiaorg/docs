import React from 'react';
import blockspaceraceVersions from "../../versions/blockspacerace_versions.js";
import constants from "../../versions/constants.js";

const VersionTags = () => {
  return (
    <ul>
      <li>Celestia Node - {blockspaceraceVersions['node-latest-tag']}</li>
      <li>Celestia App - {blockspaceraceVersions['app-latest-tag']}</li>
      <li>Rollkit - {constants.rollkitVersion}</li>
    </ul>
  );
};

export default VersionTags;
