interface HTTPError extends Error {
  code?: string
  request?: Request
  response: Response
  isHypfError: boolean
  originalError?: unknown
}

/**
 * Creates an HTTP error object based on the response and response data.
 *
 * @param {Response} response - The Response object from the fetch request.
 * @param {Request} request - The Request object used to make the fetch request.
 * @param {string} code - The error code to use for the error object.
 *
 * @returns {Error} An Error object with additional properties for response, request, and code.
 */
export function createHTTPError(response: Response, request?: Request, code?: string): Error {
  try {
    const title = response.statusText
    if (!code) {
      code =
        response.status || response.status === 0 ? String(response.status) : 'Unknown Status Code'
    }
    const status = `${code} ${title}`.trim()
    const reason = status ? `Status code: ${status}` : 'An unknown error occurred'

    const error = new Error(reason) as HTTPError
    error.name = 'HTTPError'
    error.code = code
    error.request = request
    error.response = response
    error.isHypfError = true

    // Maintain stack trace (optional and based on environment support)
    Object.setPrototypeOf(error, Object.getPrototypeOf(new Error()))

    return error
  } catch (e) {
    const genericError = new Error(
      'An error occurred while creating the HTTP error object'
    ) as HTTPError
    genericError.name = 'HTTPErrorCreationFailure'
    genericError.originalError = e
    genericError.isHypfError = true

    return genericError
  }
}
