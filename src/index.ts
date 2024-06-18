import type { InitOptions } from './types/init.js'
import type { HttpRequestFunctions } from './types/request.js'

import { getAbortController } from './utils/get-abort-controller.js'
import { createHTTPMethod } from './utils/create-http-method.js'

function init(
  baseUrl: string = '',
  initOptions: InitOptions = Object.create(null)
): HttpRequestFunctions {
  // Check if fetch is available
  if (typeof fetch === 'undefined') {
    throw new Error('This library is intended for use in the browser environment only.')
  }

  // Override initOptions baseUrl if baseUrl exists
  if (baseUrl) {
    initOptions.baseUrl = baseUrl
  }

  return {
    get: (url, options, data) => createHTTPMethod(url, 'GET', options, data, initOptions),
    post: (url, options, data) => createHTTPMethod(url, 'POST', options, data, initOptions),
    put: (url, options, data) => createHTTPMethod(url, 'PUT', options, data, initOptions),
    delete: (url, options, data) => createHTTPMethod(url, 'DELETE', options, data, initOptions),
    patch: (url, options, data) => createHTTPMethod(url, 'PATCH', options, data, initOptions),
    head: (url, options, data) => createHTTPMethod(url, 'HEAD', options, data, initOptions),
    options: (url, options, data) => createHTTPMethod(url, 'OPTIONS', options, data, initOptions),
    getAbortController,
  }
}

export default { init }
