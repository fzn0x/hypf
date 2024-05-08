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
export type RequestFunction = (url?: string, options?: RequestOptions, data?: unknown) => Promise<[Error | null, null]>;
export type HttpMethodFunction = (url: string, options: RequestOptions | undefined) => RequestFunction;
export interface HttpRequestFunctions {
    get<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    post<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    put<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    delete<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    patch<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    options<T = unknown>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | null, T | null]>;
    getAbortController(): AbortController;
}
//# sourceMappingURL=request.d.ts.map