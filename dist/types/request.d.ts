export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
export interface RequestOptions extends RequestInit {
    method?: RequestMethod | string;
    retries?: number;
    backoff?: (retryCount: number, factor: number) => number;
    jitter?: boolean;
    jitterFactor?: number;
    backoffFactor?: number;
    timeout?: number;
    retryOnTimeout?: boolean;
    params?: Record<string, string | number>;
}
export type RequestFunction<T, U> = (url?: string, options?: RequestOptions, data?: T) => Promise<[Error | null | unknown, U | null]>;
export type HttpMethodFunction<T, U> = (url?: string, options?: RequestOptions) => RequestFunction<T, U>;
export interface HttpRequestFunctions<T, U> {
    get: RequestFunction<T, U>;
    post: RequestFunction<T, U>;
    put: RequestFunction<T, U>;
    delete: RequestFunction<T, U>;
    patch: RequestFunction<T, U>;
    options: RequestFunction<T, U>;
    getAbortController(): AbortController;
}
//# sourceMappingURL=request.d.ts.map