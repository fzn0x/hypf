type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

interface RequestOptions extends RequestInit {
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

type RequestFunction<T, U> = (url?: string, options?: RequestOptions, data?: T) => Promise<[Error | null | unknown, U | null]>;

type HttpMethodFunction<T, U> = (url?: string, options?: RequestOptions) => RequestFunction<T, U>;

interface HttpRequestFunctions<T, U> {
  get: RequestFunction<T, U>;
  post: RequestFunction<T, U>;
  put: RequestFunction<T, U>;
  delete: RequestFunction<T, U>;
  patch: RequestFunction<T, U>;
  options: RequestFunction<T, U>;
  getAbortController(): AbortController,
}