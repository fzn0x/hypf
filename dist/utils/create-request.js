var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/utils/create-request.ts
import {
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_JITTER_FACTOR,
  DEFAULT_MAX_TIMEOUT,
  isAbortControllerSupported,
  isReadableStreamSupported,
  isWriteableStreamSupported,
  isWebRTCSupported,
  isWebsocketSupported,
  isNode
} from "./constant.js";
import { appendParams } from "./append-params.js";
import { createHTTPError } from "./create-http-error.js";
import { defaultBackoff, defaultJitter } from "./default-retries.js";
var createRequest = (..._0) => __async(void 0, [..._0], function* (url = "", options = {}, data, { baseUrl, hooks, DEBUG } = /* @__PURE__ */ Object.create(null)) {
  var _b;
  const _a = options, {
    method = "GET",
    retries = 0,
    backoff = defaultBackoff,
    jitter = false,
    jitterFactor = DEFAULT_JITTER_FACTOR,
    backoffFactor = DEFAULT_BACKOFF_FACTOR,
    timeout = DEFAULT_MAX_TIMEOUT,
    retryOnTimeout = false,
    params,
    headers = {},
    signal
  } = _a, otherOptions = __objRest(_a, [
    "method",
    "retries",
    "backoff",
    "jitter",
    "jitterFactor",
    "backoffFactor",
    "timeout",
    "retryOnTimeout",
    "params",
    "headers",
    "signal"
  ]);
  try {
    if (hooks == null ? void 0 : hooks.preRequest) {
      hooks.preRequest(url, options);
    }
    const fullUrl = `${baseUrl}${url}`;
    const reqHeaders = new Headers(headers);
    const textEncoder = new TextEncoder();
    if (!reqHeaders.get("Content-Length") && data) {
      if (typeof data === "string") {
        reqHeaders.set(
          "Content-Length",
          String(textEncoder.encode(data).length)
        );
      } else if ((_b = reqHeaders.get("Content-Length")) == null ? void 0 : _b.includes("application/json")) {
        reqHeaders.set(
          "Content-Length",
          String(textEncoder.encode(JSON.stringify(data)).length)
        );
      }
    }
    if (!reqHeaders.get("Content-Type") && data && typeof data === "object") {
      if (!(((data == null ? void 0 : data.body) || data) instanceof FormData)) {
        reqHeaders.set("Content-Type", "application/json");
      }
    }
    if (hooks == null ? void 0 : hooks.preTimeout) {
      hooks.preTimeout(url, options);
    }
    if (isAbortControllerSupported) {
      globalThis.abortController = new AbortController();
      globalThis.abortSignal = signal ? signal : globalThis.abortController.signal;
    }
    const timeoutId = timeout && isAbortControllerSupported ? setTimeout(() => {
      globalThis.abortController.abort();
      if (hooks == null ? void 0 : hooks.postTimeout) {
        hooks.postTimeout(url, options);
      }
    }, timeout) : void 0;
    const urlWithParams = params ? appendParams(fullUrl, params) : fullUrl;
    if (isReadableStreamSupported && !isWriteableStreamSupported && isNode) {
      otherOptions.duplex = "half";
    }
    if (!isReadableStreamSupported && isWriteableStreamSupported && isNode) {
      otherOptions.duplex = "half";
    }
    if (isReadableStreamSupported && isWriteableStreamSupported && isNode) {
      otherOptions.duplex = "half";
    }
    if (isWebRTCSupported && isNode) {
      otherOptions.duplex = "half";
    }
    if (isWebsocketSupported && isNode) {
      otherOptions.duplex = "half";
    }
    const requestBody = options.body instanceof FormData ? options.body : data ? JSON.stringify(data) : void 0;
    const requestOptions = __spreadProps(__spreadValues({
      method,
      signal: isAbortControllerSupported ? globalThis.abortSignal : null,
      headers: reqHeaders
    }, otherOptions), {
      body: requestBody
    });
    if (requestBody instanceof FormData) {
      requestOptions.headers.delete("Content-Type");
    }
    const responsePromise = fetch(urlWithParams, requestOptions);
    clearTimeout(timeoutId);
    const response = yield responsePromise;
    const contentType = response.headers.get("content-type");
    const responseData = contentType && contentType.includes("application/json") ? yield response.json() : yield response.text();
    if (!response.ok) {
      throw createHTTPError(response, responseData);
    }
    if (hooks == null ? void 0 : hooks.postRequest) {
      hooks.postRequest(url, options, data, [null, responseData]);
    }
    return [null, responseData];
  } catch (error) {
    if (hooks == null ? void 0 : hooks.postRequest) {
      if (error instanceof Error) {
        hooks.postRequest(url, options, data, [error, null]);
      }
    }
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Request aborted:", error);
      } else if (retryOnTimeout && error.name === "TimeoutError" && retries && retries > 0) {
        const delay = jitter && jitterFactor ? defaultJitter(jitterFactor) : defaultBackoff(
          retries,
          backoffFactor ? backoffFactor : DEFAULT_BACKOFF_FACTOR
        );
        if (DEBUG) {
          console.warn(
            `Request timed out. Retrying in ${delay}ms... (Remaining retries: ${retries})`
          );
        }
        if (hooks == null ? void 0 : hooks.preRetry) {
          hooks.preRetry(url, options, retries, retries);
        }
        yield new Promise((resolve) => setTimeout(resolve, delay));
        const [retryErr, retryData] = yield createRequest(
          url,
          __spreadProps(__spreadValues({}, options), { retries: retries - 1 }),
          data
        );
        if (hooks == null ? void 0 : hooks.postRetry) {
          hooks.postRetry(
            url,
            options,
            data,
            [retryErr, retryData],
            retries,
            retries - 1
          );
        }
        return [retryErr, retryData];
      } else if (options.retries && options.retries > 0) {
        const delay = options.jitter && options.jitterFactor ? defaultJitter(options.jitterFactor) : defaultBackoff(
          options.retries,
          options.backoffFactor ? options.backoffFactor : DEFAULT_BACKOFF_FACTOR
        );
        if (DEBUG) {
          console.warn(
            `Request failed. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`
          );
        }
        if (hooks == null ? void 0 : hooks.preRetry) {
          hooks.preRetry(url, options, options.retries, options.retries);
        }
        yield new Promise((resolve) => setTimeout(resolve, delay));
        const [retryErr, retryData] = yield createRequest(
          url,
          __spreadProps(__spreadValues({}, options), { retries: options.retries - 1 }),
          data
        );
        if (hooks == null ? void 0 : hooks.postRetry) {
          hooks.postRetry(
            url,
            options,
            data,
            [retryErr, retryData],
            options.retries,
            options.retries - 1
          );
        }
        return [retryErr, retryData];
      }
    }
    if (error instanceof Error) {
      return [error, null];
    }
    return [null, null];
  }
});
export {
  createRequest
};
