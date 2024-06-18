/**
 * Appends query parameters to a given URL.
 *
 * @param {string} url - The base URL to which the parameters will be appended.
 * @param {Record<string, string | number>} [params] - An optional object containing the query parameters as key-value pairs.
 *
 * @returns {string} The URL with the appended query parameters.
 */
export const appendParams = (url: string, params?: Record<string, string | number>): string => {
  if (!params) {
    return url
  }

  const urlWithParams = new URL(url)
  Object.entries(params).forEach(([key, value]) =>
    urlWithParams.searchParams.append(key, String(value))
  )

  return urlWithParams.toString()
}
