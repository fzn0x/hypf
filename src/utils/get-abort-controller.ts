import { isAbortControllerSupported } from './constant.js'

/**
 * Returns the AbortController instance if supported, otherwise returns null.
 *
 * @returns {AbortController|null} The AbortController instance or null if not supported.
 */
export const getAbortController = () => (isAbortControllerSupported ? global.abortController : null)
