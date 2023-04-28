import React from 'react';

const InlineText = ({ children, constant }) => {
  return (
    <span style={{ display: 'inline' }}>
      {children}
      {constant}
    </span>
  );
};

export default InlineText;
