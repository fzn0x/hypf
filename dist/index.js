// src/index.ts
import { getAbortController } from "./utils/get-abort-controller.js";
import { httpMethodFunction } from "./utils/create-http-method.js";
function init(baseUrl, hooks, DEBUG = false) {
  if (typeof fetch === "undefined") {
    throw new Error(
      "This library is intended for use in the browser environment only."
    );
  }
  const initOptions = {
    baseUrl,
    hooks,
    DEBUG
  };
  return {
    get: (url, options, data) => httpMethodFunction(url, "GET", options, data, initOptions),
    post: (url, options, data) => httpMethodFunction(url, "POST", options, data, initOptions),
    put: (url, options, data) => httpMethodFunction(url, "PUT", options, data, initOptions),
    delete: (url, options, data) => httpMethodFunction(url, "DELETE", options, data, initOptions),
    patch: (url, options, data) => httpMethodFunction(url, "PATCH", options, data, initOptions),
    options: (url, options, data) => httpMethodFunction(url, "OPTIONS", options, data, initOptions),
    getAbortController
  };
}
var src_default = { init };
export {
  src_default as default
};
