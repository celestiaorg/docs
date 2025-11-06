'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { getExampleRequest } from '../lib/helper';
import { Method, Param } from '../lib/types';
import CopyIcon from './CopyIcon';

const RPCMethod = ({
  pkg,
  method,
  activateSidebar,
  selectedVersion,
  setCurrentRequest,
  setPlaygroundOpen,
}: {
  pkg: string;
  method: Method;
  activateSidebar: (param: Param) => void;
  selectedVersion: string;
  setCurrentRequest: (req: string) => void;
  setPlaygroundOpen: (open: boolean) => void;
}) => {
  const [showRequest, setShowRequest] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const methodRef = useRef<HTMLDivElement>(null);

  const handleCopyClick = () => {
    const hash = window.location.hash.substring(1);
    const element = document.getElementById(hash);
    element?.scrollIntoView();
  };

  return (
    <div
      key={`${pkg}.${method.name}`}
      id={`${pkg}.${method.name}`}
      style={{ padding: '0.5rem 0' }}
      ref={methodRef}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
          <span style={{ fontWeight: 600 }}>{method.name}</span>(
          {method.params.map((param, i, { length }) => (
            <span key={param.name} style={{ fontSize: '0.875rem', color: '#666' }}>
              <span>{param.name}</span>{' '}
              <span
                style={{ color: '#0070f3', cursor: 'pointer' }}
                onClick={() => activateSidebar(param)}
              >
                {param.description}
                {length - 1 != i && ', '}
              </span>
            </span>
          ))}
          )
          {method.result.description != 'Null' && (
            <span
              style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#0070f3', cursor: 'pointer' }}
              onClick={() => activateSidebar(method.result)}
            >
              {method.result.description}
            </span>
          )}
          <span style={{ 
            marginLeft: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.125rem 0.625rem',
            borderRadius: '9999px',
            backgroundColor: '#ede9fe',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b21a8'
          }}>
            perms: {method.auth}
          </span>
        </div>
        <CopyToClipboard
          text={`${window.location.origin}${window.location.pathname}?version=${selectedVersion}#${pkg}.${method.name}`}
          onCopy={handleCopyClick}
        >
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.hash = `${pkg}.${method.name}`;
            }}
          >
            <CopyIcon />
          </div>
        </CopyToClipboard>
      </div>
      
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.75rem', fontWeight: 300 }}>
        {method.description}
      </div>
      
      <button
        type='button'
        onClick={() => {
          if (pkg) {
            setCurrentRequest(getExampleRequest(pkg, method));
          }
          setPlaygroundOpen(true);
        }}
        style={{
          marginTop: '0.75rem',
          marginBottom: '0.75rem',
          display: 'inline-flex',
          width: '100%',
          justifyContent: 'center',
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          cursor: 'pointer'
        }}
      >
        Try it out
      </button>
      
      <div style={{ 
        marginTop: '1.5rem',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        fontSize: '0.875rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div
          onClick={() => setShowRequest(!showRequest)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            backgroundColor: showRequest ? '#f9fafb' : 'white'
          }}
        >
          {showRequest ? (
            <ChevronDownIcon style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
          ) : (
            <ChevronRightIcon style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
          )}
          <span style={{ fontWeight: 500 }}>Request</span>
        </div>
        {showRequest && (
          <div style={{ 
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            padding: '1rem'
          }}>
            <SyntaxHighlighter
              language='javascript'
              customStyle={{
                backgroundColor: 'transparent',
                margin: 0,
                fontSize: '0.8125rem'
              }}
            >
              {JSON.stringify(
                {
                  id: 1,
                  jsonrpc: '2.0',
                  method: pkg + '.' + method.name,
                  params: method.params.map((param) =>
                    param.schema && param.schema.examples
                      ? param.schema.examples[0]
                      : undefined
                  ),
                },
                null,
                2
              )}
            </SyntaxHighlighter>
          </div>
        )}
        
        <div
          onClick={() => setShowResponse(!showResponse)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderTop: '1px solid #e5e7eb',
            cursor: 'pointer',
            backgroundColor: showResponse ? '#f9fafb' : 'white'
          }}
        >
          {showResponse ? (
            <ChevronDownIcon style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
          ) : (
            <ChevronRightIcon style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
          )}
          <span style={{ fontWeight: 500 }}>Response</span>
        </div>
        {showResponse && (
          <div style={{ 
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            padding: '1rem'
          }}>
            <SyntaxHighlighter
              language='javascript'
              customStyle={{
                backgroundColor: 'transparent',
                margin: 0,
                fontSize: '0.8125rem'
              }}
            >
              {JSON.stringify(
                {
                  id: 1,
                  jsonrpc: '2.0',
                  result:
                    method.result.description == 'Null' ||
                    !method.result.schema.examples
                      ? []
                      : method.result.schema.examples[0],
                },
                null,
                2
              )}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};
export default RPCMethod;
