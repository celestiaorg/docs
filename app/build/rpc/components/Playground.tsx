'use client';

import { CommandLineIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Editor } from '@monaco-editor/react';
import {
  Client,
  JSONRPCError,
  RequestManager,
  WebSocketTransport,
} from '@open-rpc/client-js';
import { useState } from 'react';

import { classNames } from '../lib/helper';
import { INotification, NodeError } from '../lib/types';

const tabs = [
  { name: 'Request', href: '#' },
  { name: 'Response', href: '#' },
  { name: 'Configuration', href: '#' },
];

const Playground = ({
  playgroundOpen,
  currentRequest,
  setPlaygroundOpen,
  setCurrentRequest,
  setNotification,
}: {
  playgroundOpen: boolean;
  currentRequest: string;
  setPlaygroundOpen: (open: boolean) => void;
  setCurrentRequest: (request: string) => void;
  setNotification: (notification: INotification) => void;
}) => {
  const [hostname, setHostname] = useState('');
  // request: 0, response: 1, config: 2
  const [currentTab, setCurrentTab] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<string>('');

  const sendRequest = async (
    request: string,
    hostname: string
  ): Promise<object> => {
    if (hostname == '') {
      hostname = 'ws://localhost:26658';
    } else {
      hostname = 'ws://' + hostname;
    }

    const transport = new WebSocketTransport(hostname);

    transport.connection.onerror = () => {
      setNotification({
        active: true,
        success: false,
        message:
          "Failed to connect to the node's WebSocket server at " + hostname,
      });
    };

    const requestManager = new RequestManager([transport]);
    const client = new Client(requestManager);

    // I know, this looks stupid, but it's the easiest way to display the response without writing a custom WS client
    const { method, params } = JSON.parse(request);
    try {
      const response = await client.request({ method, params });
      return { id: 1, jsonrpc: '2.0', result: response };
    } catch (err: unknown) {
      if (err instanceof JSONRPCError) {
        return {
          id: 1,
          jsonrpc: '2.0',
          error: { code: err.code, message: err.message },
        };
      } else {
        throw err;
      }
    }
  };

  if (!playgroundOpen) return null;

  return (
    <div className='nx-relative nx-z-50' aria-labelledby='playground-title' role='dialog' aria-modal='true'>
      <div className='nx-fixed nx-inset-0 nx-bg-gray-500 nx-bg-opacity-75 nx-transition-opacity' />

      <div className='nx-fixed inset-0 z-50 w-screen overflow-y-auto'>
        <div className='nx-flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <div className='nx-relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6'>
            <div className='nx-absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
              <button
                type='button'
                className='nx-rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                onClick={() => setPlaygroundOpen(false)}
              >
                <span className='nx-sr-only'>Close</span>
                <XMarkIcon className='nx-h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='nx-flex-grow'>
              <div className='nx-flex'>
                <div className='nx-mx-0 flex h-10 h-12 w-10 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100'>
                  <CommandLineIcon
                    className='nx-h-6 w-6 text-purple-600'
                    aria-hidden='true'
                  />
                </div>
                <h3
                  id='playground-title'
                  className='nx-ml-3 mt-2 text-base font-semibold text-gray-900'
                >
                  Node Playground
                </h3>
              </div>
              <div className='nx-mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                <div className='nx-mt-2 flex-grow flex-row'>
                  <div className='nx-mb-5 rounded-md bg-yellow-50 p-4'>
                    <div className='nx-flex'>
                      <div className='nx-flex-shrink-0'>
                        <svg
                          className='nx-h-5 w-5 text-yellow-400'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='nx-ml-3'>
                        <h3 className='nx-text-sm font-medium text-yellow-800'>
                          Local Node Required
                        </h3>
                        <div className='nx-mt-2 text-sm text-yellow-700'>
                          <p>To use this playground, you need:</p>
                          <ul className='nx-mt-1 list-disc pl-5'>
                            <li>A locally running light node</li>
                            <li>
                              Node started with{' '}
                              <code className='nx-rounded bg-yellow-100 px-1'>
                                --rpc.skip-auth
                              </code>{' '}
                              flag
                            </li>
                            <li>
                              Node running on the default WebSocket port
                              (26658)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* TABS */}
                  <div className='nx-sm:hidden'>
                    <label htmlFor='tabs' className='nx-sr-only'>
                      Select a tab
                    </label>
                    <select
                      id='tabs'
                      name='tabs'
                      className='nx-block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                      value={tabs[currentTab].name}
                      onChange={(e) => {
                        switch (e.currentTarget.value) {
                          case 'Request':
                            setCurrentTab(0);
                            break;
                          case 'Response':
                            setCurrentTab(1);
                            break;
                          case 'Configure':
                            setCurrentTab(2);
                            break;
                          default:
                            setCurrentTab(0);
                            break;
                        }
                      }}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='nx-hidden flex-grow sm:block'>
                    <nav
                      className='nx-isolate flex divide-x divide-gray-200 rounded-lg shadow'
                      aria-label='Tabs'
                    >
                      {tabs.map((tab, tabIdx) => (
                        <a
                          key={tab.name}
                          href={tab.href}
                          onClick={() => setCurrentTab(tabIdx)}
                          className={classNames(
                            currentTab == tabIdx
                              ? 'text-gray-900'
                              : 'text-gray-500 hover:text-gray-700',
                            tabIdx === 0 ? 'rounded-l-lg' : '',
                            tabIdx === tabs.length - 1
                              ? 'rounded-r-lg'
                              : '',
                            'group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                          )}
                          aria-current={
                            currentTab == tabIdx ? 'page' : undefined
                          }
                        >
                          <span>{tab.name}</span>
                          <span
                            aria-hidden='true'
                            className={classNames(
                              currentTab == tabIdx
                                ? 'bg-purple-500'
                                : 'bg-transparent',
                              'absolute inset-x-0 bottom-0 h-0.5'
                            )}
                          />
                        </a>
                      ))}
                    </nav>
                  </div>
                  {/* PLAYGROUND */}
                  {
                    {
                      0: (
                        <div>
                          <Editor
                            language='json'
                            options={{
                              scrollBeyondLastLine: false,
                              minimap: { enabled: false },
                              useShadows: false,
                            }}
                            className='nx-mt-3 min-h-52'
                            value={currentRequest}
                            onChange={(value) =>
                              value &&
                              value != currentResponse &&
                              setCurrentRequest(value)
                            }
                          />
                        </div>
                      ),
                      1: (
                        <div>
                          <Editor
                            language='json'
                            options={{
                              scrollBeyondLastLine: false,
                              minimap: { enabled: false },
                              useShadows: false,
                              readOnly: true,
                            }}
                            className='nx-mt-3 min-h-52'
                            value={currentResponse}
                          />
                        </div>
                      ),
                      2: (
                        <div>
                          <label
                            htmlFor='ip'
                            className='nx-mt-6 block text-sm font-medium leading-6 text-gray-900'
                          >
                            IP Address
                          </label>
                          <div className='nx-mt-2 flex rounded-md shadow-sm'>
                            <span className='nx-inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm'>
                              ws://
                            </span>
                            <input
                              type='text'
                              name='ip'
                              id='ip'
                              className='nx-block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                              placeholder='localhost:26658'
                              value={hostname}
                              onChange={(e) => setHostname(e.target.value)}
                            />
                          </div>
                          <p
                            className='nx-mt-2 text-sm text-gray-500'
                            id='protocol-description'
                          >
                            only ws:// is supported at this time
                          </p>
                        </div>
                      ),
                    }[currentTab]
                  }
                </div>
              </div>
            </div>
            <div className='nx-mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='nx-mt-3 inline-flex w-full justify-center rounded-md bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                onClick={async () => {
                  try {
                    const data = await sendRequest(
                      currentRequest,
                      hostname
                    );
                    setCurrentResponse(JSON.stringify(data, null, 2));
                    setCurrentTab(1);
                    if ('error' in data) {
                      const nodeError = data as { error: NodeError };
                      setNotification({
                        active: true,
                        success: false,
                        message: nodeError.error.message,
                      });
                    } else {
                      setNotification({
                        active: true,
                        success: true,
                        message: 'Request sent successfully',
                      });
                    }
                  } catch (e) {
                    setNotification({
                      active: true,
                      success: false,
                      message: 'Unknown error: ' + e,
                    });
                    return;
                  }
                }}
                data-autofocus
              >
                Send Request
              </button>
              <button
                type='button'
                className='nx-mr-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                onClick={() => setPlaygroundOpen(false)}
                data-autofocus
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Playground;

