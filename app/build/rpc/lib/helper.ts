/* eslint-disable @typescript-eslint/no-explicit-any */
import { Method, Param } from './types';

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const getExampleRequest = (pkg: string, method: Method): string => {
  return JSON.stringify(
    {
      id: 1,
      jsonrpc: '2.0',
      method: pkg + '.' + method.name,
      params: method.params.map((param: Param) => {
        const examples = param.schema?.examples;
        return (Array.isArray(examples) && examples.length > 0) 
          ? examples[0] 
          : undefined;
      }),
    },
    null,
    2
  );
};

export const getExampleResponse = (method: Method): string => {
  return JSON.stringify(
    {
      id: 1,
      jsonrpc: '2.0',
      result: (() => {
        if (method.result.description === 'Null') return [];
        const examples = method.result.schema?.examples;
        return (Array.isArray(examples) && examples.length > 0) 
          ? [examples[0]] 
          : [];
      })(),
    },
    null,
    2
  );
};

