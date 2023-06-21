import React from 'react';
import mochaVersions from "../../versions/mocha_versions.js";
import constants from "../../versions/constants.js";

const MochaVersionTags = () => {
  return (
    <ul>
      <li>Celestia Node - {mochaVersions['node-latest-tag']}</li>
      <li>Celestia App - {mochaVersions['app-latest-tag']}</li>
      <li>Rollkit - {constants.mochaRollkitVersion}</li>
    </ul>
  );
};

export default MochaVersionTags;
