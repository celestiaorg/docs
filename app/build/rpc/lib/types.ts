/**
 * Type definitions for OpenRPC specification and related data structures
 */

export interface Param {
  name: string;
  description?: string;
  summary?: string;
  required?: boolean;
  schema?: {
    type?: string;
    items?: unknown;
    properties?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface RPCMethod {
  name: string;
  summary?: string;
  description?: string;
  params?: Param[];
  result?: Param;
  examples?: unknown[];
  [key: string]: unknown;
}

// Simplified method structure used in components
export interface Method {
  name: string;
  description?: string;
  params: Param[];
  auth: string;
  result: Param;
  rawSpec?: RPCMethod; // Full raw spec for copying
}

export interface OpenRPCSpec {
  openrpc: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  methods: RPCMethod[];
  components?: {
    schemas?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface MethodsByPackage {
  [packageName: string]: Method[];
}

// Legacy interface name for backward compatibility
export type MethodByPkg = MethodsByPackage;

export interface INotification {
  message: string;
  success: boolean;
  active: boolean;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface NodeError {
  code: number;
  message: string;
  data?: unknown;
}
