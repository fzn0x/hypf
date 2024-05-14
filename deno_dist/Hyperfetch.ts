import type {
  HttpRequestFunctions,
  RequestFunction,
  RequestOptions,
  HttpMethodFunction,
} from "./types/request.ts/index.ts";
import type { Hooks } from "./types/hooks.ts/index.ts";

import {
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_JITTER_FACTOR,
  DEFAULT_MAX_TIMEOUT,
  isAbortControllerSupported,
  isReadableStreamSupported,
  isWriteableStreamSupported,
  isWebRTCSupported,
  isWebsocketSupported,
  isNode,
} from "./constant.ts";

import { appendParams } from "./utils/append-params.ts";
import { createHTTPError } from "./utils/create-http-error.ts";

const defaultBackoff = (retryCount: number, factor: number) =>
  Math.pow(2, retryCount) * 1000 * factor; // Exponential backoff, starting from 1 second

const defaultJitter = (factor: number) => Math.random() * 1000 * factor; // Randomized delay up to 1 second

// Expose the AbortController instance through the library interface
const getAbortController = () =>
  isAbortControllerSupported ? globalThis.abortController : null;

function createRequest(
  baseUrl?: string,
  hooks?: Hooks,
  DEBUG = false
): HttpRequestFunctions {
  // Check if fetch is available (browser environment)
  if (typeof fetch === "undefined") {
    throw new Error(
      "This library is intended for use in the browser environment only."
    );
  }

  const request: RequestFunction = async (
    url = "",
    options = {},
    data
  ): Promise<[Error | null, null]> => {
    const {
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
      signal,
      ...otherOptions
    } = options;

    try {
      // Execute pre-request hook
      if (hooks?.preRequest) {
        hooks.preRequest(url, options);
      }

      const fullUrl = `${baseUrl}${url}`;

      const reqHeaders = new Headers(headers);

      // Automatically detect and add Content-Length based on payload length
      const textEncoder = new TextEncoder();
      if (!reqHeaders.get("Content-Length") && data) {
        if (typeof data === "string") {
          reqHeaders.set(
            "Content-Length",
            String(textEncoder.encode(data).length)
          );
        } else if (
          reqHeaders.get("Content-Length")?.includes("application/json")
        ) {
          reqHeaders.set(
            "Content-Length",
            String(textEncoder.encode(JSON.stringify(data)).length)
          );
        }
      }

      // Set default Content-Type to application/json if not provided
      if (!reqHeaders.get("Content-Type") && data && typeof data === "object") {
        if (
          !(((data as { body: FormData })?.body || data) instanceof FormData)
        ) {
          reqHeaders.set("Content-Type", "application/json");
        }
      }

      // Execute pre-timeout hook
      if (hooks?.preTimeout) {
        hooks.preTimeout(url, options);
      }

      if (isAbortControllerSupported) {
        // Expose the AbortController instance
        globalThis.abortController = new AbortController();

        // Use the external AbortController instance
        globalThis.abortSignal = signal
          ? signal
          : globalThis.abortController.signal;
      }

      const timeoutId =
        timeout && isAbortControllerSupported
          ? setTimeout(() => {
              globalThis.abortController.abort();

              // Execute post-timeout hook
              if (hooks?.postTimeout) {
                hooks.postTimeout(url, options);
              }
            }, timeout)
          : undefined;

      // Append params to the URL
      const urlWithParams = params ? appendParams(fullUrl, params) : fullUrl;

      if (isReadableStreamSupported && !isWriteableStreamSupported && isNode) {
        // @ts-expect-error
        otherOptions.duplex = "half";
      }
      if (!isReadableStreamSupported && isWriteableStreamSupported && isNode) {
        // @ts-expect-error
        otherOptions.duplex = "half";
      }
      if (isReadableStreamSupported && isWriteableStreamSupported && isNode) {
        // @ts-expect-error
        otherOptions.duplex = "half";
      }
      // WebRTC is supported, allowing for full duplex communication.
      if (isWebRTCSupported && isNode) {
        // @ts-expect-error
        otherOptions.duplex = "half";
      }
      // WebSockets are supported, and thus full duplex communication is possible.
      if (isWebsocketSupported && isNode) {
        // @ts-expect-error
        otherOptions.duplex = "half";
      }

      const requestBody =
        options.body instanceof FormData
          ? options.body
          : data
          ? JSON.stringify(data)
          : undefined;

      const requestOptions = {
        method,
        signal: isAbortControllerSupported ? globalThis.abortSignal : null,
        headers: reqHeaders,
        ...otherOptions,
        body: requestBody,
      };

      if (requestBody instanceof FormData) {
        requestOptions.headers.delete("Content-Type");
      }

      const responsePromise = fetch(urlWithParams, requestOptions);

      clearTimeout(timeoutId);

      const response = await responsePromise;

      const contentType = response.headers.get("content-type");

      const responseData =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw createHTTPError(response, responseData);
      }

      // Execute post-request hook
      if (hooks?.postRequest) {
        hooks.postRequest(url, options, data, [null, responseData]);
      }

      return [null, responseData];
    } catch (error) {
      // Execute post-request hook for errors
      if (hooks?.postRequest) {
        if (error instanceof Error) {
          hooks.postRequest(url, options, data, [error, null]);
        }
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error("Request aborted:", error);
        } else if (
          retryOnTimeout &&
          error.name === "TimeoutError" &&
          retries &&
          retries > 0
        ) {
          const delay =
            jitter && jitterFactor
              ? defaultJitter(jitterFactor)
              : defaultBackoff(
                  retries,
                  backoffFactor ? backoffFactor : DEFAULT_BACKOFF_FACTOR
                );
          if (DEBUG) {
            console.warn(
              `Request timed out. Retrying in ${delay}ms... (Remaining retries: ${retries})`
            );
          }
          // Execute pre-retry hook
          if (hooks?.preRetry) {
            hooks.preRetry(url, options, retries, retries);
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
          const [retryErr, retryData] = await request(
            url,
            { ...options, retries: retries - 1 },
            data
          );
          // Execute post-retry hook
          if (hooks?.postRetry) {
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
          const delay =
            options.jitter && options.jitterFactor
              ? defaultJitter(options.jitterFactor)
              : defaultBackoff(
                  options.retries,
                  options.backoffFactor
                    ? options.backoffFactor
                    : DEFAULT_BACKOFF_FACTOR
                );
          if (DEBUG) {
            console.warn(
              `Request failed. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`
            );
          }
          // Execute pre-retry hook
          if (hooks?.preRetry) {
            hooks.preRetry(url, options, options.retries, options.retries);
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
          const [retryErr, retryData] = await request(
            url,
            { ...options, retries: options.retries - 1 },
            data
          );
          // Execute post-retry hook
          if (hooks?.postRetry) {
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
  };

  const httpMethodFunction: HttpMethodFunction =
    (url: string, options: RequestOptions = {}) =>
    (method = "GET", additionalOptions = {}, data) => {
      return request(url, { method, ...options, ...additionalOptions }, data);
    };

  return {
    get: (url, options, data) =>
      httpMethodFunction(url, options)("GET", options, data),
    post: (url, options, data) =>
      httpMethodFunction(url, options)("POST", options, data),
    put: (url, options, data) =>
      httpMethodFunction(url, options)("PUT", options, data),
    delete: (url, options, data) =>
      httpMethodFunction(url, options)("DELETE", options, data),
    patch: (url, options, data) =>
      httpMethodFunction(url, options)("PATCH", options, data),
    options: (url, options, data) =>
      httpMethodFunction(url, options)("OPTIONS", options, data),
    getAbortController,
  };
}

export default { createRequest };
