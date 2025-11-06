'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { INotification, MethodByPkg, Param } from '../lib/types';

import NotificationModal from '../components/NotificationModal';
import Playground from '../components/Playground';
import RPCMethod from '../components/RPCMethod';
import ParamModal from '../components/ParamModal';

function extractAuth(methodDescription: string): string {
  return methodDescription.split('Auth level: ')[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMethodsByPackage(spec: any): MethodByPkg {
  const methodsByPackage: MethodByPkg = {};
  for (const method of spec.methods) {
    const methodName = method.name.split('.');
    const pkg = methodName[0];
    const name = methodName[1];
    if (!methodsByPackage[pkg]) {
      methodsByPackage[pkg] = [
        {
          name: name,
          description: method.summary,
          params: method.params,
          auth: extractAuth(method.description),
          result: method.result,
        },
      ];
    } else {
      methodsByPackage[pkg].push({
        name: name,
        description: method.summary,
        params: method.params,
        auth: extractAuth(method.description),
        result: method.result,
      });
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
].reverse();

export default function RPCDocumentation() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Set initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(event.target.value);
    window.history.pushState({}, '', `?version=${event.target.value}`);
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [spec, setSpec] = useState<any>();
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

  useEffect(() => {
    const fetchJsonData = async (version: string) => {
      try {
        const response = await axios.get(`/specs/openrpc-${version}.json`);
        setSpec(response.data);
        const hash = window.location.hash;
        window.history.replaceState({}, '', `?version=${version}${hash}`);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    if (versionParam && versions.includes(versionParam)) {
      setSelectedVersion(versionParam);
    } else {
      setSelectedVersion(versions[0]);
    }

    fetchJsonData(selectedVersion);
  }, [selectedVersion]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    if (versionParam && versions.includes(versionParam)) {
      setSelectedVersion(versionParam);
    }
  }, []);

  useEffect(() => {
    if (spec) {
      setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const element = document.getElementById(hash);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 1000);
    }
  }, [spec]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activateSidebar = (param: any) => {
    setOpen(true);
    setCurrentParam(param);
  };

  return (
    <>
      {/* Description and Controls */}
      <div className="x:mb-4">
        {spec && (
          <div className="x:text-sm x:text-gray-600 x:dark:text-gray-200 x:mb-8">
            The Celestia Node API is the collection of RPC methods that can be used to interact with the services provided by Celestia Data Availability Nodes. Node API uses auth tokens to control access to this API.{' '}
            <a
              href={`https://node-rpc-docs.celestia.org/?version=${spec.info.version}`}
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
          </div>
        </div>
      </div>

      {/* Methods by Package */}
      <div className="x:flex x:flex-col x:gap-12">
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
