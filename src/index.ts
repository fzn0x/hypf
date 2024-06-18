import type { InitOptions } from './types/init.js'
import type { HttpRequestFunctions } from './types/request.js'

import { getAbortController } from './utils/get-abort-controller.js'
import { httpMethodFunction } from './utils/create-http-method.js'

function init(
  baseUrl: string = '',
  initOptions: InitOptions = Object.create(null)
): HttpRequestFunctions {
  // Check if fetch is available
  if (typeof fetch === 'undefined') {
    throw new Error('This library is intended for use in the browser environment only.')
  }

  // Override initOptions baseUrl if baseUrl exists
  if (baseUrl) initOptions.baseUrl = baseUrl

  return {
    get: (url, options, data) => httpMethodFunction(url, 'GET', options, data, initOptions),
    post: (url, options, data) => httpMethodFunction(url, 'POST', options, data, initOptions),
    put: (url, options, data) => httpMethodFunction(url, 'PUT', options, data, initOptions),
    delete: (url, options, data) => httpMethodFunction(url, 'DELETE', options, data, initOptions),
    patch: (url, options, data) => httpMethodFunction(url, 'PATCH', options, data, initOptions),
    options: (url, options, data) => httpMethodFunction(url, 'OPTIONS', options, data, initOptions),
    getAbortController,
  }
}

export default { init }
