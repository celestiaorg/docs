'use client';

import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

import { INotification, MethodByPkg, OpenRPCSpec, Param } from '../lib/types';
import { useDarkMode } from '../hooks/useDarkMode';

import NotificationModal from '../components/NotificationModal';
import Playground from '../components/Playground';
import RPCMethod from '../components/RPCMethod';
import ParamModal from '../components/ParamModal';

// Get base path for asset references
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function extractAuth(methodDescription: string | undefined): string {
  if (!methodDescription) return '';
  return methodDescription.split('Auth level: ')[1] || '';
}

function getMethodsByPackage(spec: OpenRPCSpec): MethodByPkg {
  const methodsByPackage: MethodByPkg = {};
  for (const method of spec.methods) {
    const methodName = method.name.split('.');
    const pkg = methodName[0];
    const name = methodName[1];
    const methodData = {
      name: name,
      description: method.summary,
      params: method.params || [],
      auth: extractAuth(method.description),
      result: method.result || { name: '', schema: {} },
    };
    
    if (!methodsByPackage[pkg]) {
      methodsByPackage[pkg] = [methodData];
    } else {
      methodsByPackage[pkg].push(methodData);
    }
  }
  return methodsByPackage;
}

const versions = [
  'v0.11.0-rc8',
  'rc8-0cf4a49',
  'v0.11.0-rc11',
  'v0.11.0-rc12',
  'v0.11.0-rc13',
  'v0.11.0-rc14',
  'v0.11.0',
  'v0.12.0',
  'v0.12.1',
  'v0.12.2',
  'v0.12.3',
  'v0.12.4',
  'v0.13.0',
  'v0.13.1',
  'v0.13.2',
  'v0.13.3',
  'v0.13.4',
  'v0.13.5',
  'v0.13.6',
  'v0.13.7',
  'v0.14.0',
  'v0.14.1',
  'v0.15.0',
  'v0.16.0',
  'v0.17.1',
  'v0.17.2',
  'v0.20.2',
  'v0.20.3',
  'v0.20.4',
  'v0.21.9',
  'v0.22.1',
  'v0.22.2',
  'v0.22.3',
  'v0.23.5',
  'v0.25.3',
  'v0.26.4',
  'v0.28.4',
].reverse();

