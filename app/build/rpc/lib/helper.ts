import { Method, Param } from './types';

export function extractAuth(methodDescription: string | undefined): string {
  // Newer specs append authentication instructions after the permission name.
  return methodDescription?.match(/\bAuth level:[ \t]*(public|read|write|admin)(?=[.\s]|$)/)?.[1] || '';
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
