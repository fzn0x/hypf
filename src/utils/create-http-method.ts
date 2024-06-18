import type { RequestMethod } from '../types/request.js'
import type { InitOptions } from '../types/init.js'

import { createRequest } from './create-request.js'

export const createHTTPMethod = (
  url: string,
  method: RequestMethod = 'GET',
  options = Object.create(null),
  data: { [key: string]: unknown } = Object.create(null),
  initOptions?: InitOptions
) => {
  return createRequest(url, { method, ...options }, data, initOptions)
}
