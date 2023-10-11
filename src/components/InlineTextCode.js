import React from 'react';

const InlineTextCode = ({ children, constant }) => {
  return (
    <code style={{ display: 'inline' }}>
      {children}
      {constant}
    </code>
  );
};

export default InlineTextCode;