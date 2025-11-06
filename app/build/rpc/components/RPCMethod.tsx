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
  isDark = false,
}: {
  pkg: string;
  method: Method;
  activateSidebar: (param: Param) => void;
  selectedVersion: string;
  setCurrentRequest: (req: string) => void;
  setPlaygroundOpen: (open: boolean) => void;
  isDark?: boolean;
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
      className="x:py-2"
      ref={methodRef}
    >
      <div className="x:flex x:items-center x:justify-between x:mb-2">
        <div className="x:font-mono x:text-[0.95rem]">
          <span className="x:font-semibold x:text-gray-900 x:dark:text-gray-100">{method.name}</span>(
          {method.params.map((param, i, { length }) => (
            <span key={param.name} className="x:text-sm x:text-gray-600 x:dark:text-gray-400">
              <span>{param.name}</span>{' '}
              <span
                className="x:text-primary-600 x:dark:text-primary-500 x:cursor-pointer x:hover:underline"
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
              className="x:ml-2 x:text-sm x:text-primary-600 x:dark:text-primary-500 x:cursor-pointer x:hover:underline"
              onClick={() => activateSidebar(method.result)}
            >
              {method.result.description}
            </span>
          )}
          <span className="x:ml-2 x:inline-flex x:items-center x:px-2.5 x:py-0.5 x:rounded-full x:bg-purple-100 x:dark:bg-purple-900/30 x:text-xs x:font-medium x:text-purple-800 x:dark:text-purple-300">
            perms: {method.auth}
          </span>
        </div>
        <CopyToClipboard
          text={`${window.location.origin}${window.location.pathname}?version=${selectedVersion}#${pkg}.${method.name}`}
          onCopy={handleCopyClick}
        >
          <div
            className="x:cursor-pointer"
            onClick={() => {
              window.location.hash = `${pkg}.${method.name}`;
            }}
          >
            <CopyIcon />
          </div>
        </CopyToClipboard>
      </div>
      
      <div className="x:text-sm x:text-gray-600 x:dark:text-gray-200 x:mb-3 x:font-light">
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
        className="x:mt-3 x:mb-3 x:inline-flex x:w-full x:justify-center x:px-4 x:py-2 x:border x:border-gray-300 x:dark:border-gray-700 x:rounded-md x:text-sm x:font-medium x:text-gray-700 x:dark:text-gray-200 x:shadow-sm x:cursor-pointer x:hover:bg-gray-50 x:dark:hover:bg-gray-700 x:transition-colors"
        style={{
          backgroundColor: isDark ? 'rgb(31 41 55)' : 'white'
        }}
      >
        Try it out
      </button>
      
      <div 
        className="x:mt-6 x:overflow-hidden x:rounded-lg x:border x:border-gray-200 x:dark:border-gray-700 x:text-sm x:shadow-sm"
        style={{
          backgroundColor: isDark ? 'rgb(31 41 55)' : 'white'
        }}
      >
        <div
          onClick={() => setShowRequest(!showRequest)}
          className="x:flex x:items-center x:px-4 x:py-3 x:cursor-pointer x:transition-colors"
          style={{
            backgroundColor: isDark ? (showRequest ? 'rgba(31, 41, 55, 0.5)' : 'rgb(31 41 55)') : (showRequest ? 'rgb(249 250 251)' : 'white')
          }}
        >
          {showRequest ? (
            <ChevronDownIcon className="x:mr-2 x:h-5 x:w-5 x:text-gray-600 x:dark:text-gray-400" />
          ) : (
            <ChevronRightIcon className="x:mr-2 x:h-5 x:w-5 x:text-gray-600 x:dark:text-gray-400" />
          )}
          <span className="x:font-medium x:text-gray-900 x:dark:text-gray-100">Request</span>
        </div>
        {showRequest && (
          <div 
            className="x:border-t x:border-gray-200 x:dark:border-gray-700 x:p-4"
            style={{
              backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
          >
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
                  params: method.params.map((param) => {
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
        
        <div
          onClick={() => setShowResponse(!showResponse)}
          className="x:flex x:items-center x:px-4 x:py-3 x:border-t x:border-gray-200 x:dark:border-gray-700 x:cursor-pointer x:transition-colors"
          style={{
            backgroundColor: isDark ? (showResponse ? 'rgba(31, 41, 55, 0.5)' : 'rgb(31 41 55)') : (showResponse ? 'rgb(249 250 251)' : 'white')
          }}
        >
          {showResponse ? (
            <ChevronDownIcon className="x:mr-2 x:h-5 x:w-5 x:text-gray-600 x:dark:text-gray-400" />
          ) : (
            <ChevronRightIcon className="x:mr-2 x:h-5 x:w-5 x:text-gray-600 x:dark:text-gray-400" />
          )}
          <span className="x:font-medium x:text-gray-900 x:dark:text-gray-100">Response</span>
        </div>
        {showResponse && (
          <div 
            className="x:border-t x:border-gray-200 x:dark:border-gray-700 x:p-4"
            style={{
              backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
          >
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
                    if (method.result.description == 'Null') return [];
                    const examples = method.result.schema?.examples;
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
    </div>
  );
};
export default RPCMethod;
