/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates an HTTP error object based on the response and response data.
 *
 * @param {Response} response - The Response object from the fetch request.
 * @param {Response} responseData - The data returned in the response.
 *
 * @returns {Error} An Error object with additional properties for response and responseData.
 */
export function createHTTPError(response: Response, responseData: Response) {
  const code = response.status || response.status === 0 ? response.status : ''
  const title = response.statusText || ''
  const status = `${code} ${title}`.trim()
  const reason = status ? `status code ${status}` : 'an unknown error'
  const error = new Error(reason)

  error.name = 'HTTPError'
  ;(error as any).response = response
  ;(error as any).data = responseData

  return error
}
