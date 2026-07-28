'use client';

import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

import { INotification, MethodByPkg, OpenRPCSpec, Param } from '../lib/types';

import NotificationModal from '../components/NotificationModal';
import Playground from '../components/Playground';
import RPCMethod from '../components/RPCMethod';
import ParamModal from '../components/ParamModal';
import './rpc-api.css';

// Get base path for asset references
const basePath = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

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
      rawSpec: method, // Pass the full raw spec for copying
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
  'v0.31.3',
].reverse();

export default function RPCDocumentation() {
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

  useEffect(() => {
    // Read URL params on mount (client-only, avoids SSR hydration mismatch).
    const versionParam = new URLSearchParams(window.location.search).get('version');
    const targetVersion = versionParam && versions.includes(versionParam) ? versionParam : versions[0];

    if (targetVersion !== selectedVersion) {
      setSelectedVersion(targetVersion);
    }
    fetchJsonData(targetVersion, true);
  }, []);

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
    fetchJsonData(newVersion, false);
  };

  const activateSidebar = (param: Param) => {
    setOpen(true);
    setCurrentParam(param);
  };

  // Show loading state only on initial page load
  if (isInitialLoading) {
    return (
      <div className="rpc-api__loading">
        <div>
          <div>Loading API documentation...</div>
          <div>
            Version: {selectedVersion}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="rpc-api__error">
        <h3>
          Error Loading Documentation
        </h3>
        <p>
          {error}
        </p>
        <button
          onClick={() => fetchJsonData(selectedVersion)}
          className="rpc-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure spec is not null before rendering
  if (!spec) return null;

  return (
    <div className="rpc-api">
      {/* Description and Controls */}
      <div>
        {spec && (
          <div className="rpc-api__intro">
            Showing the OpenRPC schema for{' '}
            <a
              href={`https://github.com/celestiaorg/celestia-node/releases/tag/${spec.info.version}`}
              target='_blank'
              rel='noopener noreferrer'
              className="rpc-api__link"
            >
              celestia-node {spec.info.version}
            </a>
            .
          </div>
        )}
        
        {/* Search and Version Picker - Search fills space, Version floats right */}
        <div className="rpc-api__controls">
          <input
            type='text'
            placeholder='Search modules & methods...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rpc-api__search"
          />
          
          <div className="rpc-api__version">
            <span className="rpc-api__version-label">API version:</span>
            <select
              value={selectedVersion}
              onChange={handleVersionChange}
              className="rpc-api__select"
            >
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
            {isSwitchingVersion && (
              <div className="rpc-api__spinner" />
            )}
          </div>
        </div>
      </div>

      {/* Methods by Package */}
      <div 
        className="rpc-api__packages"
        style={{
          opacity: isSwitchingVersion ? 0.5 : 1,
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
                <section key={pkg} className="rpc-package">
                  <h2
                    id={pkg}
                    className="rpc-package__title"
                  >
                    {pkg == 'p2p' ? 'P2P' : pkg}
                    <a
                      href={`#${pkg}`}
                      className="rpc-package__anchor"
                      aria-label={`Permalink for ${pkg}`}
                    >
                      #
                    </a>
                  </h2>

                  <div className="rpc-package__methods">
                    {filteredMethods.map((method) => (
                      <RPCMethod
                        key={`${pkg}.${method.name}`}
                        pkg={pkg}
                        method={method}
                        activateSidebar={activateSidebar}
                        selectedVersion={selectedVersion}
                        setCurrentRequest={setCurrentRequest}
                        setPlaygroundOpen={setPlaygroundOpen}
                      />
                    ))}
                  </div>
                </section>
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
    </div>
  );
}
