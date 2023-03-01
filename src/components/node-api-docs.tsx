import {useState} from 'react';
import React from 'react'
import {spec} from '@site/src/components/node-spec'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {ChevronRightIcon, ChevronDownIcon} from "@heroicons/react/24/solid"

// this works to style some of the intended areas in the component if using .tailwind-layout { ... } in tailwind.css
import styles from "../css/tailwind.css"

// the hook currently doesn't work
// import useTailwindLayout from './tailwind-hook.js';

// using the styles from custom css file applies tailwind to entire site
// import styles from "../css/custom.css"

type Param = {
  name: string;
  description: string;
  schema: any;
};

type Method = {
  name: string;
  description: string;
  auth: string;
  params: Param[];
  result: Param;
};

type MethodByPkg = { [key: string]: Method[] };

function extractAuth(methodDescription: string): string {
  return methodDescription.split('Auth level: ')[1];
}

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

export default function Hello() {
  // useTailwindLayout();
  return (
      // <div>
      <div className={styles}>
        {Object.entries(getMethodsByPackage(spec)).map(
            ([pkg, methods]) => (
              <div key={pkg} className='tw-pb-6' id={pkg}>
                <h3 className='tw-text-2xl tw-font-bold tw-uppercase'>
                  {pkg}
                </h3>
                {methods.map((method) =>
                  RPCMethod(pkg, method)
                )}
      </div>
    )
  )}
      </div>
  );
}

const RPCMethod = (pkg: string, method: Method) => {
  const [showRequest, setShowRequest] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  return (
    <div key={method.name} className='tw-py-2'>
      <p className='tw-text-md'>
        {method.name}(
        {method.params.map((param, i, { length }) => (
          <span key={param.name} className='tw-text-sm tw-text-gray-700'>
            <span>{param.name}</span>{' '}
            <span className='tw-text-blue-500 hover:tw-font-bold'>
              {param.description}
              {length - 1 != i && ', '}
            </span>
          </span>
        ))}
        )
        {method.result.description != 'Null' && (
          <span className='tw-ml-2 tw-text-sm tw-text-blue-500 hover:tw-font-bold'>
            {method.result.description}
          </span>
        )}
        <span className='tw-ml-2 tw-inline-flex tw-items-center tw-rounded-full tw-bg-purple-100 tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-medium tw-text-purple-800'>
          perms: {method.auth}
        </span>
      </p>
      <p className='tw-text-sm tw-font-light tw-text-gray-700 dark:tw-text-gray-400'>{method.description}</p>
      <div className='tw-mt-6 tw-overflow-hidden tw-rounded-lg tw-bg-gray-200 dark:tw-bg-gray-800 tw-text-sm tw-shadow'>
        <div
          className='tw-flex tw-px-4 tw-py-5 hover:tw-cursor-pointer hover:tw-bg-purple-200 dark:hover:tw-bg-gray-900 sm:tw-px-6'
          onClick={() => setShowRequest(!showRequest)}
        >
          {showRequest ? (
            <ChevronDownIcon className='tw-mr-2 tw-h-5 tw-w-5' aria-hidden='true' />
          ) : (
            <ChevronRightIcon className='tw-mr-2 tw-h-5 tw-w-5' aria-hidden='true' />
          )}
          Request
        </div>
        {showRequest && (
          <div className='tw-bg-gray-50 dark:tw-bg-gray-900 tw-px-4 tw-py-5 tw-text-sm sm:tw-p-6'>
            <SyntaxHighlighter
              language='json'
              // customStyle={{
              //   backgroundColor: 'black',
              //   color: 'white',
              // }}
            >
            {JSON.stringify(
              {
                id: 1,
                jsonrpc: '2.0',
                method: pkg + '.' + method.name,
                params: method.params.map((param) => param.schema.examples[0]),
              },
              null,
              2
            )}
            </SyntaxHighlighter>
          </div>
        )}
        <div
          className='tw-flex tw-px-4 tw-py-5 hover:tw-cursor-pointer hover:tw-bg-purple-200 dark:hover:tw-bg-gray-900 sm:tw-px-6'
          onClick={() => setShowResponse(!showResponse)}
        >
          {showResponse ? (
            <ChevronDownIcon className='tw-mr-2 tw-h-5 tw-w-5' aria-hidden='true' />
          ) : (
            <ChevronRightIcon className='tw-mr-2 tw-h-5 tw-w-5' aria-hidden='true' />
          )}{' '}
          Response
        </div>
        {showResponse && (
          <div className='tw-bg-gray-50 dark:tw-bg-gray-900 tw-px-4 tw-py-5 tw-text-sm sm:tw-p-6'>
            <SyntaxHighlighter
              language='json'
              // customStyle={{
              //   backgroundColor: 'black',
              //   color: 'white',
              // }}
            >
            {JSON.stringify(
              {
                id: 1,
                jsonrpc: '2.0',
                result:
                  method.result.description == 'Null'
                    ? []
                    : [method.result.schema.examples[0]],
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