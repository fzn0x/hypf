// src/utils/get-abort-controller.ts
import { isAbortControllerSupported } from "./constant.js";
var getAbortController = () => isAbortControllerSupported ? globalThis.abortController : null;
export {
  getAbortController
};
