import React from 'react';
import Navbar from '@theme/Navbar';
import DocSidebar from '@theme/DocSidebar';

function ApiLayout(props) {
  const { sidebar } = props;

  return (
    <div className="DocPage">
      <Navbar />
      <div className="DocPage-container">
        <DocSidebar sidebar={sidebar} />
        <main>{props.children}</main>
      </div>
    </div>
  );
}

export default ApiLayout;