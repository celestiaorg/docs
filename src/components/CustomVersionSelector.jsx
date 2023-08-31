import React, { useState, useEffect } from 'react';
import './CustomVersionSelector.css'; // Import the CSS file

function CustomVersionSelector({ className, versions }) {
  const currentVersion = window.location.pathname.split('/')[2];
  const [selectedVersion, setSelectedVersion] = useState(`/api/${currentVersion}`);

  useEffect(() => {
    setSelectedVersion(`/api/${window.location.pathname.split('/')[2]}`);
  }, [window.location.pathname]);
  
  // Sort versions so that the current version comes first
  const sortedVersions = [...versions].sort((a, b) => (a === currentVersion ? -1 : b === currentVersion ? 1 : 0));

  return (
    <div className={`custom-version-selector ${className}`}>
      <select className="menu__link" value={selectedVersion} onChange={(e) => window.location.href = e.target.value}>
        <option disabled>celestia-node version</option>
        {sortedVersions.map((version) => (
          <option key={version} value={`/api/${version === 'Next' ? 'next' : version}`}>
            {version}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomVersionSelector;