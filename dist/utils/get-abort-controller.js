import { isAbortControllerSupported } from "./constant.js";
// Expose the AbortController instance through the library interface
export const getAbortController = () => isAbortControllerSupported ? globalThis.abortController : null;
//# sourceMappingURL=get-abort-controller.js.map