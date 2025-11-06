/* eslint-disable @typescript-eslint/no-explicit-any */
export interface INotification {
  message: string;
  success: boolean;
  active: boolean;
}

export interface NodeError {
  code: number;
  message: string;
}

export type Param = {
  name: string;
  description: string;
  schema: any;
};

export type Method = {
  name: string;
  description: string;
  auth: string;
  params: Param[];
  result: Param;
};

export type MethodByPkg = { [key: string]: Method[] };

