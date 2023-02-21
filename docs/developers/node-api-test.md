---
sidebar_label: Node API test
---

# Node API

````mdx-code-block
import React from 'react';
import {useState} from 'react';
import {spec} from '@site/src/components/node-spec'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {ChevronRightIcon, ChevronDownIcon} from "@heroicons/react/24/solid"
import Layout from '@theme/Layout';

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
  return (
    <Layout title="Hello" description="Hello React Page">
      <div className="">
 {Object.entries(getMethodsByPackage(spec)).map(
    ([pkg, methods]) => (
      <div key={pkg} className='pb-6' id={pkg}>
        <h3 className='font-sans text-2xl font-bold uppercase'>
          {pkg}
        </h3>
        {methods.map((method) =>
          RPCMethod(pkg, method)
        )}
      </div>
    )
  )}
      </div>
    </Layout>
  );
}

const RPCMethod = (pkg: string, method: Method) => {
  const [showRequest, setShowRequest] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  return (
    <div key={method.name} className='py-2'>
      <p className='text-md'>
        {method.name}(
        {method.params.map((param, i, { length }) => (
          <span key={param.name} className='text-sm text-gray-700'>
            <span>{param.name}</span>{' '}
            <span className='text-blue-500 hover:cursor-pointer hover:font-bold'>
              {param.description}
              {length - 1 != i && ', '}
            </span>
          </span>
        ))}
        )
        {method.result.description != 'Null' && (
          <span className='ml-2 text-sm text-blue-500 hover:cursor-pointer hover:font-bold'>
            {method.result.description}
          </span>
        )}
        <span className='ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800'>
          perms: {method.auth}
        </span>
      </p>
      <p className='text-sm font-light text-gray-700'>{method.description}</p>
      <div className='mt-6 overflow-hidden rounded-lg bg-white text-sm shadow'>
        <div
          className='flex px-4 py-5 hover:cursor-pointer hover:bg-gray-50 sm:px-6'
          onClick={() => setShowRequest(!showRequest)}
        >
          {showRequest ? (
            <ChevronDownIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          ) : (
            <ChevronRightIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          )}
          Request
        </div>
        {showRequest && (
          <div className='bg-gray-50 px-4 py-5 text-sm sm:p-6'>
            <SyntaxHighlighter
              language='javascript'
              customStyle={{
                backgroundColor: 'transparent',
              }}
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
          className='flex px-4 py-5 hover:cursor-pointer hover:bg-gray-50 sm:px-6'
          onClick={() => setShowResponse(!showResponse)}
        >
          {showResponse ? (
            <ChevronDownIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          ) : (
            <ChevronRightIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          )}{' '}
          Response
        </div>
        {showResponse && (
          <div className='bg-gray-50 px-4 py-5 text-sm sm:p-6'>
            <SyntaxHighlighter
              language='javascript'
              customStyle={{
                backgroundColor: 'transparent',
              }}
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
````
