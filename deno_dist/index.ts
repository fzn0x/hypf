import { Hooks } from "./types/hooks.ts";
import type { HttpRequestFunctions } from "./types/request.ts";

import { getAbortController } from "./utils/get-abort-controller.ts";
import { httpMethodFunction } from "./utils/create-http-method.ts";

function init(
  baseUrl?: string,
  hooks?: Hooks,
  DEBUG: boolean = false
): HttpRequestFunctions {
  // Check if fetch is available
  if (typeof fetch === "undefined") {
    throw new Error(
      "This library is intended for use in the browser environment only."
    );
  }

  const initOptions = {
    baseUrl,
    hooks,
    DEBUG,
  };

  return {
    get: (url, options, data) =>
      httpMethodFunction(url, "GET", options, data, initOptions),
    post: (url, options, data) =>
      httpMethodFunction(url, "POST", options, data, initOptions),
    put: (url, options, data) =>
      httpMethodFunction(url, "PUT", options, data, initOptions),
    delete: (url, options, data) =>
      httpMethodFunction(url, "DELETE", options, data, initOptions),
    patch: (url, options, data) =>
      httpMethodFunction(url, "PATCH", options, data, initOptions),
    options: (url, options, data) =>
      httpMethodFunction(url, "OPTIONS", options, data, initOptions),
    getAbortController,
  };
}

export default { init };
