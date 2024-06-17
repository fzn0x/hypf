import { isAbortControllerSupported } from "./constant.ts";

// Expose the AbortController instance through the library interface
export const getAbortController = () =>
  isAbortControllerSupported ? globalThis.abortController : null;
