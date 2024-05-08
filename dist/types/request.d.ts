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
export type HttpMethodFunction = (url: string, options: RequestOptions | undefined) => RequestFunction;
export interface HttpRequestFunctions {
    get<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    post<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    put<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    delete<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    patch<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    options<T>(url: string, options?: RequestOptions, data?: unknown): Promise<[Error | unknown | null, T | unknown | null]>;
    getAbortController(): AbortController;
}
//# sourceMappingURL=request.d.ts.map