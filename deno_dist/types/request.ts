import type { InitOptions } from "./init.js/index.ts";

export type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS";

export interface RequestOptions extends RequestInit {
  method?: RequestMethod | string;
  retries?: number; // New attribute for retry attempts
  backoff?: (retryCount: number, factor: number) => number; // Custom backoff strategy with factor
  jitter?: boolean; // Option to use jitter instead of backoff
  jitterFactor?: number; // Custom jitter factor (default: 1)
  backoffFactor?: number; // Custom backoff factor (default: 0.3)
  timeout?: number; // Timeout in milliseconds
  retryOnTimeout?: boolean; // New option to retry on timeout errors
  params?: Record<string, string | number>; // URLSearchParams option
}

export type RequestFunction = (
  url?: string,
  options?: RequestOptions,
  data?: unknown,
  wrapper?: InitOptions
) => Promise<[Error | null, null]>;

export type HttpMethodFunction = (
  url: string,
  options: RequestOptions | undefined
) => RequestFunction;

export interface HttpRequestFunctions {
  get<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  post<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  put<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  delete<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  patch<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  options<T = any>(
    url: string,
    options?: RequestOptions,
    data?: unknown
  ): Promise<[Error | null, T | null]>;
  getAbortController(): AbortController | null;
}
