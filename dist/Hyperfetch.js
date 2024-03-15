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
// Default maximum recommended timeout in milliseconds (adjust as needed)
const DEFAULT_MAX_TIMEOUT = 2147483647;
const DEFAULT_BACKOFF_FACTOR = 0.3;
const DEFAULT_JITTER_FACTOR = 1;
function appendParams(url, params) {
    if (!params)
        return url;
    const urlWithParams = new URL(url);
    Object.entries(params).forEach(([key, value]) => urlWithParams.searchParams.append(key, String(value)));
    return urlWithParams.toString();
}
function createRequest(baseUrl, hooks, DEBUG = false) {
    // Check if fetch is available (browser environment)
    if (typeof fetch === 'undefined') {
        throw new Error('This library is intended for use in the browser environment only.');
    }
    const defaultBackoff = (retryCount, factor) => Math.pow(2, retryCount) * 1000 * factor; // Exponential backoff, starting from 1 second
    const defaultJitter = (factor) => Math.random() * 1000 * factor; // Randomized delay up to 1 second
    // Expose the AbortController instance
    const abortController = new AbortController();
    const request = (...args_1) => __awaiter(this, [...args_1], void 0, function* (url = '', options = {}, data) {
        var _a;
        try {
            // Execute pre-request hook
            if (hooks === null || hooks === void 0 ? void 0 : hooks.preRequest) {
                hooks.preRequest(url, options);
            }
            const fullUrl = `${baseUrl}${url}`;
            const { method = 'GET', retries = 0, backoff = defaultBackoff, jitter = false, jitterFactor = DEFAULT_JITTER_FACTOR, backoffFactor = DEFAULT_BACKOFF_FACTOR, timeout = DEFAULT_MAX_TIMEOUT, retryOnTimeout = false, params, headers = {}, signal } = options, otherOptions = __rest(options, ["method", "retries", "backoff", "jitter", "jitterFactor", "backoffFactor", "timeout", "retryOnTimeout", "params", "headers", "signal"]);
            const reqHeaders = new Headers(options.headers);
            // Set default Content-Type to application/json if not provided
            if (!reqHeaders.get('Content-Type') && data && typeof data === 'object') {
                reqHeaders.set('Content-Type', 'application/json');
            }
            // Automatically detect and add Content-Length based on payload length
            const textEncoder = new TextEncoder();
            if (!reqHeaders.get('Content-Length') && data) {
                if (typeof data === 'string') {
                    reqHeaders.set('Content-Length', String(textEncoder.encode(data).length));
                }
                else if ((_a = reqHeaders.get('Content-Length')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) {
                    reqHeaders.set('Content-Length', String(textEncoder.encode(JSON.stringify(data)).length));
                }
            }
            // Use the external AbortController instance
            const controller = signal ? signal : abortController.signal;
            // Execute pre-timeout hook
            if (hooks === null || hooks === void 0 ? void 0 : hooks.preTimeout) {
                hooks.preTimeout(url, options);
            }
            const timeoutId = timeout ? setTimeout(() => {
                abortController.abort();
                // Execute post-timeout hook
                if (hooks === null || hooks === void 0 ? void 0 : hooks.postTimeout) {
                    hooks.postTimeout(url, options);
                }
            }, timeout) : undefined;
            // Append params to the URL
            const urlWithParams = params ? appendParams(fullUrl, params) : fullUrl;
            const responsePromise = fetch(urlWithParams, Object.assign(Object.assign({ method, signal: controller, headers }, otherOptions), { body: data ? JSON.stringify(data) : undefined }));
            clearTimeout(timeoutId);
            const response = yield responsePromise;
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            const responseData = contentType && contentType.includes('application/json') ? yield response.json() : yield response.text();
            // Execute post-request hook
            if (hooks === null || hooks === void 0 ? void 0 : hooks.postRequest) {
                hooks.postRequest(url, options, data, [null, responseData]);
            }
            return [null, responseData];
        }
        catch (error) {
            // Execute post-request hook for errors
            if (hooks === null || hooks === void 0 ? void 0 : hooks.postRequest) {
                hooks.postRequest(url, options, data, [error, null]);
            }
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error('Request aborted:', error);
                }
                else if (options.retryOnTimeout && error.name === 'TimeoutError' && options.retries && options.retries > 0) {
                    const delay = options.jitter && options.jitterFactor ? defaultJitter(options.jitterFactor) : defaultBackoff(options.retries, options.backoffFactor ? options.backoffFactor : DEFAULT_BACKOFF_FACTOR);
                    if (DEBUG) {
                        console.warn(`Request timed out. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`);
                    }
                    // Execute pre-retry hook
                    if (hooks === null || hooks === void 0 ? void 0 : hooks.preRetry) {
                        hooks.preRetry(url, options, options.retries, options.retries);
                    }
                    yield new Promise(resolve => setTimeout(resolve, delay));
                    const [retryErr, retryData] = yield request(url, Object.assign(Object.assign({}, options), { retries: options.retries - 1 }), data);
                    // Execute post-retry hook
                    if (hooks === null || hooks === void 0 ? void 0 : hooks.postRetry) {
                        hooks.postRetry(url, options, data, [retryErr, retryData], options.retries, options.retries - 1);
                    }
                    return [retryErr, retryData];
                }
                else if (options.retries && options.retries > 0) {
                    const delay = options.jitter && options.jitterFactor ? defaultJitter(options.jitterFactor) : defaultBackoff(options.retries, options.backoffFactor ? options.backoffFactor : DEFAULT_BACKOFF_FACTOR);
                    if (DEBUG) {
                        console.warn(`Request failed. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`);
                    }
                    // Execute pre-retry hook
                    if (hooks === null || hooks === void 0 ? void 0 : hooks.preRetry) {
                        hooks.preRetry(url, options, options.retries, options.retries);
                    }
                    yield new Promise(resolve => setTimeout(resolve, delay));
                    const [retryErr, retryData] = yield request(url, Object.assign(Object.assign({}, options), { retries: options.retries - 1 }), data);
                    // Execute post-retry hook
                    if (hooks === null || hooks === void 0 ? void 0 : hooks.postRetry) {
                        hooks.postRetry(url, options, data, [retryErr, retryData], options.retries, options.retries - 1);
                    }
                    return [retryErr, retryData];
                }
            }
            return [error, null];
        }
    });
    const httpMethodFunction = (url, options) => (method = 'GET', additionalOptions = {}, data) => {
        return request(url, Object.assign(Object.assign({ method }, options), additionalOptions), data);
    };
    // Expose the AbortController instance through the library interface
    const getAbortController = () => abortController;
    return {
        get: (url, options, data) => httpMethodFunction(url, options)('GET', options, data),
        post: (url, options, data) => httpMethodFunction(url, options)('POST', options, data),
        put: (url, options, data) => httpMethodFunction(url, options)('PUT', options, data),
        delete: (url, options, data) => httpMethodFunction(url, options)('DELETE', options, data),
        patch: (url, options, data) => httpMethodFunction(url, options)('PATCH', options, data),
        options: (url, options, data) => httpMethodFunction(url, options)('OPTIONS', options, data),
        getAbortController,
    };
}
export default { createRequest };
//# sourceMappingURL=Hyperfetch.js.map