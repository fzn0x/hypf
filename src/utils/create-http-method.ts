import type { RequestMethod } from '../types/request.js'
import type { InitOptions } from '../types/init.js'

import { createRequest } from './create-request.js'

/**
 * Creates and sends an HTTP request using the specified method.
 *
 * @param {string} url - The URL to send the request to.
 * @param {RequestMethod} [method='GET'] - The HTTP method to use for the request.
 * @param {object} [options=Object.create(null)] - The options for the request, including headers, retries, etc.
 * @param {object} [data=Object.create(null)] - The data to be sent with the request.
 * @param {InitOptions} [initOptions] - Initialization options including baseUrl, hooks, etc.
 *
 * @returns {Promise<[Error | null, any]>} A promise that resolves with an array containing an error (if any) and the response data.
 */
export const createHTTPMethod = (
  url: string,
  method: RequestMethod = 'GET',
  options = Object.create(null),
  data: { [key: string]: unknown } = Object.create(null),
  initOptions?: InitOptions
) => {
  return createRequest(url, { method, ...options }, data, initOptions)
}
