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
  const [specCopied, setSpecCopied] = useState(false);
  const methodRef = useRef<HTMLDivElement>(null);
  const params = method?.params ?? [];
  const result = method?.result ?? { name: '', description: 'Null', schema: {} };

  if (!method) return null;

  const handleCopyClick = () => {
    const hash = window.location.hash.substring(1);
    const element = document.getElementById(hash);
    element?.scrollIntoView();
  };

  return (
    <article
      key={`${pkg}.${method.name}`}
      id={`${pkg}.${method.name}`}
      className="rpc-method"
      ref={methodRef}
    >
      <div className="rpc-method__header">
        <div className="rpc-method__signature">
          <span className="rpc-method__name">{method.name}</span>(
          {params.map((param, i, { length }) => (
            <span key={param.name} className="rpc-method__param">
              <span>{param.name}</span>{' '}
              <button
                type="button"
                className="rpc-method__type"
                aria-label={`Show schema for ${param.name}`}
                onClick={() => activateSidebar(param)}
              >
                {param.description}
              </button>
              {length - 1 !== i && ', '}
            </span>
          ))}
          )
          {result.description !== 'Null' && (
            <button
              type="button"
              className="rpc-method__result"
              aria-label="Show result schema"
              onClick={() => activateSidebar(result)}
            >
              {result.description}
            </button>
          )}
          <span className="rpc-method__auth">
            perms: {method.auth}
          </span>
        </div>
        <CopyToClipboard
          text={`${window.location.origin}${window.location.pathname}?version=${selectedVersion}#${pkg}.${method.name}`}
          onCopy={handleCopyClick}
        >
          <button
            type="button"
            className="rpc-method__copy"
            aria-label={`Copy link to ${pkg}.${method.name}`}
            onClick={() => {
              window.location.hash = `${pkg}.${method.name}`;
            }}
          >
            <CopyIcon />
          </button>
        </CopyToClipboard>
      </div>
      
      <div className="rpc-method__description">
        {method.description}
      </div>
      
      <div className="rpc-method__actions">
        <button
          type='button'
          onClick={() => {
            if (pkg) {
              setCurrentRequest(getExampleRequest(pkg, method));
            }
            setPlaygroundOpen(true);
          }}
          className="rpc-button rpc-button--primary"
        >
          Try it out
        </button>

        <CopyToClipboard
          text={method.rawSpec ? JSON.stringify(method.rawSpec, null, 2) : ''}
          onCopy={() => {
            setSpecCopied(true);
            setTimeout(() => setSpecCopied(false), 2000);
          }}
        >
          <button
            type='button'
            className="rpc-button rpc-button--secondary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"></path>
            </svg>
            {specCopied ? 'Copied!' : 'Copy Spec'}
          </button>
        </CopyToClipboard>
      </div>
      
      <div className="rpc-method__examples">
        <button
          type="button"
          onClick={() => setShowRequest(!showRequest)}
          className="rpc-method__example-toggle"
          aria-expanded={showRequest}
        >
          {showRequest ? (
            <ChevronDownIcon width={18} />
          ) : (
            <ChevronRightIcon width={18} />
          )}
          <span>Request</span>
        </button>
        {showRequest && (
          <div className="rpc-method__example-body">
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
                  params: params.map((param) => {
                    const examples = param.schema?.examples;
                    return (Array.isArray(examples) && examples.length > 0) 
                      ? examples[0] 
                      : undefined;
                  }),
                },
                null,
                2
              )}
            </SyntaxHighlighter>
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setShowResponse(!showResponse)}
          className="rpc-method__example-toggle"
          aria-expanded={showResponse}
        >
          {showResponse ? (
            <ChevronDownIcon width={18} />
          ) : (
            <ChevronRightIcon width={18} />
          )}
          <span>Response</span>
        </button>
        {showResponse && (
          <div className="rpc-method__example-body">
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
                  result: (() => {
                    if (result.description === 'Null') return [];
                    const examples = result.schema?.examples;
                    return (Array.isArray(examples) && examples.length > 0) 
                      ? examples[0] 
                      : [];
                  })(),
                },
                null,
                2
              )}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </article>
  );
};
export default RPCMethod;
