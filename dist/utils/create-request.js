var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { DEFAULT_BACKOFF_FACTOR, DEFAULT_JITTER_FACTOR, DEFAULT_MAX_TIMEOUT, isAbortControllerSupported, isReadableStreamSupported, isWriteableStreamSupported, isWebRTCSupported, isWebsocketSupported, isNode, } from "./constant.js";
import { appendParams } from "./append-params.js";
import { createHTTPError } from "./create-http-error.js";
import { defaultBackoff, defaultJitter } from "./default-retries.js";
export const createRequest = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (url = "", options = {}, data, { baseUrl, hooks, DEBUG } = Object.create(null)) {
    var _a;
    const { method = "GET", retries = 0, backoff = defaultBackoff, jitter = false, jitterFactor = DEFAULT_JITTER_FACTOR, backoffFactor = DEFAULT_BACKOFF_FACTOR, timeout = DEFAULT_MAX_TIMEOUT, retryOnTimeout = false, params, headers = {}, signal } = options, otherOptions = __rest(options, ["method", "retries", "backoff", "jitter", "jitterFactor", "backoffFactor", "timeout", "retryOnTimeout", "params", "headers", "signal"]);
    try {
        // Execute pre-request hook
        if (hooks === null || hooks === void 0 ? void 0 : hooks.preRequest) {
            hooks.preRequest(url, options);
        }
        const fullUrl = `${baseUrl}${url}`;
        const reqHeaders = new Headers(headers);
        // Automatically detect and add Content-Length based on payload length
        const textEncoder = new TextEncoder();
        if (!reqHeaders.get("Content-Length") && data) {
            if (typeof data === "string") {
                reqHeaders.set("Content-Length", String(textEncoder.encode(data).length));
            }
            else if ((_a = reqHeaders.get("Content-Length")) === null || _a === void 0 ? void 0 : _a.includes("application/json")) {
                reqHeaders.set("Content-Length", String(textEncoder.encode(JSON.stringify(data)).length));
            }
        }
        // Set default Content-Type to application/json if not provided
        if (!reqHeaders.get("Content-Type") && data && typeof data === "object") {
            if (!(((data === null || data === void 0 ? void 0 : data.body) || data) instanceof FormData)) {
                reqHeaders.set("Content-Type", "application/json");
            }
        }
        // Execute pre-timeout hook
        if (hooks === null || hooks === void 0 ? void 0 : hooks.preTimeout) {
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
        const timeoutId = timeout && isAbortControllerSupported
            ? setTimeout(() => {
                globalThis.abortController.abort();
                // Execute post-timeout hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.postTimeout) {
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
        const requestBody = options.body instanceof FormData
            ? options.body
            : data
                ? JSON.stringify(data)
                : undefined;
        const requestOptions = Object.assign(Object.assign({ method, signal: isAbortControllerSupported ? globalThis.abortSignal : null, headers: reqHeaders }, otherOptions), { body: requestBody });
        if (requestBody instanceof FormData) {
            requestOptions.headers.delete("Content-Type");
        }
        const responsePromise = fetch(urlWithParams, requestOptions);
        clearTimeout(timeoutId);
        const response = yield responsePromise;
        const contentType = response.headers.get("content-type");
        const responseData = contentType && contentType.includes("application/json")
            ? yield response.json()
            : yield response.text();
        if (!response.ok) {
            throw createHTTPError(response, responseData);
        }
        // Execute post-request hook
        if (hooks === null || hooks === void 0 ? void 0 : hooks.postRequest) {
            hooks.postRequest(url, options, data, [null, responseData]);
        }
        return [null, responseData];
    }
    catch (error) {
        // Execute post-request hook for errors
        if (hooks === null || hooks === void 0 ? void 0 : hooks.postRequest) {
            if (error instanceof Error) {
                hooks.postRequest(url, options, data, [error, null]);
            }
        }
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                console.error("Request aborted:", error);
            }
            else if (retryOnTimeout &&
                error.name === "TimeoutError" &&
                retries &&
                retries > 0) {
                const delay = jitter && jitterFactor
                    ? defaultJitter(jitterFactor)
                    : defaultBackoff(retries, backoffFactor ? backoffFactor : DEFAULT_BACKOFF_FACTOR);
                if (DEBUG) {
                    console.warn(`Request timed out. Retrying in ${delay}ms... (Remaining retries: ${retries})`);
                }
                // Execute pre-retry hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.preRetry) {
                    hooks.preRetry(url, options, retries, retries);
                }
                yield new Promise((resolve) => setTimeout(resolve, delay));
                const [retryErr, retryData] = yield createRequest(url, Object.assign(Object.assign({}, options), { retries: retries - 1 }), data);
                // Execute post-retry hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.postRetry) {
                    hooks.postRetry(url, options, data, [retryErr, retryData], retries, retries - 1);
                }
                return [retryErr, retryData];
            }
            else if (options.retries && options.retries > 0) {
                const delay = options.jitter && options.jitterFactor
                    ? defaultJitter(options.jitterFactor)
                    : defaultBackoff(options.retries, options.backoffFactor
                        ? options.backoffFactor
                        : DEFAULT_BACKOFF_FACTOR);
                if (DEBUG) {
                    console.warn(`Request failed. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`);
                }
                // Execute pre-retry hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.preRetry) {
                    hooks.preRetry(url, options, options.retries, options.retries);
                }
                yield new Promise((resolve) => setTimeout(resolve, delay));
                const [retryErr, retryData] = yield createRequest(url, Object.assign(Object.assign({}, options), { retries: options.retries - 1 }), data);
                // Execute post-retry hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.postRetry) {
                    hooks.postRetry(url, options, data, [retryErr, retryData], options.retries, options.retries - 1);
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
//# sourceMappingURL=create-request.js.map