import type { InitOptions } from './init.js'
import type { createHTTPMethod } from '../utils/create-http-method.js'
import type { createHTTPError } from '../utils/create-http-error.js'

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export interface RequestOptions extends RequestInit {
  method?: RequestMethod | string
  retries?: number // New attribute for retry attempts
  backoff?: (retryCount: number, factor: number) => number // Custom backoff strategy with factor
  jitter?: boolean // Option to use jitter instead of backoff
  jitterFactor?: number // Custom jitter factor (default: 1)
  backoffFactor?: number // Custom backoff factor (default: 0.3)
  timeout?: number // Timeout in milliseconds
  retryOnTimeout?: boolean // New option to retry on timeout errors
  dryRun?: boolean // New option to skip actual request
  params?: Record<string, string | number> // URLSearchParams option
  proxy?: string
  unix?: string
  initOptions?: InitOptions
}

export type RequestFunction = {
  <T = Request>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: true }; dryRun: true },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError: true }
  ): Promise<Error & (T & Request)>
  <T = Request>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: true }; dryRun: true },
    data?: { [key: string]: unknown }
  ): Promise<Error & (T & Request)>
  <T = Request>(
    url: string,
    options?: RequestOptions & { dryRun: true },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions
  ): Promise<Error & (T & Request)>
  <T = Response>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: true } },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError: true }
  ): Promise<Error & (T & Response)>
  <T = Response>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: true } },
    data?: { [key: string]: unknown }
  ): Promise<Error & (T & Response)>
  <T = Response>(
    url: string,
    options?: RequestOptions,
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError: true }
  ): Promise<Error & (T & Response)>
  <T>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: false } },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError: false }
  ): Promise<[null, T] | [Error | null, unknown]>
  <T>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: false } },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions
  ): Promise<[null, T] | [Error | null, unknown]>
  <T>(
    url: string,
    options?: RequestOptions,
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError: false }
  ): Promise<[null, T] | [Error | null, unknown]>
  <T>(
    url: string,
    options?: RequestOptions & { initOptions?: { throwOnError?: boolean } },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions & { throwOnError?: boolean }
  ): Promise<[null, T] | [Error | null, unknown]>
  <T>(
    url: string,
    options?: RequestOptions & { initOptions?: { throwOnError?: boolean } },
    data?: { [key: string]: unknown },
    initOptions?: InitOptions
  ): Promise<[null, T] | [Error | null, unknown]>
  <T>(
    url: string,
    options?: RequestOptions,
    data?: { [key: string]: unknown } | unknown,
    initOptions?: InitOptions & { throwOnError?: boolean }
  ): Promise<[null, T] | [Error | null, unknown]>
}

export type HttpRequestFunction = {
  <T>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: true } },
    data?: { [key: string]: unknown }
  ): Promise<Error | T>

  <T>(
    url: string,
    options?: RequestOptions & { initOptions: { throwOnError: false } },
    data?: { [key: string]: unknown }
  ): Promise<[Error | null, T | null]>

  <T>(
    url: string,
    options?: RequestOptions & { initOptions?: { throwOnError?: boolean } },
    data?: { [key: string]: unknown }
  ): Promise<[Error | null, T | null]>
}

export interface HttpRequestFunctions {
  get: HttpRequestFunction
  post: HttpRequestFunction
  put: HttpRequestFunction
  delete: HttpRequestFunction
  patch: HttpRequestFunction
  head: HttpRequestFunction
  options: HttpRequestFunction

  createHTTPMethod: typeof createHTTPMethod
  createHTTPError: typeof createHTTPError
  getAbortController(): AbortController | null
}
