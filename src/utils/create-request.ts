import type { InitOptions } from '../types/init.js'
import type { RequestFunction } from '../types/request.js'

import {
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_JITTER_FACTOR,
  DEFAULT_MAX_TIMEOUT,
  isAbortControllerSupported,
  isNode,
  isReadableStreamSupported,
  isWebRTCSupported,
  isWebsocketSupported,
  isWriteableStreamSupported,
} from './constant.js'

import { appendParams } from './append-params.js'
import { createHTTPError } from './create-http-error.js'
import { defaultBackoff, defaultJitter } from './default-retries.js'

/**
 * Creates and sends an HTTP request.
 *
 * @param {string} url - The URL to send the request to.
 * @param {object} options - The options for the request, including method, headers, etc.
 * @param {object} data - The data to be sent with the request.
 * @param {InitOptions} initOptions - Initialization options including baseUrl, hooks, etc.
 *
 * @returns {Promise<[Error | null, any]>} A promise that resolves with an array containing an error (if any) and the response data.
 *
 * @throws {Error} If the request fails and `throwOnError` is true.
 */
export const createRequest: RequestFunction = async (
  url = '',
  options = {
    backoff: defaultBackoff,
    jitter: false,
    jitterFactor: DEFAULT_JITTER_FACTOR,
    backoffFactor: DEFAULT_BACKOFF_FACTOR,
    timeout: DEFAULT_MAX_TIMEOUT,
    method: 'GET',
    retries: 0,
    retryOnTimeout: false,
    headers: {},
  },
  data,
  { baseUrl, hooks, debug, throwOnError }: InitOptions = Object.create(null)
) => {
  try {
    // Execute pre-request hook
    if (hooks?.preRequest) {
      hooks.preRequest(url, options)
    }

    // Execute pre-timeout hook
    if (hooks?.preTimeout) {
      hooks.preTimeout(url, options)
    }

    const {
      method = 'GET',
      timeout = DEFAULT_MAX_TIMEOUT,
      params,
      headers = {},
      signal,
      ...otherOptions
    } = options

    const fullUrl = `${baseUrl}${url}`

    const reqHeaders = new Headers(headers)

    // Automatically detect and add Content-Length based on payload length
    const textEncoder = new TextEncoder()
    if (!reqHeaders.get('Content-Length') && data) {
      if (typeof data === 'string') {
        reqHeaders.set('Content-Length', String(textEncoder.encode(data).length))
      } else if (reqHeaders.get('Content-Length')?.includes('application/json')) {
        reqHeaders.set('Content-Length', String(textEncoder.encode(JSON.stringify(data)).length))
      }
    }

    // Set default Content-Type to application/json if not provided
    if (!reqHeaders.get('Content-Type') && data && typeof data === 'object') {
      if (!(((data as { body: FormData })?.body || data) instanceof FormData)) {
        reqHeaders.set('Content-Type', 'application/json')
      }
    }

    if (isAbortControllerSupported) {
      // Expose the AbortController instance
      global.abortController = new AbortController()

      // Use the external AbortController instance
      global.abortSignal = signal ? signal : global.abortController.signal
    }

    // Append params to the URL
    const urlWithParams = params ? appendParams(fullUrl, params) : fullUrl

    if (isReadableStreamSupported && !isWriteableStreamSupported && isNode) {
      // @ts-expect-error - Duplex types is not supported
      otherOptions.duplex = 'half'
    }
    if (!isReadableStreamSupported && isWriteableStreamSupported && isNode) {
      // @ts-expect-error - Duplex types is not supported
      otherOptions.duplex = 'half'
    }
    if (isReadableStreamSupported && isWriteableStreamSupported && isNode) {
      // @ts-expect-error - Duplex types is not supported
      otherOptions.duplex = 'half'
    }
    // WebRTC is supported, allowing for full duplex communication.
    if (isWebRTCSupported && isNode) {
      // @ts-expect-error - Duplex types is not supported
      otherOptions.duplex = 'half'
    }
    // WebSockets are supported, and thus full duplex communication is possible.
    if (isWebsocketSupported && isNode) {
      // @ts-expect-error - Duplex types is not supported
      otherOptions.duplex = 'half'
    }

    const requestBody =
      options.body instanceof FormData
        ? options.body
        : Object.keys(data as { [key: string]: unknown }).length !== 0
          ? JSON.stringify(data)
          : undefined

    const requestOptions = {
      method,
      signal: isAbortControllerSupported ? global.abortSignal : null,
      headers: reqHeaders,
      ...otherOptions,
      body: requestBody,
    }

    if (requestBody instanceof FormData) {
      requestOptions.headers.delete('Content-Type')
    }

    // Start timeout before fetch
    const timeoutId =
      timeout && isAbortControllerSupported
        ? setTimeout(() => {
            global.abortController.abort()

            // Execute post-timeout hook
            if (hooks?.postTimeout) {
              hooks.postTimeout(url, options)
            }
          }, timeout)
        : undefined

    const responsePromise = fetch(urlWithParams, requestOptions)

    clearTimeout(timeoutId)

    const response = await responsePromise

    const contentType = response.headers.get('content-type')

    const responseData =
      contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text()

    if (!response.ok) {
      throw createHTTPError(response, responseData)
    }

    // Execute post-request hook
    if (hooks?.postRequest) {
      hooks.postRequest(url, options, data, [null, responseData])
    }

    if (throwOnError) {
      return responseData
    }

    return [null, responseData]
  } catch (error) {
    // Execute post-request hook for errors
    if (hooks?.postRequest) {
      if (error instanceof Error) {
        hooks.postRequest(url, options, data, [error, null])
      }
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request aborted:', error)
      } else if (
        options.retryOnTimeout &&
        error.name === 'TimeoutError' &&
        options.retries &&
        options.retries > 0
      ) {
        const delay =
          options.jitter && options.jitterFactor
            ? defaultJitter(options.jitterFactor)
            : options.backoff
              ? defaultBackoff(
                  options.retries,
                  options.backoffFactor ? options.backoffFactor : DEFAULT_BACKOFF_FACTOR
                )
              : 0
        if (debug) {
          console.warn(
            `Request timed out. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`
          )
        }
        // Execute pre-retry hook
        if (hooks?.preRetry) {
          hooks.preRetry(url, options, options.retries, options.retries)
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
        const [retryErr, retryData] = await createRequest(
          url,
          { ...options, retries: options.retries - 1 },
          data
        )
        // Execute post-retry hook
        if (hooks?.postRetry) {
          hooks.postRetry(
            url,
            options,
            data,
            [retryErr, retryData],
            options.retries,
            options.retries - 1
          )
        }

        if (throwOnError) {
          throw retryErr
        }

        return [retryErr, retryData]
      } else if (options.retries && options.retries > 0) {
        const delay =
          options.jitter && options.jitterFactor
            ? defaultJitter(options.jitterFactor)
            : options.backoff
              ? defaultBackoff(
                  options.retries,
                  options.backoffFactor ? options.backoffFactor : DEFAULT_BACKOFF_FACTOR
                )
              : 0
        if (debug) {
          console.warn(
            `Request failed. Retrying in ${delay}ms... (Remaining retries: ${options.retries})`
          )
        }
        // Execute pre-retry hook
        if (hooks?.preRetry) {
          hooks.preRetry(url, options, options.retries, options.retries)
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
        const [retryErr, retryData] = await createRequest(
          url,
          { ...options, retries: options.retries - 1 },
          data
        )
        // Execute post-retry hook
        if (hooks?.postRetry) {
          hooks.postRetry(
            url,
            options,
            data,
            [retryErr, retryData],
            options.retries,
            options.retries - 1
          )
        }

        if (throwOnError) {
          throw retryErr
        }

        return [retryErr, retryData]
      } else {
        if (throwOnError) {
          throw error
        }

        return [error, null]
      }
    }

    if (throwOnError) {
      throw error
    }

    return [error as Error, null]
  }
}
