'use client';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { Editor } from '@monaco-editor/react';
import {
  Client,
  JSONRPCError,
  RequestManager,
  WebSocketTransport,
} from '@open-rpc/client-js';
import { useState } from 'react';

import { INotification, NodeError } from '../lib/types';
import { useDarkMode } from '../hooks/useDarkMode';

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
  
  // Use shared dark mode hook
  const isDark = useDarkMode();

  const sendRequest = async (
    request: string,
    hostname: string
  ): Promise<object> => {
    return new Promise((resolve, reject) => {
      // Determine the WebSocket URL
      const wsUrl = hostname === '' ? 'ws://localhost:26658' : `wss://${hostname}`;
      
      const transport = new WebSocketTransport(wsUrl);
      let connectionEstablished = false;
      let connectionClosed = false;

      // Enhanced error handling for WebSocket connection
      transport.connection.onerror = (error: Event) => {
        console.error('WebSocket connection error:', error);
        if (!connectionEstablished && !connectionClosed) {
          connectionClosed = true;
          reject(new Error(`Cannot connect to ${wsUrl}. Make sure your Celestia node is running with --rpc.skip-auth flag.`));
        }
      };

      transport.connection.onopen = () => {
        connectionEstablished = true;
      };

      transport.connection.onclose = (event: CloseEvent) => {
        if (event.code !== 1000 && connectionEstablished && !connectionClosed) {
          // 1000 is normal closure
          connectionClosed = true;
          reject(new Error(`Connection closed unexpectedly (code: ${event.code}). Check your node configuration.`));
        }
    };

    const requestManager = new RequestManager([transport]);
    const client = new Client(requestManager);

      // Parse and send the request
      try {
    const { method, params } = JSON.parse(request);
        
        client.request({ method, params })
          .then(response => {
            resolve({ id: 1, jsonrpc: '2.0', result: response });
          })
          .catch((err: unknown) => {
      if (err instanceof JSONRPCError) {
              // Resolve with error format (not reject) for RPC errors
              resolve({
          id: 1,
          jsonrpc: '2.0',
          error: { code: err.code, message: err.message },
              });
      } else {
              // Enhanced error reporting for non-RPC errors
              console.error('Request failed:', err);
              reject(new Error(
                err instanceof Error 
                  ? err.message 
                  : 'Request failed - check console for details'
              ));
            }
          });
      } catch (parseError) {
        reject(new Error(
          parseError instanceof Error
            ? `Invalid JSON: ${parseError.message}`
            : 'Failed to parse request JSON'
        ));
      }
    });
  };

  return (
    <Transition show={playgroundOpen}>
      <Dialog 
        style={{ position: 'relative', zIndex: 9999 }}
        onClose={setPlaygroundOpen}
      >
        <TransitionChild
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999
            }}
          />
        </TransitionChild>

        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            overflow: 'auto'
          }}
        >
          <div 
            style={{
              display: 'flex',
              minHeight: '100vh',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <TransitionChild
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel 
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '42rem',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: isDark 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  textAlign: 'left',
                  overflow: 'hidden'
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ 
                      width: '3rem', 
                      height: '3rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRadius: '50%', 
                      backgroundColor: '#f3e8ff',
                      flexShrink: 0
                    }}>
                  <CommandLineIcon
                        style={{ width: '1.5rem', height: '1.5rem', color: '#9333ea' }}
                    aria-hidden='true'
                  />
                </div>
                    <DialogTitle
                      as='h3'
                      style={{ 
                        marginLeft: '0.75rem',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: isDark ? '#f9fafb' : '#111827'
                      }}
                >
                  Node Playground
                    </DialogTitle>
              </div>
                  <div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ 
                        marginBottom: '1.25rem', 
                        borderRadius: '0.375rem', 
                        backgroundColor: isDark ? '#422006' : '#fefce8',
                        padding: '1rem',
                        border: isDark ? '1px solid #78350f' : 'none'
                      }}>
                        <div style={{ display: 'flex' }}>
                          <div style={{ flexShrink: 0 }}>
                            <svg
                              style={{ width: '1.25rem', height: '1.25rem', color: '#facc15' }}
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
                          <div style={{ marginLeft: '0.75rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: isDark ? '#fbbf24' : '#854d0e' }}>
                          Local Node Required
                        </h3>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: isDark ? '#fde047' : '#a16207' }}>
                          <p>To use this playground, you need:</p>
                              <ul style={{ marginTop: '0.25rem', listStyle: 'disc', paddingLeft: '1.25rem' }}>
                            <li>A locally running light node</li>
                            <li>
                              Node started with{' '}
                                  <code style={{ 
                                    borderRadius: '0.25rem', 
                                    backgroundColor: isDark ? '#78350f' : '#fef9c3', 
                                    padding: '0 0.25rem',
                                    color: isDark ? '#fde047' : 'inherit'
                                  }}>
                                --rpc.skip-auth
                              </code>{' '}
                              flag
                            </li>
                            <li>
                                  Node running on the default WebSocket port (26658)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* TABS */}
                      <div style={{ marginBottom: '1rem' }}>
                        <nav
                          style={{
                            display: 'flex',
                            borderRadius: '0.5rem',
                            boxShadow: isDark 
                              ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' 
                              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            backgroundColor: isDark ? '#374151' : 'white'
                          }}
                      aria-label='Tabs'
                    >
                      {tabs.map((tab, tabIdx) => (
                        <a
                          key={tab.name}
                          href={tab.href}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentTab(tabIdx);
                              }}
                              style={{
                                position: 'relative',
                                flex: 1,
                                padding: '1rem',
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                backgroundColor: isDark ? '#374151' : 'white',
                                color: currentTab == tabIdx 
                                  ? (isDark ? '#f9fafb' : '#111827')
                                  : (isDark ? '#9ca3af' : '#6b7280'),
                                cursor: 'pointer',
                                borderLeft: tabIdx > 0 
                                  ? (isDark ? '1px solid #4b5563' : '1px solid #e5e7eb') 
                                  : 'none',
                                borderTopLeftRadius: tabIdx === 0 ? '0.5rem' : 0,
                                borderBottomLeftRadius: tabIdx === 0 ? '0.5rem' : 0,
                                borderTopRightRadius: tabIdx === tabs.length - 1 ? '0.5rem' : 0,
                                borderBottomRightRadius: tabIdx === tabs.length - 1 ? '0.5rem' : 0,
                              }}
                          aria-current={
                            currentTab == tabIdx ? 'page' : undefined
                          }
                        >
                          <span>{tab.name}</span>
                          <span
                            aria-hidden='true'
                                style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: '2px',
                                  backgroundColor: currentTab == tabIdx ? '#9333ea' : 'transparent'
                                }}
                          />
                        </a>
                      ))}
                    </nav>
                  </div>
                  {/* PLAYGROUND */}
                      {/* Request Tab */}
                      <div style={{ marginTop: '0.75rem', display: currentTab === 0 ? 'block' : 'none' }}>
                          <Editor
                          key='request-editor'
                            language='json'
                          theme={isDark ? 'vs-dark' : 'light'}
                            options={{
                              scrollBeyondLastLine: false,
                              minimap: { enabled: false },
                              useShadows: false,
                            }}
                          height='13rem'
                            value={currentRequest}
                            onChange={(value) =>
                              value &&
                              value != currentResponse &&
                              setCurrentRequest(value)
                            }
                          />
                        </div>
                      {/* Response Tab */}
                      <div style={{ marginTop: '0.75rem', display: currentTab === 1 ? 'block' : 'none' }}>
                          <Editor
                          key='response-editor'
                            language='json'
                          theme={isDark ? 'vs-dark' : 'light'}
                            options={{
                              scrollBeyondLastLine: false,
                              minimap: { enabled: false },
                              useShadows: false,
                              readOnly: true,
                            }}
                          height='13rem'
                            value={currentResponse}
                          />
                        </div>
                      {/* Configuration Tab */}
                      <div style={{ display: currentTab === 2 ? 'block' : 'none' }}>
                          <label
                            htmlFor='ip'
                          style={{ 
                            marginTop: '1.5rem',
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            lineHeight: 1.5,
                            color: isDark ? '#f9fafb' : '#111827'
                          }}
                          >
                            IP Address
                          </label>
                        <div style={{ 
                          marginTop: '0.5rem', 
                          display: 'flex', 
                          borderRadius: '0.375rem', 
                          boxShadow: isDark 
                            ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
                            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                        }}>
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderTopLeftRadius: '0.375rem',
                            borderBottomLeftRadius: '0.375rem',
                            border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                            borderRight: 0,
                            padding: '0 0.75rem',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            backgroundColor: isDark ? '#374151' : 'transparent',
                            fontSize: '0.875rem'
                          }}>
                              ws://
                            </span>
                            <input
                              type='text'
                              name='ip'
                              id='ip'
                            style={{ 
                              display: 'block',
                              width: '100%',
                              minWidth: 0,
                              flex: 1,
                              borderTopRightRadius: '0.375rem',
                              borderBottomRightRadius: '0.375rem',
                              border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                              borderLeft: 0,
                              padding: '0.375rem 0.75rem',
                              color: isDark ? '#f9fafb' : '#111827',
                              backgroundColor: isDark ? '#374151' : 'white',
                              fontSize: '0.875rem',
                              lineHeight: 1.5
                            }}
                              placeholder='localhost:26658'
                              value={hostname}
                              onChange={(e) => setHostname(e.target.value)}
                            />
                          </div>
                          <p
                          style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.875rem', 
                            color: isDark ? '#9ca3af' : '#6b7280' 
                          }}
                            id='protocol-description'
                          >
                            only ws:// is supported at this time
                          </p>
                        </div>
                </div>
              </div>
            </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'row-reverse', gap: '0.75rem' }}>
              <button
                type='button'
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      borderRadius: '0.375rem',
                      backgroundColor: isDark ? '#7c3aed' : '#f3e8ff',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isDark ? '#f3e8ff' : '#581c87',
                      boxShadow: isDark 
                        ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
                        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      border: isDark ? '1px solid #9333ea' : '1px solid #d8b4fe',
                      cursor: 'pointer'
                    }}
                onClick={async () => {
                  // Validate JSON request
                  try {
                    JSON.parse(currentRequest);
                  } catch {
                    setNotification({
                      active: true,
                      success: false,
                      message: 'Invalid JSON in request body. Please fix the syntax.',
                    });
                    return;
                  }

                  // Check if request has required fields
                  let parsedRequest;
                  try {
                    parsedRequest = JSON.parse(currentRequest);
                    if (!parsedRequest.method) {
                      setNotification({
                        active: true,
                        success: false,
                        message: 'Request must include a "method" field.',
                      });
                      return;
                    }
                  } catch {
                    // Already handled above
                    return;
                  }

                      // Show loading notification
                      setNotification({
                        active: true,
                        success: true,
                        message: 'Connecting to node...',
                      });

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
                            message: `RPC Error: ${nodeError.error.message}`,
                      });
                    } else {
                      setNotification({
                        active: true,
                        success: true,
                            message: 'Request sent successfully! ✓',
                      });
                    }
                  } catch (e) {
                        const errorMessage = (e as Error).message || String(e);
                    setNotification({
                      active: true,
                      success: false,
                          message: `Failed to send request: ${errorMessage}`,
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
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      borderRadius: '0.375rem',
                      backgroundColor: isDark ? '#374151' : 'white',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isDark ? '#f9fafb' : '#111827',
                      boxShadow: isDark 
                        ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
                        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                onClick={() => setPlaygroundOpen(false)}
                data-autofocus
              >
                Dismiss
              </button>
            </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default Playground;

