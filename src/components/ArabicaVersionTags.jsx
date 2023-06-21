import React from 'react';
import arabicaVersions from "../../versions/arabica_versions.js";
import constants from "../../versions/constants.js";

const ArabicaVersionTags = () => {
  return (
    <ul>
      <li>Celestia Node - {arabicaVersions['node-latest-tag']}</li>
      <li>Celestia App - {arabicaVersions['app-latest-tag']}</li>
      <li>Rollkit - {constants.arabicaRollkitVersion}</li>
    </ul>
  );
};

export default ArabicaVersionTags;
