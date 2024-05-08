export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
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
export type RequestFunction = (url?: string, options?: RequestOptions, data?: unknown) => Promise<[Error | null | unknown, unknown | null]>;
export type HttpMethodFunction = (url?: string, options?: RequestOptions) => RequestFunction;
export interface HttpRequestFunctions {
    get: RequestFunction;
    post: RequestFunction;
    put: RequestFunction;
    delete: RequestFunction;
    patch: RequestFunction;
    options: RequestFunction;
    getAbortController(): AbortController;
}
//# sourceMappingURL=request.d.ts.map