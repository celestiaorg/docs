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
      {/* Version Selector and Description */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            {spec && (
              <>
                <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                  {spec.info.description} Node API uses auth tokens to control access to this API.{' '}
                  <a
                    href='https://docs.celestia.org/how-to-guides/quick-start#get-your-auth-token'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: '#0070f3', textDecoration: 'none' }}
                  >
                    Learn more about setting them up here
                  </a>
                  .{' '}
                  <a
                    href={`https://github.com/celestiaorg/celestia-node/releases/${spec.info.version}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: '#0070f3', textDecoration: 'none' }}
                  >
                    ({spec.info.version})
                  </a>
                </div>
              </>
            )}
          </div>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <span style={{ whiteSpace: 'nowrap' }}>API version:</span>
            <select
              value={selectedVersion}
              onChange={handleVersionChange}
              style={{
                height: '2rem',
                padding: '0 1.75rem 0 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer'
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

        {/* Search */}
        <div>
          <input
            type='text'
            placeholder='Search modules & methods...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          />
        </div>
      </div>

      {/* Methods by Package */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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
                <div key={pkg} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '2rem' }}>
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
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
