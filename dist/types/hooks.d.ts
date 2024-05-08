import type { RequestOptions } from "./request.ts";
export interface Hooks {
    preRequest?: (url: string, options: RequestOptions) => void;
    postRequest?: <T, U>(url: string, options: RequestOptions, data?: T, response?: [Error | null, U]) => void;
    preRetry?: (url: string, options: RequestOptions, retryCount: number, retryLeft: number) => void;
    postRetry?: <T, U>(url: string, options: RequestOptions, data?: T, response?: [Error | null, U], retryCount?: number, retryLeft?: number) => void;
    preTimeout?: (url: string, options: RequestOptions) => void;
    postTimeout?: (url: string, options: RequestOptions) => void;
}
//# sourceMappingURL=hooks.d.ts.map