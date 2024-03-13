import type { 
  RequestOptions,
} from "types/request.js";

// Hooks interface
export interface Hooks {
  preRequest?: (url: string, options: RequestOptions) => void;
  postRequest?: <T, U>(url: string, options: RequestOptions, data?: T, response?: [Error | null | unknown, U]) => void;
  preRetry?: (url: string, options: RequestOptions, retryCount: number, retryLeft: number) => void;
  postRetry?: <T, U>(url: string, options: RequestOptions, data?: T, response?: [Error | null | unknown, U], retryCount?: number, retryLeft?: number) => void;
  preTimeout?: (url: string, options: RequestOptions) => void;
  postTimeout?: (url: string, options: RequestOptions) => void;
}