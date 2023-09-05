import React, { useEffect, useState, useRef } from 'react';
import styles from './ApiComponent.module.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function ApiComponent({ openrpcData }) {
  const [modules, setModules] = useState({});
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const version = openrpcData.info.version;
  const description = openrpcData.info.description;
  const headingRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setModules(organizeByModule(openrpcData.methods));
  }, [openrpcData]);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && headingRefs.current[hash]) {
      headingRefs.current[hash].scrollIntoView({ behavior: 'smooth' });
    }
  }, [headingRefs, modules]);

  function organizeByModule(methods) {
    let modules = {};
    methods.forEach(method => {
      let moduleName = method.name.split(".")[0];
      if (!modules[moduleName]) {
        modules[moduleName] = [];
      }
      modules[moduleName].push(method);
    });
    return modules;
  }

  function getRequestExample(method) {
    return JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: method.name,
      params: method.params.map((p) => p.schema.examples[0]),
    }, null, 2);
  }

  function getResponseExample(method) {
    return JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      result: method.result.schema.examples,
    }, null, 2);
  }

  function handleHashClick(e, id) {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + id);
    window.location.hash = id;
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <div className={styles.sidebar} style={{ width: '300px', minWidth: '200px', borderRight: '1px solid #ccc', overflowY: 'auto', position: 'relative' }}>
         <div className="sticky-sidebar">
          <div className="sticky-header" style={{ padding: '1em' }}>
            <h3>API Version: <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${version}`}>{version}</a></h3>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search the API..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '1em',
                  fontSize: '1em',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              {searchTerm && 
                <button 
                  onClick={() => setSearchTerm('')} 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'transparent', 
                    border: 'none', 
                    fontSize: '1.2em', 
                    cursor: 'pointer',
                    paddingTop: '0.8em',
                  }}
                >
                  &#9003;
                </button>
              }
            </div>
          </div>
          <div style={{ padding: '1em' }}>
            <h4>Modules & methods</h4>
            <ul>
            {Object.entries(modules)
                .filter(([moduleName, methods]) => 
                  moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  methods.some(method => method.name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(([moduleName, methods]) => (
                  <li key={moduleName}>
                    <a 
                      href={'#' + moduleName.toLowerCase()}
                      style={currentHash === '#' + moduleName.toLowerCase() ? { fontWeight: 'bold' } : {}}
                      ref={el => headingRefs.current['#' + moduleName.toLowerCase()] = el}
                    >
                      {moduleName}
                    </a>
                    <ul>
                      {moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ? methods.map((method) => (
                        <li key={method.name}>
                          <a 
                            href={'#' + method.name}
                            style={currentHash === '#' + method.name ? { fontWeight: 'bold' } : {}}
                            ref={el => headingRefs.current['#' + method.name] = el}
                          >
                            {method.name.split(".")[1]}
                          </a>
                        </li>
                      )) : methods.filter(method => method.name.toLowerCase().includes(searchTerm.toLowerCase())).map((method) => (
                        <li key={method.name}>
                          <a 
                            href={'#' + method.name}
                            style={currentHash === '#' + method.name ? { fontWeight: 'bold' } : {}}
                            ref={el => headingRefs.current['#' + method.name] = el}
                          >
                            {method.name.split(".")[1]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '1em', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '3em'}}>Celestia Node API</h1>
      <h2 className={styles.hideOnLargeScreens}>API Version: <a href={`https://github.com/celestiaorg/celestia-node/releases/tag/${version}`}>{version}</a></h2>
      <h3 style={{ fontFamily: 'Inter', fontWeight: '500'}}>{description}</h3>
      <p>Always check which network is compatible with the API version you are using in the changelog. You can find the latest releases <a href="https://github.com/celestiaorg/celestia-node/releases">here</a>.</p>
      <hr />
        {/* Loop through the modules */}
        {Object.entries(modules)
          .filter(([moduleName, methods]) => 
            moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            methods.some(method => method.name.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map(([moduleName, methods]) => (
            <div key={moduleName}>
              {/* Larger Heading for Module with anchor link */}
              <h1 
                id={moduleName.toLowerCase()} 
                className={styles.heading}
                onMouseEnter={() => setHoveredHeader(moduleName)}
                onMouseLeave={() => setHoveredHeader(null)}
                style={{ textTransform: 'uppercase' }}
                ref={el => headingRefs.current['#' + moduleName.toLowerCase()] = el}
              >
                {moduleName}
                {hoveredHeader === moduleName && 
                  <a 
                    href={'#' + moduleName.toLowerCase()} 
                    onClick={(e) => handleHashClick(e, moduleName.toLowerCase())}
                    style={{ marginLeft: '10px', textDecoration: 'none' }}
                  >
                    #
                  </a>
                }
              </h1>
              <hr />

              {/* Loop through the methods inside each module */}
              {methods.filter(method => method.name.toLowerCase().includes(searchTerm.toLowerCase())).map((method) => (
            <div key={method.name}>
              {/* Linked Heading for Method */}
              <h2 
                id={method.name}
                className={styles.heading}
                onMouseEnter={() => setHoveredHeader(method.name)}
                onMouseLeave={() => setHoveredHeader(null)}
                ref={el => headingRefs.current['#' + method.name] = el}
              >
                {method.name.split(".")[1]}
                {hoveredHeader === method.name && 
                  <a 
                    href={'#' + method.name} 
                    onClick={(e) => handleHashClick(e, method.name)}
                    style={{ marginLeft: '10px', textDecoration: 'none' }}
                  >
                    #
                  </a>
                }
              </h2>

              {/* Display method signature */}
              <p>{method.summary}</p>
              <div className="signature" style={{ fontSize: '1.2em'}}>
                <div><strong>Method:</strong> <code>{method.name}</code></div>
                <div>
                  <strong>Parameters:</strong>
                  {method.params.length > 0 ? (
                    <ul>
                      {method.params.map((param, index) => (
                        <li key={param.name}>
                          <strong>{param.name}</strong>: <code>{param.description}</code>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span> No parameters for this method.</span>
                  )}
                </div>
                <div>
                  <strong>Returns: </strong> 
                  {Object.keys(modules).includes(method.result.name) ? 
                    <a href={'#' + method.result.name}><code>{method.result.name}</code></a> : 
                    <code>{method.result.name}</code>
                  }
                </div>
                <div><strong>Perms:</strong> <code>{method.description.split(":")[1].trim()}</code></div>
                </div>
                <br />
              {/* Display Request and Response */}
              <div className="request-response">
                <h3>Request</h3>
                <CopyToClipboard text={getRequestExample(method)} onCopy={() => setCopiedText(getRequestExample(method))}>
                  <pre style={{ padding: '10px', borderRadius: '5px', cursor: 'copy' }} title="Click to copy">{getRequestExample(method)}</pre>
                </CopyToClipboard>
                {copiedText === getRequestExample(method) && <span>Copied.</span>}
                <h3>Response</h3>
                <CopyToClipboard text={getResponseExample(method)} onCopy={() => setCopiedText(getResponseExample(method))}>
                  <pre style={{ padding: '10px', borderRadius: '5px', cursor: 'copy' }} title="Click to copy">{getResponseExample(method)}</pre>
                </CopyToClipboard>
                {copiedText === getResponseExample(method) && <span>Copied.</span>}
              </div>
              <br />
            </div>
          ))}
        </div>
      ))}
      {Object.entries(modules)
        .filter(([moduleName, methods]) => 
          moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          methods.some(method => method.name.toLowerCase().includes(searchTerm.toLowerCase()))
          ).length === 0 && <h4>👀 No modules or methods found.</h4>}
          </div>
        </div>
      );
    }
    
    export default ApiComponent;