export default function RPCDocumentation() {
  // Use shared dark mode hook
  const isDark = useDarkMode();
  
  // State management
  const [spec, setSpec] = useState<OpenRPCSpec | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSwitchingVersion, setIsSwitchingVersion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentParam, setCurrentParam] = useState<Param>({
    name: '',
    description: '',
    schema: {},
  });

  const [currentRequest, setCurrentRequest] = useState<string>('');
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [notification, setNotification] = useState<INotification>({
    message: '',
    success: true,
    active: false,
  });

  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Consolidated fetch function with loading and error handling
  const fetchJsonData = useCallback(async (version: string, isInitial = false) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsSwitchingVersion(true);
    }
    setError(null);
    try {
      const response = await axios.get(`${basePath}/specs/openrpc-${version}.json`);
      setSpec(response.data);
      const hash = window.location.hash;
      window.history.replaceState({}, '', `?version=${version}${hash}`);
    } catch (err) {
      setError(`Failed to load API specification for ${version}`);
      console.error('Error fetching JSON data:', err);
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsSwitchingVersion(false);
      }
    }
  }, []);

  // Initialize version from URL on mount and fetch data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    const targetVersion = (versionParam && versions.includes(versionParam)) 
      ? versionParam 
      : versions[0];
    
    if (targetVersion !== selectedVersion) {
      setSelectedVersion(targetVersion);
    }
    
    fetchJsonData(targetVersion, true); // Mark as initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle version changes after mount
  useEffect(() => {
    // Skip if this is the initial render
    if (isInitialLoading) return;
    
    if (selectedVersion !== versions[0] || window.location.search) {
      fetchJsonData(selectedVersion, false); // Mark as version switch
    }
  }, [selectedVersion, fetchJsonData, isInitialLoading]);

  // Scroll to hash with MutationObserver (replaces hardcoded setTimeout)
  useEffect(() => {
    if (!spec) return;
    
    const scrollToHash = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return false;
      
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        return true;
      }
      return false;
    };
    
    // Try immediately
    if (scrollToHash()) return;
    
    // Watch for content to appear
    const observer = new MutationObserver(() => {
      if (scrollToHash()) {
        observer.disconnect();
      }
    });
    
    const main = document.querySelector('main');
    if (main) {
      observer.observe(main, { childList: true, subtree: true });
      // Safety timeout to prevent infinite observation
      const timeoutId = setTimeout(() => observer.disconnect(), 5000);
      
      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
      };
    }
  }, [spec]);

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = event.target.value;
    setSelectedVersion(newVersion);
    window.history.pushState({}, '', `?version=${newVersion}`);
  };

  const activateSidebar = (param: Param) => {
    setOpen(true);
    setCurrentParam(param);
  };

  // Show loading state only on initial page load
  if (isInitialLoading) {
    return (
      <div 
        className="x:flex x:items-center x:justify-center x:py-12"
        style={{ minHeight: '400px' }}
      >
        <div className="x:text-gray-600 x:dark:text-gray-400 x:text-center">
          <div className="x:mb-4 x:text-lg">Loading API documentation...</div>
          <div className="x:text-sm x:text-gray-500 x:dark:text-gray-500">
            Version: {selectedVersion}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div 
        className="x:rounded-lg x:p-6"
        style={{
          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgb(254, 242, 242)',
          border: `1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : 'rgb(252, 165, 165)'}`
        }}
      >
        <h3 
          className="x:text-lg x:font-semibold x:mb-2"
          style={{ color: isDark ? 'rgb(252, 165, 165)' : 'rgb(153, 27, 27)' }}
        >
          Error Loading Documentation
        </h3>
        <p 
          className="x:text-sm x:mb-4"
          style={{ color: isDark ? 'rgb(254, 202, 202)' : 'rgb(185, 28, 28)' }}
        >
          {error}
        </p>
        <button
          onClick={() => fetchJsonData(selectedVersion)}
          className="x:px-4 x:py-2 x:rounded-md x:text-sm x:font-medium x:transition-colors"
          style={{
            backgroundColor: isDark ? 'rgb(185, 28, 28)' : 'rgb(220, 38, 38)',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure spec is not null before rendering
  if (!spec) return null;

  return (
    <>
      {/* Description and Controls */}
      <div className="x:mb-4">
        {spec && (
          <div className="x:text-sm x:text-gray-600 x:dark:text-gray-200 x:mb-8">
            The Celestia Node API is the collection of RPC methods that can be used to interact with the services provided by Celestia Data Availability Nodes. Node API uses auth tokens to control access to this API.{' '}
            <a
              href={`https://github.com/celestiaorg/celestia-node/releases/tag/${spec.info.version}`}
              target='_blank'
              rel='noopener noreferrer'
              className="x:text-primary-600 x:dark:text-primary-500 x:no-underline x:hover:underline"
            >
              ({spec.info.version})
            </a>
          </div>
        )}
        
        {/* Search and Version Picker - Search fills space, Version floats right */}
        <div className="x:flex x:items-center x:gap-4">
          <input
            type='text'
            placeholder='Search modules & methods...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="x:px-3 x:py-2 x:border x:border-gray-300 x:dark:border-gray-600 x:rounded-md x:text-sm x:text-gray-900 x:dark:text-gray-100 x:placeholder-gray-500 x:dark:placeholder-gray-400 x:shadow-sm"
            style={{
              backgroundColor: isDark ? 'rgb(17 24 39)' : 'white',
              flex: '1 1 0%',
              minWidth: '0'
            }}
          />
          
          <div 
            className="x:inline-flex x:items-center x:gap-2 x:px-4 x:py-2 x:rounded-lg x:text-sm x:font-medium"
            style={{
              backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(243 244 246)',
              marginLeft: 'auto'
            }}
          >
            <span className="x:whitespace-nowrap x:text-gray-700 x:dark:text-gray-200">API version:</span>
            <select
              value={selectedVersion}
              onChange={handleVersionChange}
              className="x:h-8 x:px-3 x:pr-7 x:border x:border-gray-300 x:dark:border-gray-700 x:rounded-md x:text-sm x:cursor-pointer x:text-gray-900 x:dark:text-gray-100"
              style={{
                backgroundColor: isDark ? 'rgb(31 41 55)' : 'white'
              }}
            >
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
            {isSwitchingVersion && (
              <div 
                className="x:inline-block x:animate-spin" 
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid',
                  borderColor: isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)',
                  borderTopColor: isDark ? 'rgb(79 70 229)' : 'rgb(99 102 241)',
                  borderRadius: '50%'
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Methods by Package */}
      <div 
        className="x:flex x:flex-col x:gap-12"
        style={{
          opacity: isSwitchingVersion ? 0.5 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        {spec &&
          Object.entries(getMethodsByPackage(spec))
            .filter(
              ([pkg, methods]) =>
                pkg
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                methods.some((method) =>
                  method.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
            )
            .map(([pkg, methods]) => {
              const filteredMethods = pkg
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
                ? methods
                : methods.filter((method) =>
                    method.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );

              return (
                <div key={pkg} className="x:border-b x:border-gray-200 x:dark:border-gray-800 x:pb-8">
                  <h2 
                    id={pkg}
                    className="x:tracking-tight x:text-slate-900 x:dark:text-slate-100 x:font-semibold x:target:animate-[fade-in_1.5s] x:mt-10 x:border-b x:pb-1 x:text-3xl nextra-border"
                  >
                    {pkg == 'p2p' ? 'P2P' : pkg}
                    <a 
                      href={`#${pkg}`} 
                      className="x:focus-visible:nextra-focus subheading-anchor" 
                      aria-label={`Permalink for ${pkg}`}
                    />
                  </h2>
                  
                  <div className="x:flex x:flex-col x:gap-6">
                    {filteredMethods.map((method) => (
                      <div
                        key={`${pkg}.${method.name}`}
                        id={`${pkg}.${method.name}`}
                      >
                        <RPCMethod
                          pkg={pkg}
                          method={method}
                          activateSidebar={activateSidebar}
                          selectedVersion={selectedVersion}
                          setCurrentRequest={setCurrentRequest}
                          setPlaygroundOpen={setPlaygroundOpen}
                          isDark={isDark}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
      </div>

      <ParamModal
        open={open}
        setOpen={setOpen}
        currentParam={currentParam}
      />
      <Playground
        playgroundOpen={playgroundOpen}
        setPlaygroundOpen={setPlaygroundOpen}
        currentRequest={currentRequest}
        setCurrentRequest={setCurrentRequest}
        setNotification={setNotification}
      />
      <NotificationModal
        notification={notification}
        setNotification={setNotification}
      />
    </>
  );
}
