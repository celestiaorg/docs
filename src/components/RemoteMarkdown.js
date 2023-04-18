import React, { useState, useEffect } from 'react';
import fetch from 'cross-fetch';
import ReactMarkdown from 'react-markdown';

const RemoteMarkdown = ({ url }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          setMarkdown(text);
        } else {
          console.error(`Error fetching the markdown file: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error importing the markdown file: ${error.message}`);
      }
    }
    fetchMarkdown();
  }, [url]);

  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};

export default RemoteMarkdown;
